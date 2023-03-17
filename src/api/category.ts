import CategoryModel from '@/models/CategoryModel'
import storage from '@/utils/storage'
import {StoreKey} from '@/constant'

export function getData(): Array<CategoryModel> {
  return storage.sync.getOrDefault(StoreKey.CATEGORY, [CategoryModel.DEFAULT])
}

export function save(categories: CategoryModel[]) {
  storage.sync.set(StoreKey.CATEGORY, categories)
}
