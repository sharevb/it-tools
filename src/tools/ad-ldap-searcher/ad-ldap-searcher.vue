<script setup lang="ts">
import mappingData from './ad-mapping.json';
import { useFlexSearch } from '@/composable/flexSearch';

const data = mappingData;
const search = ref('');

const { searchResult } = useFlexSearch({
  search,
  data,
  options: {
    keys: ['TAB', 'ActiveDirectoryField', 'LDAPAttribute'],
    filterEmpty: false,
  },
});
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div flex items-center gap-3>
      <c-input-text
        v-model:value="search"
        placeholder="Search Active Directory LDAP mapping"
        mx-auto max-w-600px
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <div>
      <div
        v-if="searchResult.length === 0"

        mt-4 text-center text-20px font-bold
      >
        No results
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          Search result
        </div>

        <n-table>
          <thead>
            <th>TAB</th>
            <th>Active Directory Field</th>
            <th>LDAP Attribute</th>
          </thead>
          <tbody>
            <tr v-for="(result, ix) in searchResult" :key="ix">
              <td>
                <input-copyable :value="result.TAB" />
              </td>
              <td>
                <input-copyable :value="result.ActiveDirectoryField" />
              </td>
              <td>
                <input-copyable :value="result.LDAPAttribute" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </div>
</template>
