import SearchItemModel from '@/models/SearchItemModel'

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
  return utools.getFeatures()
}

export function addFeature(item: SearchItemModel) {
  const { id, title, icon, subtitle, keyword, platform } = item
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
  if (item.isOver) {
    cmds.push({
      type: 'over',
      label: title,
      minLength: 1,
      maxLength: 500
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
  removeFeature(item.id)
  addFeature(item)
}

export function removeFeature(searchItemId: number | string) {
  if (typeof searchItemId === 'number') {
    searchItemId = searchItemId.toString()
  }
  utools.removeFeature(searchItemId)
}

export function removeFeatures() {
  const features = utools.getFeatures()
  for (const feature of features) {
    utools.removeFeature(feature.code)
  }
}