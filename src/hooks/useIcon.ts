import {
  mdiMagnify,
  mdiPlus,
  mdiClose,
  mdiApps,
  mdiImagePlusOutline,
  mdiShapeOutline,
  mdiCloseThick
} from '@mdi/js'

const icons: {[prop: string]: string} = {
  mdiMagnify,
  mdiPlus,
  mdiClose,
  mdiApps,
  mdiImagePlusOutline,
  mdiShapeOutline,
  mdiCloseThick
}

export function useIcon(type: string): string {
  return icons[type]
}
