import SearchItemModel from '@/models/SearchItemModel'
import {isUTools} from '@/utils/common'

type FeatureCommand =
  | string
  | {
      type: 'img' | 'files' | 'regex' | 'over' | 'window'
      label: string
      match?: string
      minLength?: number
      maxLength?: number
    }

export function getFeatures() {
  if (!isUTools()) return
  return utools.getFeatures()
}

export function addFeature(item: SearchItemModel) {
  if (!isUTools()) return
  const {id, title, icon, subtitle, keyword, platform} = item
  const cmds: FeatureCommand[] = [title]
  // 存在 keyword 才动态注册正则匹配
  if (keyword) {
    cmds.push({
      type: 'regex',
      label: title,
      match: `/^(${keyword} )(.*)$/`,
      minLength: keyword.length,
      maxLength: 150
    })
  }
  utools.setFeature({
    code: id.toString(),
    icon: icon || 'logo.png',
    platform: platform!,
    explain: subtitle,
    cmds
  })
}

export function updateFeature(item: SearchItemModel) {
  if (!isUTools()) return
  removeFeature(item.id)
  addFeature(item)
}

export function removeFeature(searchItemId: number | string) {
  if (!isUTools()) return
  if (typeof searchItemId === 'number') {
    searchItemId = searchItemId.toString()
  }
  utools.removeFeature(searchItemId)
}
