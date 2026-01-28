import ItemModel from './ItemModel'
import * as search from '@/api/search'

export default class SettingModel {
  version: number

  constructor() {
    this.version = 0
  }

  public static migrateDatabase(setting: SettingModel) {
    let needed = false
    if (setting.version < 1) {
      // 保存默认项目
      ItemModel.DEFAULT_SEARCH_ITEMS.reverse().forEach((item) => {
        ItemModel.checkSearchItem(item)
        search.unshiftItem(item)
      })
      setting.version = 1
      needed = true
    }
    return needed
  }
}
