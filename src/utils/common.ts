export function isUTools(): boolean {
  if (import.meta.env.PROD) return true
  return Reflect.has(window, 'utools')
}

export function deepCopy<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}

type KeyFn<T, K> = (item: T, index: number) => K
type ValFn<T, V> = (item: T, index: number) => V
export function toMap<K, V>(arr: V[], keyFn: KeyFn<V, K>): Map<K, V>
export function toMap<T, K, V>(
  arr: T[],
  keyFn: KeyFn<T, K>,
  valFn: ValFn<T, V>
): Map<K, V>

export function toMap<T, K, V>(
  arr: T[],
  keyFn: KeyFn<T, K>,
  valFn?: ValFn<T, V>
): Map<K, V> | Map<K, T> {
  if (valFn) {
    const map = new Map<K, V>()
    arr.forEach((item, index) =>
      map.set(keyFn(item, index), valFn(item, index))
    )
    return map
  }
  const map = new Map<K, T>()
  arr.forEach((item, index) => map.set(keyFn(item, index), item))
  return map
}

export function promisify<T>(func: (...args: any) => T) {
  return (...args: any) => new Promise<T>((resolve) => resolve(func(...args)))
}

type OnMoved = (oldIndex: number, newIndex: number) => void
export function moveItems(arr: unknown[], from: number, to: number): void
export function moveItems(
  arr: unknown[],
  from: number,
  to: number,
  onMoved: OnMoved
): void

export function moveItems(
  arr: unknown[],
  fromIndex: number,
  toIndex: number,
  onItemMoved?: OnMoved
) {
  if (fromIndex === toIndex) return

  const fn = (oldIndex: number, newIndex: number) => {
    if (!onItemMoved) return
    onItemMoved(oldIndex, newIndex)
  }
  const from = arr[fromIndex]
  if (fromIndex < toIndex) {
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const newIndex = i - 1
      arr[newIndex] = arr[i]
      fn(i, newIndex)
    }
  } else {
    for (let i = fromIndex - 1; i >= toIndex; i--) {
      const newIndex = i + 1
      arr[newIndex] = arr[i]
      fn(i, newIndex)
    }
  }
  arr[toIndex] = from
  fn(fromIndex, toIndex)
}
