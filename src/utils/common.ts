export function deepCopy<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}

export function promisify<T>(func: (...args: any) => T) {
  return (...args: any) => new Promise<T>((resolve) => resolve(func(...args)))
}

export function nonePage() {
  // utools.hideMainWindow()
  utools.setExpendHeight(0)
  // utools.showMainWindow()
}

const replaced = encodeURIComponent('{query}')

export function buildURL(url: string, query?: string) {
  if (query === undefined) {
    return encodeURI(url)
  } else {
    return encodeURI(url).replace(replaced, encodeURIComponent(query))
  }
}
