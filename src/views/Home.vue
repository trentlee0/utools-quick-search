<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-start px-4 pt-1.5 pb-1">
      <div class="h-9 w-64">
        <SearchInput ref="searchInputRef" v-model="searchKeyword"></SearchInput>
      </div>

      <div class="ml-10">
        <Select
          class="w-28"
          v-model="categoryId"
          :items="categoryStore.allCategories"
        ></Select>
      </div>
    </div>

    <ItemTable
      @item-enabled-change="handleItemEnabledChange"
      @item-click="handleItemClick"
      :table="filteredTable"
      @drop-item="handleDroptItem"
    >
    </ItemTable>
    <Btn
      type="float"
      class="bg-blue-500 text-white shadow-2xl"
      @click="handleAddBtnClick"
    >
      <Icon :icon="mdiPlus" size="medium"></Icon>
    </Btn>
  </div>
</template>

<script setup lang="ts">
import ItemTable from '@/components/home/ItemTable.vue'
import SearchInput from '@/components/home/SearchInput.vue'
import Btn from '@/components/common/Btn.vue'
import Icon from '@/components/common/Icon.vue'
import Select from '@/components/common/Select.vue'

import ItemModel from '@/models/ItemModel'
import { ref, watchEffect, computed, onUnmounted, onMounted } from 'vue'
import { useCategoryStore, useMainStore } from '@/store'
import { useRouter } from 'vue-router'
import CategoryModel from '@/models/CategoryModel'
import { mdiPlus } from '@mdi/js'
import { useSavedScroll } from '@/hooks/useSavedScroll'

const router = useRouter()
const mainStore = useMainStore()
const categoryStore = useCategoryStore()

const categoryId = ref(CategoryModel.ALL.id)

function handleItemEnabledChange(value: {
  row: ItemModel
  enabled: boolean
}) {
  const { row, enabled } = value
  mainStore.updateEnabledStatus(row.id, enabled)
}
function handleDroptItem(value: { fromItemId: number; toItemId: number }) {
  const { fromItemId, toItemId } = value
  mainStore.moveSearchItems(fromItemId, toItemId)
}

function handleItemClick(value: { row: ItemModel }) {
  const { row } = value
  if (row.enabled !== false) {
    router.push(`/info/categories/${row.categoryId}/items/${row.id}`)
  }
}

function handleAddBtnClick() {
  let realCategoryId = CategoryModel.DEFAULT.id
  if (categoryId.value !== CategoryModel.ALL.id) {
    realCategoryId = categoryStore.getCategory(categoryId.value).id
  }
  router.push(`/info/categories/${realCategoryId}/items/`)
}

const table = computed(() => mainStore.searchItems)
const searchKeyword = ref<string>('')
const filteredTable = ref<Array<ItemModel>>([])

watchEffect(() => {
  const search = searchKeyword.value?.toUpperCase()
  filteredTable.value = table.value
    .filter(
      (item) =>
        categoryId.value === CategoryModel.ALL.id ||
        item.categoryId === categoryId.value
    )
    .filter(
      (item) =>
        !search ||
        item.title.toUpperCase().includes(search) ||
        item.subtitle.toUpperCase().includes(search) ||
        categoryStore
          .getCategory(item.categoryId)
          .text.toUpperCase()
          .includes(search) ||
        item.keyword?.toUpperCase().includes(search)
    )
})

const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null)

onMounted(() => {
  searchInputRef.value?.focus()
})

onUnmounted(() => {
  console.log('home onUnmounted')
  searchKeyword.value = ''
  document.documentElement.scrollTo({ top: 0 })
})

useSavedScroll(document.documentElement)
</script>

<style lang="sass" scoped></style>
