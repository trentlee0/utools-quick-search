import ItemModel from '@/models/ItemModel'

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

export function addFeature(item: ItemModel) {
  const { title, keyword, customMatch } = item
  const cmds: FeatureCommand[] = []
  // 如果是 Custom Match 就不用其他方式匹配
  if (ItemModel.isCustomMatch(item)) {
    cmds.push({
      type: 'regex',
      label: title,
      match: customMatch,
      minLength: 1
    })
  } else {
    cmds.push(title)

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
  }
  utools.setFeature({
    code: item.id.toString(),
    icon: item.icon || 'logo.png',
    platform: item.platform!,
    explain: item.subtitle || ItemModel.DEFAULT_SUBTITLE,
    cmds
  })
}

export function updateFeature(item: ItemModel) {
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
