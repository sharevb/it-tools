import { type MaybeRef, get } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import FlexSearch from 'flexsearch';

// Define key types to match Fuse.js format
type SearchKey = string | { name: string; weight?: number };

export function useFlexSearch<Data extends Record<string, any>>({
  search,
  data,
  options = {
    keys: [],
  },
  limit = -1,
}: {
  search: MaybeRef<string>
  data: Data[]
  options?: {
    keys: SearchKey[]
    /**
     * Whether to show or not show items with an empty search query. `true` won't show any items, `false` will show all items.
     * @default true
     */
    filterEmpty?: boolean
    /**
     * Whether the results should be sorted by similarity score using the Levenshtein distance.
     * @default true
     */
    shouldSort?: boolean
    /**
     * Type of tokenization logic to use (Determines how the search logic will behave).
     * @default 'forward'
     * @see {@link https://github.com/nextapps-de/flexsearch?tab=readme-ov-file#tokenizer-partial-match | FlexSearch Tokenizer Documentation}
     *
     * Note: The `'tolerant'` tokenizer option mentioned in the documentation doesn't exist anymore in the current version of FlexSearch.
     */
    tokenize?: 'strict' | 'forward' | 'reverse' | 'full'
    resolution?: number
    optimize?: boolean
    cache?: boolean | number
  }
  limit?: MaybeRef<number>
}) {
  // Extract options
  const { keys, filterEmpty = true, shouldSort = true, tokenize = 'forward', ...indexOptions } = options;

  // Normalize keys to include weights
  const normalizedKeys = keys.map((key) => {
    if (typeof key === 'string') {
      return { name: key, weight: 1 };
    }
    return { name: key.name, weight: key.weight ?? 1 };
  });

  // Helper to get unique key for each item (prefer 'id', fallback to index)
  const getItemKey = (item: Data, idx: number) => (item.id !== undefined ? item.id : idx);

  // Map to store original data items by unique key
  const dataMap = ref(new Map<any, Data>());

  // Create separate indices for each key with weight info
  const indices = normalizedKeys.map(({ name, weight }) => ({
    key: name,
    weight,
    index: new FlexSearch.Index({
      tokenize,
      preset: 'performance',
      resolution: 9,
      optimize: true,
      cache: 100,
      fastupdate: true,
      ...indexOptions,
    }),
  }));

  // Initialize indices with data
  const initializeIndices = () => {
    dataMap.value.clear();
    indices.forEach(({ index }) => index.clear());

    data.forEach((item, idx) => {
      const itemKey = getItemKey(item, idx);
      dataMap.value.set(itemKey, item);

      indices.forEach(({ key, index }) => {
        // Support nested keys (e.g., 'foo.bar')
        const value = key.split('.').reduce((obj, path) => obj?.[path], item);
        if (value) {
          index.add(itemKey, String(value));
        }
      });
    });
  };

  // Initialize on creation
  initializeIndices();

  // Watch for data changes (deep watch for array content)
  watch(
    () => data,
    initializeIndices,
    { deep: true },
  );

  // Function to search across all indices with weight consideration
  const searchAllIndices = (query: string, searchLimit: number) => {
    if (!query) {
      return [];
    }

    // Use a higher individual limit for each index to ensure we don't miss potential matches
    const individualLimit = searchLimit > 0 ? searchLimit * 2 : undefined;

    // Search each index and collect results with weights
    const weightedResults = new Map<any, { score: number; maxWeight: number }>();

    indices.forEach(({ index, weight }) => {
      const results = index.search(query, individualLimit ? { limit: individualLimit } : undefined);

      results.forEach((id) => {
        const current = weightedResults.get(id) || { score: 0, maxWeight: 0 };
        // Use the maximum weight among matching fields as the primary score
        // Add a small bonus for additional field matches
        const newScore = Math.max(current.score, weight * 100) + (weight * 10);
        const newMaxWeight = Math.max(current.maxWeight, weight);

        weightedResults.set(id, {
          score: newScore,
          maxWeight: newMaxWeight,
        });
      });
    });

    // Sort by score (higher score = better match) and convert to array
    const sortedIds = Array.from(weightedResults.entries())
      .sort((a, b) => {
        // First sort by max weight, then by total score
        if (b[1].maxWeight !== a[1].maxWeight) {
          return b[1].maxWeight - a[1].maxWeight;
        }
        return b[1].score - a[1].score;
      })
      .map(([id]) => id);

    // Apply limit and convert back to original items
    const limitedIds = searchLimit > 0 ? sortedIds.slice(0, searchLimit) : sortedIds;

    // Return the limited results early if it shouldn't be sorted by similarity
    if (!shouldSort) {
      return limitedIds
        .map(id => dataMap.value.get(id))
        .filter(Boolean) as Data[];
    }

    // Calculate Levenshtein distance
    const levenshteinDistance = (str1: string, str2: string): number => {
      const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

      for (let i = 0; i <= str1.length; i++) {
        matrix[0][i] = i;
      }
      for (let j = 0; j <= str2.length; j++) {
        matrix[j][0] = j;
      }

      for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1, // deletion
            matrix[j - 1][i] + 1, // insertion
            matrix[j - 1][i - 1] + indicator, // substitution
          );
        }
      }

      return matrix[str2.length][str1.length];
    };

    // Calculate similarity score (0-1, where 1 is perfect match)
    const calculateSimilarity = (str1: string, str2: string): number => {
      const maxLength = Math.max(str1.length, str2.length);
      if (maxLength === 0) {
        return 1;
      }

      const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
      return 1 - (distance / maxLength);
    };

    // Sort limited results by similarity score, but maintain weight priority
    const sortedResults = limitedIds
      .map((id) => {
        const item = dataMap.value.get(id);
        if (!item) {
          return null;
        }

        // Calculate weighted similarity score across all searchable fields
        let bestWeightedSimilarity = 0;
        let maxFieldWeight = 0;

        normalizedKeys.forEach(({ name, weight }) => {
          const value = name.split('.').reduce((obj, path) => obj?.[path], item);
          if (value) {
            const similarity = calculateSimilarity(query, String(value));
            const weightedSimilarity = similarity * weight;

            if (weightedSimilarity > bestWeightedSimilarity) {
              bestWeightedSimilarity = weightedSimilarity;
              maxFieldWeight = weight;
            }
          }
        });

        return {
          item,
          similarity: bestWeightedSimilarity,
          maxWeight: maxFieldWeight,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // First sort by max field weight, then by weighted similarity
        if (b!.maxWeight !== a!.maxWeight) {
          return b!.maxWeight - a!.maxWeight;
        }
        return b!.similarity - a!.similarity;
      })
      .map(result => result!.item);

    return sortedResults as Data[];
  };

  // Computed results
  const searchResult = computed<Data[]>(() => {
    const query = get(search);
    const searchLimit: number = get(limit);

    // Handle empty query case
    if (!query && !filterEmpty) {
      return searchLimit > 0 ? data.slice(0, searchLimit) : data;
    }

    if (!query) {
      return [];
    }

    return searchAllIndices(query, searchLimit);
  });

  return { searchResult };
}
