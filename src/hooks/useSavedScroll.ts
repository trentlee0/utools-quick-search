import { onActivated, reactive } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export function useSavedScroll(el: HTMLElement | null) {
  const pos = reactive({ left: 0, top: 0 })

  onActivated(() => {
    el?.scrollTo(pos)
  })

  onBeforeRouteLeave(() => {
    pos.left = el?.scrollLeft ?? 0
    pos.top = el?.scrollTop ?? 0
  })
}
