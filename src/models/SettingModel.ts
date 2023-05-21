import SearchItemModel from './SearchItemModel'
import * as search from '@/api/search'

export default class SettingModel {
  version: number

  constructor() {
    this.version = 0
  }

  public static migrateDatabase(setting: SettingModel) {
    let needed = false
    if (setting.version < 1) {
      // 保存默认搜索项
      SearchItemModel.DEFAULT_SEARCH_ITEMS.reverse().forEach((item) => {
        SearchItemModel.checkSearchItem(item)
        search.unshiftItem(item)
      })
      setting.version = 1
      needed = true
    }
    return needed
  }
}
