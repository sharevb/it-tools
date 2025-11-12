<script setup lang="ts">
import type { EmvTag } from 'node-emv';

defineProps<{
  tags: EmvTag[]
  title?: string
}>();
</script>

<template>
  <NCollapse :default-expanded-names="['root']">
    <NCollapseItem :title="title" name="root">
      <NTable :bordered="true" :single-line="false">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Length</th>
            <th>Value</th>
            <th>Description</th>
            <th>Bit-Level Interpretation</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(tag, index) in tags" :key="index">
            <tr>
              <td>{{ tag.tag }}</td>
              <td>{{ tag.length }}</td>
              <td>{{ Array.isArray(tag.value) ? 'has nested tags' : tag.value }}</td>
              <td>{{ tag.description }}</td>
              <td>
                <ul v-if="tag.bitDetails?.length">
                  <li v-for="(bitDesc, i) in tag.bitDetails" :key="i">
                    {{ bitDesc }}
                  </li>
                </ul>
                <span v-else>—</span>
              </td>
            </tr>
            <tr v-if="Array.isArray(tag.value)">
              <td colspan="5" style="padding-left: 2em;">
                <TLVTagTree :tags="tag.value" :title="`Nested in ${tag.tag}`" />
              </td>
            </tr>
          </template>
        </tbody>
      </NTable>
    </NCollapseItem>
  </NCollapse>
</template>
