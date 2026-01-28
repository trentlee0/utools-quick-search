import CategoryModel from '@/models/CategoryModel'
import { sync } from 'utools-utils'
import { StoreKey } from '@/constant'

export function getList() {
  return sync.get(StoreKey.CATEGORY, [CategoryModel.DEFAULT])
}

export function save(categories: CategoryModel[]) {
  sync.set(StoreKey.CATEGORY, categories)
}
