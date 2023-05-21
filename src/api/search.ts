import SearchItemModel from '@/models/SearchItemModel'
import { sync } from 'utools-utils/storage'
import { StoreKey } from '@/constant'
import { toMap } from '@/utils/collections'

function buildKey(itemId: number | string): string
function buildKey(): string

function buildKey(itemId?: number | string): string {
  let key = `${StoreKey.SEARCH_ITEMS}/`
  if (itemId !== undefined) key += `${itemId}`
  return key
}

function getItemIds() {
  return sync.getOrDefault<number[]>(StoreKey.SEARCH_ITEMS, [])
}

/**
 * 保存搜索项顺序
 */
export function saveItemIds(itemIds: number[]) {
  sync.set(StoreKey.SEARCH_ITEMS, itemIds)
}

export function getList() {
  const arr = sync.like<SearchItemModel>(buildKey())
  const map = toMap(arr, (item) => item.id)
  return getItemIds().map((id) => map.get(id)!)
}

export function getItem(itemId: number | string) {
  const arr = sync.like<SearchItemModel>(buildKey(itemId))
  return arr.length >= 1 ? arr[0] : null
}

export function addItem(item: SearchItemModel) {
  const itemIds = getItemIds()
  itemIds.push(item.id)
  saveItemIds(itemIds)
  sync.set(buildKey(item.id), item)
}

export function unshiftItem(item: SearchItemModel) {
  const itemIds = getItemIds()
  itemIds.unshift(item.id)
  saveItemIds(itemIds)
  sync.set(buildKey(item.id), item)
}

export function removeItem(itemId: number) {
  const storedItem = getItem(itemId)
  if (storedItem) {
    const itemIds = getItemIds()
    saveItemIds(itemIds.filter((id) => id !== itemId))
    sync.remove(buildKey(itemId))
    return true
  }
  return false
}

export function updateItem(item: SearchItemModel) {
  sync.set(buildKey(item.id), item)
}
