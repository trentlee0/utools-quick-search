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

export function simpleTemplate(
  template: string,
  variables: Record<string, string | undefined>
) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key) => {
    return variables[key] ?? placeholder
  })
}

export function createRegExp(regexp: string) {
  if (!regexp.startsWith('/')) return null

  let lastSlashIndex = -1
  let escaped = false

  for (let i = 1; i < regexp.length; i++) {
    if (escaped) {
      escaped = false
      continue
    }
    if (regexp[i] === '\\') {
      escaped = true
    } else if (regexp[i] === '/') {
      lastSlashIndex = i
    }
  }

  if (lastSlashIndex === -1) return null

  const pattern = regexp.slice(1, lastSlashIndex)
  const flags = regexp.slice(lastSlashIndex + 1)

  const validFlags = /^[gimsuyvd]*$/
  if (!validFlags.test(flags)) return null
  return new RegExp(pattern, flags)
}

export function regexpTemplate(
  template: string,
  pattern: RegExp | string | null,
  input: string
) {
  if (typeof pattern === 'string') {
    pattern = createRegExp(pattern)
  }
  if (pattern === null) return template

  const match = pattern.exec(input)
  if (match) {
    return template.replace(/\$\{(\w+)\}/g, (placeholder, key) => {
      if (/^\d+$/.test(key)) {
        const index = parseInt(key)
        return match[index] ?? ''
      }
      return match.groups?.[key] ?? ''
    })
  }
  return template
}

export function parsePageTitle(pageTitle: string) {
  if (pageTitle.includes(' - ')) {
    const [title, subtitle] = pageTitle.split(' - ')
    return {
      title: title.trim(),
      subtitle: subtitle.trim()
    }
  }
  if (pageTitle.includes(' | ')) {
    const [subtitle, title] = pageTitle.split(' | ')
    return {
      title: title.trim(),
      subtitle: subtitle.trim()
    }
  }
  return {
    title: pageTitle,
    subtitle: ''
  }
}
