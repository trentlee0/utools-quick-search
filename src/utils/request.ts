export async function request(
  url: string,
  options?: RequestInit & { timeout?: number }
) {
  const timeout = options?.timeout ?? 10000
  const userSignal = options?.signal
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  if (userSignal) {
    const onUserAbort = () => controller.abort()
    userSignal.addEventListener('abort', onUserAbort, { once: true })

    controller.signal.addEventListener('abort', () => {
      userSignal.removeEventListener('abort', onUserAbort)
    })
  }
  try {
    const signal = options?.signal
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
    return response
  } catch (err) {
    clearTimeout(timeoutId)
    if ((err as Error).name === 'AbortError') {
      if (controller.signal.aborted && !userSignal?.aborted) {
        throw new Error(`Request timeout (${timeout}ms): ${url}`)
      } else {
        throw new Error('Request canceled')
      }
    }
    throw err
  }
}
