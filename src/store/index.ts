import {defineStore} from 'pinia'
import {toRaw} from 'vue'
import SettingModel from '@/models/SettingModel'
import SearchItemModel from '@/models/SearchItemModel'
import CategoryModel from '@/models/CategoryModel'
import storage from '@/utils/storage'
import {StoreKey} from '@/constant'
import {toMap, promisify, moveItems} from '@/utils/common'
import * as category from '@/api/category'
import * as search from '@/api/search'
import * as feature from '@/api/feature'

function checkSearchItem(item: SearchItemModel) {
  // 检查子标题是否存在，如果不存在赋默认值
  item.subtitle = item.subtitle || '默认应用打开'
  // 只有输入应用的路径才限定平台
  if (item.app) {
    const getPlatform = () => {
      if (utools.isWindows()) return 'win32'
      if (utools.isMacOS()) return 'darwin'
      return 'linux'
    }
    item.platform = getPlatform()
  } else {
    item.platform = ['win32', 'darwin', 'linux']
  }
}

export const useMainStore = defineStore('main', {
  state: () => {
    const searchItems = search.getData()
    searchItems.forEach((item) => {
      if (item.enabled === undefined || item.enabled) {
        feature.addFeature(item)
      }
    })
    const idIndexMap = toMap(
      searchItems,
      (item) => item.id,
      (item, index) => index
    )

    let setting = storage.sync.get<SettingModel>(StoreKey.SETTING)
    if (setting === null) {
      setting = new SettingModel()
      storage.sync.set(StoreKey.SETTING, setting)
    }

    return {
      setting,
      searchItems,
      idIndexMap
    }
  },
  actions: {
    getIndex(itemId: number) {
      return this.idIndexMap.get(itemId) ?? -1
    },
    // 添加 id 到 index 的映射
    setIndex(itemId: number, index: number) {
      this.idIndexMap.set(itemId, index)
    },
    // 移除 id 到 index 的映射
    removeIndex(itemId: number) {
      this.idIndexMap.delete(itemId)
    },
    moveSearchItems(fromItemId: number, toItemId: number) {
      const fromIndex = this.getIndex(fromItemId)
      const toIndex = this.getIndex(toItemId)

      moveItems(this.searchItems, fromIndex, toIndex, (oldIndex, newIndex) => {
        const {id} = this.searchItems[newIndex]
        this.setIndex(id, newIndex)
      })
      search.saveItemIds(this.searchItems.map((item) => item.id))
    },
    getSearchItem(itemId: number | string) {
      if (typeof itemId === 'string') {
        itemId = parseInt(itemId)
      }
      const index = this.getIndex(itemId)
      return this.searchItems[index]
    },
    addSearchItem(item: SearchItemModel): Promise<void> {
      return promisify(() => {
        checkSearchItem(item)

        this.searchItems.push(item)
        this.setIndex(item.id, this.searchItems.length - 1)
        const raw = toRaw(item)
        search.addItem(raw)
        feature.addFeature(raw)
      })()
    },
    updateSearchItem(itemId: number, item: SearchItemModel): Promise<void> {
      return promisify(() => {
        const index = this.getIndex(itemId)

        const a = 'fdsfdsafdsafdsdfdfs'
        checkSearchItem(item)

        this.searchItems[index] = item
        const raw = toRaw(item)
        search.updateItem(raw)
        feature.updateFeature(raw)
      })()
    },
    removeSearchItem(itemId: number) {
      const index = this.getIndex(itemId)

      const item = this.searchItems[index]
      this.searchItems.splice(index, 1)
      this.removeIndex(item.id)
      search.removeItem(item.id)
      feature.removeFeature(item.id)
    },
    updateEnabledStatus(itemId: number, enabled: boolean) {
      const index = this.getIndex(itemId)

      this.searchItems[index].enabled = enabled
      const raw = toRaw(this.searchItems[index])
      search.updateItem(raw)
      if (enabled) feature.addFeature(raw)
      else feature.removeFeature(raw.id)
    },
    hasAnySearchItem(categoryId: string): boolean {
      return !!this.searchItems.find((item) => item.categoryId === categoryId)
    }
  }
})

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: category.getData()
  }),
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
    addCategory(name: string): Promise<void> {
      return promisify(() => {
        const last = this.categories[this.categories.length - 1]
        // 生成分类ID
        const categoryId = (parseInt(last.id) + 1).toString()
        const model = new CategoryModel(categoryId, name)
        this.categories.push(model)
        category.save(toRaw(this.categories))
      })()
    },
    updateCategory(index: number, name: string): Promise<void> {
      return promisify(() => {
        if (index < 0 || index >= this.categories.length) return

        this.categories[index].text = name
        category.save(toRaw(this.categories))
      })()
    },
    removeCategory(index: number) {
      if (index < 0 || index >= this.categories.length) return

      this.categories.splice(index, 1)
      category.save(toRaw(this.categories))
    }
  }
})
