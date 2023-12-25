import {
  copyText,
  isMacOS,
  isWindows,
  shellOpenExternal,
  showNotification
} from 'utools-api'
import { existsSync } from 'fs'
import https from 'https'
import { hideAndOutPlugin } from 'utools-utils/command'
import { execCommand, execPowerShell } from 'utools-utils/command'

function option(name: string, value?: string) {
  return value ? `${name} "${value}"` : ''
}

async function execOpenCommand(query: string, app?: string) {
  if (isWindows()) {
    await execPowerShell(`Start-Process ${option('-FilePath', app)} "${query}"`)
  } else if (isMacOS()) {
    await execCommand(`open ${option('-a', app)} "${query}"`)
  } else {
    if (app) {
      await execCommand(`${app} "${query}"`)
    } else {
      shellOpenExternal(query)
    }
  }
}

export async function openQuery(query: string, app?: string) {
  try {
    hideAndOutPlugin()
    await execOpenCommand(query, app)
  } catch (err: unknown) {
    copyText(err + '')
    showNotification(`已复制错误: ${err}`)
  }
}

export function existsFile(path: string) {
  return path ? existsSync(path) : false
}

export function getHtmlTitle(url: string) {
  return new Promise<string | null>((resolve, reject) => {
    https.get(url, (res) => {
      const body: Uint8Array[] = []
      res.on('data', (chunk) => body.push(chunk))
      res.on('end', () => {
        resolve(/<title>(.*?)<\/title>/.exec(body.toString())?.[1] ?? null)
      })
    })
  })
}

export function getFavicon(url: string) {
  const urlObject = new URL(url)
  const requestUrl = `https://api.iowen.cn/favicon/${urlObject.hostname}.png`
  return new Promise<string | null>((resolve, reject) => {
    https
      .get(requestUrl, (res) => {
        const data: Uint8Array[] = []
        res.on('data', (chunk) => {
          data.push(chunk)
        })
        res.on('end', () => {
          const base64 = Buffer.concat(data).toString('base64')
          resolve(base64 ? 'data:image/png;base64,' + base64 : null)
        })
        res.on('error', reject)
      })
      .on('error', reject)
  })
}
