import { type MaybeRef, get } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import FlexSearch from 'flexsearch';

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
    keys: string[]
    filterEmpty?: boolean
    tokenize?: 'strict' | 'forward' | 'reverse' | 'full'
    resolution?: number
    optimize?: boolean
    cache?: boolean | number
  }
  limit?: MaybeRef<number>
}) {
  // Extract options
  const { keys, filterEmpty = true, ...indexOptions } = options;

  // Create a map to store original data items
  const data_map = ref(new Map<number, Data>());

  // Create separate indices for each key
  const indices = keys.map((key) => {
    return {
      key,
      index: new FlexSearch.Index({
        tokenize: 'forward',
        preset: 'performance',
        resolution: 9,
        optimize: true,
        cache: 100,
        fastupdate: true,
        ...indexOptions,
      }),
    };
  });

  // Initialize indices with data
  const initialize_indices = () => {
    data_map.value.clear();

    data.forEach((item, idx) => {
      // Store original item
      data_map.value.set(idx, item);

      // Add to each field index
      indices.forEach(({ key, index }) => {
        // Get the value for this key, potentially from nested paths
        const value = key.split('.').reduce((obj, path) => obj?.[path], item);
        if (value) {
          index.add(idx, String(value));
        }
      });
    });
  };

  // Initialize on creation
  initialize_indices();

  // Function to search across all indices
  const search_all_indices = (query: string, search_limit: number) => {
    if (!query) {
      return [];
    }

    // Use a higher individual limit for each index to ensure we don't miss potential matches
    const individual_limit = search_limit > 0 ? search_limit * 2 : undefined;

    // Search each index
    const result_sets = indices.map(({ index }) =>
      index.search(query, individual_limit ? { limit: individual_limit } : undefined),
    );

    // Combine and deduplicate results
    const unique_ids = new Set<number>();
    result_sets.forEach((results) => {
      results.forEach(id => unique_ids.add(id as number));
    });

    // Convert back to array of original items
    const result_array = Array.from(unique_ids)
      .map(id => data_map.value.get(id))
      .filter(Boolean) as Data[];

    // Apply the limit to the final combined results
    return search_limit > 0 ? result_array.slice(0, search_limit) : result_array;
  };

  // Watch for data changes to rebuild indices
  watch(() => data.length, initialize_indices);

  // Computed results
  const searchResult = computed<Data[]>(() => {
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

  return { searchResult };
}
