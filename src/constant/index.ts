export enum StoreKey {
  SEARCH_ITEMS = 'search-items',
  CATEGORY = 'category',
  SETTING = 'setting'
}

export enum FeatureCode {
  OPENER = 'opener',
  OPEN_URL = 'open-url',
  ADD_ITEM = 'add-item'
}

export namespace FileConstant {
  export const KB = 1 << 10
  export const MB = KB << 10
  export const FEATURE_IMAGE_TYPES = ['image/png', 'image/jpeg']
  // 限制图标文件的大小，单位 MB
  export const ICON_FILE_SIZE_LIMIT = 0.512 * MB
}
