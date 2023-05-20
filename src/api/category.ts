import CategoryModel from '@/models/CategoryModel'
import { storage } from 'utools-utils'
import { StoreKey } from '@/constant'

export function getList() {
  return storage.sync.getOrDefault(StoreKey.CATEGORY, [CategoryModel.DEFAULT])
}

export function save(categories: CategoryModel[]) {
  storage.sync.set(StoreKey.CATEGORY, categories)
}
