<template>
  <div class="h-full w-full overflow-y-auto overflow-x-hidden">
    <table class="w-full table-fixed">
      <thead class="top-0 z-10 bg-white text-sm dark:bg-utools-black">
        <tr class="h-7">
          <th class="table-head w-4/12 pl-4 pr-2">名称</th>
          <th class="table-head w-5/12">URL</th>
          <th class="table-head w-1/12">分类</th>
          <th class="table-head w-1/12">关键字</th>
          <th class="table-head w-1/12">启用</th>
        </tr>
      </thead>
      <TransitionGroup name="list" tag="tbody">
        <tr
          v-for="(row, index) in table"
          :key="`${row.title}-${index}`"
          class="h-14 transition duration-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
          :class="{ 'bg-gray-300 dark:bg-neutral-500': hoverIndex === index }"
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
            :builtin="isBuiltinItem(row.id)"
            @row-click="handleItemClick(index, row)"
            @enabled-change="handleEnabledChange(index, row, $event)"
          ></SearchRow>
        </tr>
      </TransitionGroup>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchRow from './SearchRow.vue'
import SearchItemModel from '@/models/SearchItemModel'

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

defineProps<{ table: Array<SearchRowProp> }>()

const emit = defineEmits(['item-enabled-change', 'item-click', 'drop-item'])

function isBuiltinItem(itemId: number) {
  return (
    SearchItemModel.DEFAULT_SEARCH_ITEMS.findIndex(
      (item) => item.id === itemId
    ) !== -1
  )
}

function handleEnabledChange(
  index: number,
  row: SearchRowProp,
  enabled: boolean
) {
  emit('item-enabled-change', { index, row, enabled })
}

function handleItemClick(index: number, row: SearchRowProp) {
  emit('item-click', { index, row })
}

function handleDragStartEvent(e: DragEvent, itemId: number) {
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('fromItemId', itemId.toString())
}

const hoverIndex = ref<number>(-1)

function handleDragEnterEvent(e: Event, index: number) {
  hoverIndex.value = index
}

function handleDropEvent(e: DragEvent, toItemId: number) {
  hoverIndex.value = -1
  const fromItemId = e.dataTransfer!.getData('fromItemId')
  emit('drop-item', { fromItemId: parseInt(fromItemId), toItemId })
}
</script>

<style lang="sass" scoped>
.table-head
  @apply text-left truncate

list-move,.list-enter-active,.list-leave-active
  transition: all 0.3s ease

.list-enter-from,.list-leave-to
  opacity: 0
  transform: translateY(30px)

.list-leave-active
  position: absolute
</style>
