import { createPinia, defineStore } from 'pinia'
import { toRaw } from 'vue'
import SettingModel from '@/models/SettingModel'
import SearchItemModel from '@/models/SearchItemModel'
import CategoryModel from '@/models/CategoryModel'
import { sync } from 'utools-utils/storage'
import { StoreKey } from '@/constant'
import { toMap, moveItems, isIllegalIndex } from '@/utils/collections'
import * as category from '@/api/category'
import * as search from '@/api/search'
import * as feature from '@/api/feature'

export const useMainStore = defineStore('main', {
  state: () => {
    const setting = sync.getOrDefault(StoreKey.SETTING, new SettingModel())

    if (SettingModel.migrateDatabase(setting)) {
      console.log('database migrated:', setting)
      sync.set(StoreKey.SETTING, setting)
    }

    const searchItems = search.getList()

    // 先移除所有，再生成 Feature
    feature.removeFeatures()
    for (const item of searchItems) {
      if (item.enabled === false) continue
      feature.addFeature(item)
    }

    return {
      setting,
      searchItems,
      map: toMap(
        searchItems,
        (item) => item.id,
        (item, index) => index
      )
    }
  },
  actions: {
    _getIndex(itemId: number) {
      return this.map.get(itemId) ?? -1
    },
    // 设置 id 到 index 的映射
    _setIndex(itemId: number, index: number) {
      this.map.set(itemId, index)
    },
    // 移除 id 到 index 的映射
    _removeIndex(itemId: number) {
      this.map.delete(itemId)
    },
    getSearchItem(itemId: number | string) {
      if (typeof itemId === 'string') {
        itemId = parseInt(itemId)
      }
      const index = this._getIndex(itemId)
      return this.searchItems[index]
    },
    moveSearchItems(fromItemId: number, toItemId: number) {
      const fromIndex = this._getIndex(fromItemId)
      const toIndex = this._getIndex(toItemId)

      moveItems(this.searchItems, fromIndex, toIndex, (oldIndex, newIndex) => {
        this._setIndex(this.searchItems[newIndex].id, newIndex)
      })
      search.saveItemIds(this.searchItems.map((item) => item.id))
    },
    addSearchItem(item: SearchItemModel) {
      SearchItemModel.checkSearchItem(item)

      this.searchItems.push(item)
      this._setIndex(item.id, this.searchItems.length - 1)
      const raw = toRaw(item)
      search.addItem(raw)
      feature.addFeature(raw)
    },
    updateSearchItem(itemId: number, item: SearchItemModel) {
      const index = this._getIndex(itemId)

      SearchItemModel.checkSearchItem(item)

      this.searchItems[index] = item
      const raw = toRaw(item)
      search.updateItem(raw)
      feature.updateFeature(raw)
    },
    removeSearchItem(itemId: number) {
      const index = this._getIndex(itemId)

      const item = this.searchItems[index]
      this.searchItems.splice(index, 1)
      // 更新 map 到 index 的映射
      this.searchItems.forEach((item, index) => {
        this._setIndex(item.id, index)
      })
      this._removeIndex(item.id)
      search.removeItem(item.id)
      feature.removeFeature(item.id)
    },
    updateEnabledStatus(itemId: number, enabled: boolean) {
      const index = this._getIndex(itemId)

      this.searchItems[index].enabled = enabled
      const raw = toRaw(this.searchItems[index])
      search.updateItem(raw)
      if (enabled) {
        feature.addFeature(raw)
      } else {
        feature.removeFeature(raw.id)
      }
    },
    hasSearchItem(categoryId: string) {
      return !!this.searchItems.find((item) => item.categoryId === categoryId)
    }
  }
})

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: category.getList()
  }),
  getters: {
    allCategories(): Array<CategoryModel> {
      return [CategoryModel.ALL, ...this.categories]
    }
  },
  actions: {
    getCategory(categoryId: string) {
      const binarySearch = () => {
        let l = 0
        let r = this.categories.length - 1
        while (l <= r) {
          const m = (l + r) >> 1
          const diff = this.categories[m].id.localeCompare(categoryId)
          if (diff === 0) return m
          if (diff > 0) r = m - 1
          else l = m + 1
        }
        return -1
      }
      return this.categories[binarySearch()]
    },
    addCategory(name: string) {
      const last = this.categories[this.categories.length - 1]
      // 生成分类ID
      const categoryId = (parseInt(last.id) + 1).toString()
      const model = new CategoryModel(categoryId, name)
      this.categories.push(model)
      category.save(toRaw(this.categories))
    },
    updateCategory(index: number, name: string) {
      if (isIllegalIndex(this.categories, index)) return

      this.categories[index].text = name
      category.save(toRaw(this.categories))
    },
    removeCategory(index: number) {
      if (isIllegalIndex(this.categories, index)) return

      this.categories.splice(index, 1)
      category.save(toRaw(this.categories))
    }
  }
})

const pinia = createPinia()
export default pinia
