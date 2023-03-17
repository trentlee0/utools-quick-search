<template>
  <div class="h-full flex flex-col">
    <div class="px-4 pt-1.5 pb-1 flex justify-start items-center">
      <div class="h-9 w-64">
        <SearchInput autofocus v-model:value="searchKeyword"></SearchInput>
      </div>

      <div class="ml-10">
        <Select
          class="w-28"
          v-model:value="categoryId"
          :items="categories"
        ></Select>
      </div>
    </div>

    <SearchTable
      id="mainTable"
      @item-enabled-change="handleItemEnabledChange"
      @item-click="handleItemClick"
      :table="filteredTable"
      @drop-item="handleDroptItem"
    >
    </SearchTable>
    <Btn
      type="float"
      class="text-white bg-blue-500 shadow-xl"
      @click="handleAddBtnClick"
    >
      <Icon size="medium" type="mdiPlus"></Icon>
    </Btn>
  </div>
</template>

<script setup lang="ts">
import SearchTable from '@/components/search-table/SearchTable.vue'
import SearchInput from '@/components/search-item-form/SearchInput.vue'
import Btn from '@/components/common/Btn.vue'
import Icon from '@/components/common/Icon.vue'
import Select from '@/components/common/Select.vue'

import SearchItemModel from '@/models/SearchItemModel'
import {ref, watchEffect, computed} from 'vue'
import {useCategoryStore, useMainStore} from '@/store'
import {useRouter} from 'vue-router'
import CategoryModel from '@/models/CategoryModel'
import {useSavedScroll} from '@/hooks/useSavedScroll'
import {isUTools} from '@/utils/common'

const router = useRouter()
const mainStore = useMainStore()
const categoryStore = useCategoryStore()

const categoryId = ref<string>(CategoryModel.AGGREGATION.id)
const categories = computed(() => {
  return [CategoryModel.AGGREGATION, ...categoryStore.categories]
})

const handleItemEnabledChange = (value: {
  row: SearchItemModel
  enabled: boolean
}) => {
  const {row, enabled} = value
  mainStore.updateEnabledStatus(row.id, enabled)
}
const handleDroptItem = (value: {fromItemId: number; toItemId: number}) => {
  const {fromItemId, toItemId} = value
  mainStore.moveSearchItems(fromItemId, toItemId)
}

const handleItemClick = (value: {row: SearchItemModel}) => {
  const {row} = value
  if (row.enabled === undefined || row.enabled) {
    router.push(`/info/categories/${row.categoryId}/items/${row.id}`)
  }
}

const handleAddBtnClick = () => {
  let realCategoryId = CategoryModel.DEFAULT.id
  if (categoryId.value !== CategoryModel.AGGREGATION.id) {
    realCategoryId = categoryStore.getCategory(categoryId.value).id
  }
  router.push(`/info/categories/${realCategoryId}/items/`)
}

const table = computed(() => mainStore.searchItems)
const searchKeyword = ref<string>('')
const filteredTable = ref<Array<SearchItemModel>>([])

watchEffect(() => {
  const search = searchKeyword.value?.toUpperCase()
  filteredTable.value = table.value
    .filter((item) => {
      if (categoryId.value === CategoryModel.AGGREGATION.id) return true
      return item.categoryId === categoryId.value
    })
    .filter((item) => {
      if (!search) return true
      return item.title.toUpperCase().includes(search)
    })
})

useSavedScroll('#mainTable')

if (isUTools()) {
  utools.onPluginOut(() => {
    searchKeyword.value = ''
  })
}
</script>

<style lang="sass" scoped></style>
