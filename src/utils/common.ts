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

export function buildURL(url: string, query?: string) {
  return encodeURI(query === undefined ? url : url.replace('{query}', query))
}
