import { onActivated, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export function useKeyDown(handler: (e: KeyboardEvent) => void) {
  onActivated(() => {
    window.addEventListener('keydown', handler)
  })
  
  onBeforeRouteLeave(() => {
    window.removeEventListener('keydown', handler)
  })
}
