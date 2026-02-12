import { onActivated, onDeactivated } from 'vue'

export function useKeyDown(handler: (e: KeyboardEvent) => void) {
  onActivated(() => {
    window.addEventListener('keydown', handler)
  })

  onDeactivated(() => {
    window.removeEventListener('keydown', handler)
  })
}
