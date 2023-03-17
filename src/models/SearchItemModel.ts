import CategoryModel from './CategoryModel'

export default class SearchItemModel {
  id: number
  icon?: string
  title: string = ''
  subtitle: string = ''
  url: string = ''
  keyword?: string
  enabled?: boolean
  app?: string
  platform?:
    | ('darwin' | 'win32' | 'linux')
    | Array<'darwin' | 'win32' | 'linux'>
  // 设置默认分类
  categoryId: string = CategoryModel.DEFAULT.id

  constructor() {
    // 使用时间戳作为 ID
    this.id = Date.now()
  }
}
