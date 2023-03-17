import {reactive, onActivated} from 'vue'
import {onBeforeRouteLeave} from 'vue-router'

export function useSavedScroll(el: string) {
  const pos = reactive({left: 0, top: 0})
  onActivated(() => {
    document.querySelector(el)?.scrollTo(pos)
  })
  onBeforeRouteLeave(() => {
    const element = document.querySelector(el)
    pos.left = element?.scrollLeft ?? 0
    pos.top = element?.scrollTop ?? 0
  })
  return pos
}
