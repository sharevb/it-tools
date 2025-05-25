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
    filterEmpty?: boolean
    tokenize?: 'strict' | 'forward' | 'reverse' | 'full'
    resolution?: number
    optimize?: boolean
    cache?: boolean | number
  }
  limit?: MaybeRef<number>
}) {
  // Extract options
  const { keys, filterEmpty = true, tokenize = 'forward', ...index_options } = options;

  // Normalize keys to include weights
  const normalized_keys = keys.map((key) => {
    if (typeof key === 'string') {
      return { name: key, weight: 1 };
    }
    return { name: key.name, weight: key.weight ?? 1 };
  });

  // Helper to get unique key for each item (prefer 'id', fallback to index)
  const get_item_key = (item: Data, idx: number) => (item.id !== undefined ? item.id : idx);

  // Map to store original data items by unique key
  const data_map = ref(new Map<any, Data>());

  // Create separate indices for each key with weight info
  const indices = normalized_keys.map(({ name, weight }) => ({
    key: name,
    weight,
    index: new FlexSearch.Index({
      tokenize,
      preset: 'performance',
      resolution: 9,
      optimize: true,
      cache: 100,
      fastupdate: true,
      ...index_options,
    }),
  }));

  // Initialize indices with data
  const initialize_indices = () => {
    data_map.value.clear();
    indices.forEach(({ index }) => index.clear());

    data.forEach((item, idx) => {
      const item_key = get_item_key(item, idx);
      data_map.value.set(item_key, item);

      indices.forEach(({ key, index }) => {
        // Support nested keys (e.g., 'foo.bar')
        const value = key.split('.').reduce((obj, path) => obj?.[path], item);
        if (value) {
          index.add(item_key, String(value));
        }
      });
    });
  };

  // Initialize on creation
  initialize_indices();

  // Watch for data changes (deep watch for array content)
  watch(
    () => data,
    initialize_indices,
    { deep: true },
  );

  // Function to search across all indices with weight consideration
  const search_all_indices = (query: string, search_limit: number) => {
    if (!query) {
      return [];
    }

    // Use a higher individual limit for each index to ensure we don't miss potential matches
    const individual_limit = search_limit > 0 ? search_limit * 2 : undefined;

    // Search each index and collect results with weights
    const weighted_results = new Map<any, number>();

    indices.forEach(({ index, weight }) => {
      const results = index.search(query, individual_limit ? { limit: individual_limit } : undefined);

      results.forEach((id) => {
        const current_score = weighted_results.get(id) || 0;
        weighted_results.set(id, current_score + weight);
      });
    });

    // Sort by weight (higher weight = better match) and convert to array
    const sorted_ids = Array.from(weighted_results.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    // Apply limit and convert back to original items
    const limited_ids = search_limit > 0 ? sorted_ids.slice(0, search_limit) : sorted_ids;

    return limited_ids
      .map(id => data_map.value.get(id))
      .filter(Boolean) as Data[];
  };

  // Computed results
  const search_result = computed<Data[]>(() => {
    const query = get(search);
    const search_limit: number = get(limit);

    // Handle empty query case
    if (!query && !filterEmpty) {
      return search_limit > 0 ? data.slice(0, search_limit) : data;
    }

    if (!query) {
      return [];
    }

    return search_all_indices(query, search_limit);
  });

  return { searchResult: search_result };
}
