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
<<<<<<< HEAD
  const { keys, filterEmpty = true, tokenize = 'forward', ...index_options } = options;

  // Normalize keys to include weights
  const normalized_keys = keys.map((key) => {
=======
  const { keys, filterEmpty = true, tokenize = 'forward', ...indexOptions } = options;

  // Normalize keys to include weights
  const normalizedKeys = keys.map((key) => {
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
    if (typeof key === 'string') {
      return { name: key, weight: 1 };
    }
    return { name: key.name, weight: key.weight ?? 1 };
  });

  // Helper to get unique key for each item (prefer 'id', fallback to index)
<<<<<<< HEAD
  const get_item_key = (item: Data, idx: number) => (item.id !== undefined ? item.id : idx);

  // Map to store original data items by unique key
  const data_map = ref(new Map<any, Data>());

  // Create separate indices for each key with weight info
  const indices = normalized_keys.map(({ name, weight }) => ({
=======
  const getItemKey = (item: Data, idx: number) => (item.id !== undefined ? item.id : idx);

  // Map to store original data items by unique key
  const dataMap = ref(new Map<any, Data>());

  // Create separate indices for each key with weight info
  const indices = normalizedKeys.map(({ name, weight }) => ({
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
    key: name,
    weight,
    index: new FlexSearch.Index({
      tokenize,
      preset: 'performance',
      resolution: 9,
      optimize: true,
      cache: 100,
      fastupdate: true,
<<<<<<< HEAD
      ...index_options,
=======
      ...indexOptions,
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
    }),
  }));

  // Initialize indices with data
<<<<<<< HEAD
  const initialize_indices = () => {
    data_map.value.clear();
    indices.forEach(({ index }) => index.clear());

    data.forEach((item, idx) => {
      const item_key = get_item_key(item, idx);
      data_map.value.set(item_key, item);
=======
  const initializeIndices = () => {
    dataMap.value.clear();
    indices.forEach(({ index }) => index.clear());

    data.forEach((item, idx) => {
      const itemKey = getItemKey(item, idx);
      dataMap.value.set(itemKey, item);
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd

      indices.forEach(({ key, index }) => {
        // Support nested keys (e.g., 'foo.bar')
        const value = key.split('.').reduce((obj, path) => obj?.[path], item);
        if (value) {
<<<<<<< HEAD
          index.add(item_key, String(value));
=======
          index.add(itemKey, String(value));
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
        }
      });
    });
  };

  // Initialize on creation
  initializeIndices();

  // Watch for data changes (deep watch for array content)
  watch(
    () => data,
<<<<<<< HEAD
    initialize_indices,
=======
    initializeIndices,
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
    { deep: true },
  );

  // Function to search across all indices with weight consideration
<<<<<<< HEAD
  const search_all_indices = (query: string, search_limit: number) => {
=======
  const searchAllIndices = (query: string, searchLimit: number) => {
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
    if (!query) {
      return [];
    }

    // Use a higher individual limit for each index to ensure we don't miss potential matches
    const individualLimit = searchLimit > 0 ? searchLimit * 2 : undefined;

    // Search each index and collect results with weights
<<<<<<< HEAD
    const weighted_results = new Map<any, number>();

    indices.forEach(({ index, weight }) => {
      const results = index.search(query, individual_limit ? { limit: individual_limit } : undefined);

      results.forEach((id) => {
        const current_score = weighted_results.get(id) || 0;
        weighted_results.set(id, current_score + weight);
=======
    const weightedResults = new Map<any, number>();

    indices.forEach(({ index, weight }) => {
      const results = index.search(query, individualLimit ? { limit: individualLimit } : undefined);

      results.forEach((id) => {
        const currentScore = weightedResults.get(id) || 0;
        weightedResults.set(id, currentScore + weight);
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
      });
    });

    // Sort by weight (higher weight = better match) and convert to array
<<<<<<< HEAD
    const sorted_ids = Array.from(weighted_results.entries())
=======
    const sortedIds = Array.from(weightedResults.entries())
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    // Apply limit and convert back to original items
<<<<<<< HEAD
    const limited_ids = search_limit > 0 ? sorted_ids.slice(0, search_limit) : sorted_ids;

    return limited_ids
      .map(id => data_map.value.get(id))
=======
    const limitedIds = searchLimit > 0 ? sortedIds.slice(0, searchLimit) : sortedIds;

    return limitedIds
      .map(id => dataMap.value.get(id))
>>>>>>> 9e0af7983d7b2eab93df67d5b7d4e68c5cdce6cd
      .filter(Boolean) as Data[];
  };

  // Computed results
  const search_result = computed<Data[]>(() => {
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

  return { searchResult: search_result };
}
