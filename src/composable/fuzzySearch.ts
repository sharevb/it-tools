import { type MaybeRef, get } from '@vueuse/core';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { computed } from 'vue';
import { useFlexSearch } from './flexSearch';

export { useFuzzySearch };

/**
 * @deprecated This composable is deprecated and will be removed in a future version.
 * Use {@link useFlexSearch} instead.
 */
function useFuzzySearch<Data>({
  search,
  data,
  options = {},
  limit = -1,
}: {
  search: MaybeRef<string>
  data: Data[]
  options?: IFuseOptions<Data> & { filterEmpty?: boolean }
  limit?: number
}) {
  const fuse = new Fuse(data, options);
  const filterEmpty = options.filterEmpty ?? true;

  const searchResult = computed<Data[]>(() => {
    const query = get(search);

    if (!filterEmpty && query === '') {
      return data;
    }

    return fuse.search(query, { limit }).map(({ item }) => item);
  });

  return { searchResult };
}
