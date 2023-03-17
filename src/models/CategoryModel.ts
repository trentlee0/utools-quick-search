export default class CategoryModel {
  id: string
  text: string

  constructor(id: string, text: string) {
    this.id = id
    this.text = text
  }

  public static readonly DEFAULT = new CategoryModel('0', '默认')
  public static readonly AGGREGATION = new CategoryModel('', '所有')
}
