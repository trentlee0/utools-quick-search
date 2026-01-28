export enum StoreKey {
  SEARCH_ITEMS = 'search-items',
  CATEGORY = 'category',
  SETTING = 'setting'
}

export enum FeatureCode {
  QUICK_OPENER = 'quick-opener',
  OPEN_URL = 'open-url',
  ADD_ITEM = 'add-item'
}

export namespace FileConstant {
  export const KB = 1 << 10
  export const MB = KB << 10
  export const FEATURE_IMAGE_TYPES = ['image/png', 'image/jpeg']
}
