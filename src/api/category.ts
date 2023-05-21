import CategoryModel from '@/models/CategoryModel'
import { sync } from 'utools-utils/storage'
import { StoreKey } from '@/constant'

export function getList() {
  return sync.getOrDefault(StoreKey.CATEGORY, [CategoryModel.DEFAULT])
}

export function save(categories: CategoryModel[]) {
  sync.set(StoreKey.CATEGORY, categories)
}
