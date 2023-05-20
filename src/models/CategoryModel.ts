export default class CategoryModel {
  public static readonly ALL = new CategoryModel('', '所有')
  public static readonly DEFAULT = new CategoryModel('0', '默认')

  id: string
  text: string

  constructor(id: string, text: string) {
    this.id = id
    this.text = text
  }
}
