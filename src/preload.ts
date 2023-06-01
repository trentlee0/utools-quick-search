import { copyText, isMacOS, isWindows, showNotification } from 'utools-api'
import { existsSync } from 'fs'
import { hideAndOutPlugin } from 'utools-utils/command'
import { execCommand, execPowerShell } from 'utools-utils/command'

function option(name: string, value?: string) {
  return value ? `${name} "${value}"` : ''
}

function getCommand(query: string, app?: string) {
  if (isWindows()) return `Start-Process ${option('-FilePath', app)} "${query}"`
  if (isMacOS()) return `open ${option('-a', app)} "${query}"`
  return `${app || 'xdg-open'} "${query}"`
}

export async function openQuery(query: string, app?: string) {
  try {
    hideAndOutPlugin()
    if (utools.isWindows()) {
      await execPowerShell(getCommand(query, app))
    } else {
      await execCommand(getCommand(query, app))
    }
  } catch (err) {
    copyText(err + '')
    showNotification(`已复制错误: ${err}`)
  }
}

export function existsFile(path: string) {
  return path ? existsSync(path) : false
}
