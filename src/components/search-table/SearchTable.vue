<template>
  <div class="h-full overflow-x-hidden overflow-y-auto">
    <table class="w-full table-fixed bg-inherit">
      <thead class="sticky top-0 text-sm bg-white dark:bg-utools-black z-10">
        <tr class="h-7">
          <th class="table-head w-4/12 pl-4 pr-2">名称</th>
          <th class="table-head w-5/12">URL</th>
          <th class="table-head w-1/12">分类</th>
          <th class="table-head w-1/12">关键字</th>
          <th class="table-head w-1/12">启用</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in table"
          :key="`${row.title}-${index}`"
          class="h-14 hover:bg-gray-100 dark:hover:bg-neutral-700 transition duration-300"
          :class="{'bg-gray-300 dark:bg-neutral-500': hoverIndex === index}"
          draggable="true"
          @dragstart="handleDragStartEvent($event, row.id)"
          @dragenter="handleDragEnterEvent($event, index)"
          @drop="handleDropEvent($event, row.id)"
          @dragover.prevent
        >
          <SearchRow
            :icon="row.icon || 'logo.png'"
            :title="row.title"
            :subtitle="row.subtitle"
            :url="row.url"
            :keyword="row.keyword"
            :enabled="row.enabled"
            :category-id="row.categoryId"
            @row-click="handleItemClick(index, row)"
            @enabled-change="handleEnabledChange(index, row, $event)"
          ></SearchRow>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import SearchRow from './SearchRow.vue'
import {ref} from 'vue'

interface SearchRowProp {
  id: number
  icon?: string
  title: string
  subtitle: string
  url: string
  keyword?: string
  enabled?: boolean
  categoryId: string
}

defineProps<{table: Array<SearchRowProp>}>()

const emits = defineEmits(['item-enabled-change', 'item-click', 'drop-item'])
const handleEnabledChange = (
  index: number,
  row: SearchRowProp,
  enabled: boolean
) => {
  emits('item-enabled-change', {index, row, enabled})
}
const handleItemClick = (index: number, row: SearchRowProp) => {
  emits('item-click', {index, row})
}

const hoverIndex = ref<number>(-1)
const handleDragStartEvent = (e: any, itemId: number) => {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('fromItemId', itemId)
}
const handleDragEnterEvent = (e: any, index: number) => {
  hoverIndex.value = index
}
const handleDropEvent = (e: any, toItemId: number) => {
  hoverIndex.value = -1
  const fromItemId = e.dataTransfer.getData('fromItemId')
  emits('drop-item', {fromItemId: parseInt(fromItemId), toItemId})
}
</script>

<style lang="sass" scoped>
.table-head
  @apply text-left truncate
</style>
