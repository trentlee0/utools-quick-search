import { existsSync } from 'fs'
import {
  copyText,
  isMacOS,
  isWindows,
  shellOpenExternal,
  showNotification,
  readCurrentBrowserUrl,
  sharp
} from 'utools-api'
import { hideAndOutPlugin, WindowPayload } from 'utools-utils'
import {
  execCommand,
  execPowerShell,
  execAppleScript
} from 'utools-utils/preload'
import decodeIco from 'decode-ico'
import { fileTypeFromBuffer } from 'file-type'
import { FileConstant } from './constant'
import { request } from './utils/request'

function option(name: string, value?: string) {
  return value ? `${name} "${value}"` : ''
}

async function execOpenCommand(url: string, app?: string) {
  if (isWindows()) {
    await execPowerShell(`Start-Process ${option('-FilePath', app)} "${url}"`)
  } else if (isMacOS()) {
    await execCommand(`open ${option('-a', app)} "${url}"`)
  } else {
    if (app) {
      await execCommand(`${app} "${url}"`)
    } else {
      shellOpenExternal(url)
    }
  }
}

export async function openURL(url: string, app?: string) {
  try {
    hideAndOutPlugin()
    await execOpenCommand(encodeURI(url), app)
  } catch (err: unknown) {
    copyText(err + '')
    showNotification(`已复制错误: ${err}`)
  }
}

export async function openCommand(url: string, app?: string) {
  await execOpenCommand(encodeURI(url), app)
}

export function existsFile(path: string) {
  return path ? existsSync(path) : false
}

export async function getHtmlTitle(url: string): Promise<string | null> {
  const res = await request(url)
  const html = await res.text()
  const title = /<title>(.*?)<\/title>/.exec(html)?.[1]
  return title ?? null
}

function sharpsFromIco(
  input: ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray,
  options?: SharpOptions,
  resolveWithObject?: Boolean
) {
  const buffer = input
  return decodeIco(buffer).map((icon) => {
    const image =
      icon.type === 'png'
        ? sharp(icon.data, options || {})
        : sharp(icon.data, {
            ...options,
            raw: {
              width: icon.width,
              height: icon.height,
              channels: 4
            }
          })
    return resolveWithObject ? Object.assign(icon, { image }) : image
  }) as Sharp[]
}

async function convertIcoToPng(
  icoBuffer: ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray
): Promise<Buffer> {
  const sharpInstances = sharpsFromIco(icoBuffer)
  let selectedIndex = 0
  let maxWidth = 0
  for (let i = 0; i < sharpInstances.length; i++) {
    const metadata = await sharpInstances[i].metadata()
    if (metadata.size && metadata.size <= FileConstant.ICON_FILE_SIZE_LIMIT) {
      if (metadata.width && metadata.width > maxWidth) {
        maxWidth = metadata.width
        selectedIndex = i
      }
    }
  }
  const selectedSharp = sharpInstances[selectedIndex]
  return await selectedSharp.png().toBuffer()
}

function bufferToPngBase64(buffer: Buffer) {
  return `data:image/png;base64,${buffer.toString('base64')}`
}

export async function convertImageToPngBase64(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<string> {
  if (['image/vnd.microsoft.icon', 'image/x-icon'].includes(mimeType)) {
    return bufferToPngBase64(await convertIcoToPng(buffer))
  }
  return bufferToPngBase64(await sharp(Buffer.from(buffer)).png().toBuffer())
}

export async function getFavicon(url: string): Promise<string | null> {
  const urlObject = new URL(url)
  const requestUrl = `https://cn.cravatar.com/favicon/api/index.php?url=${urlObject.hostname}`

  const response = await request(requestUrl, {
    redirect: 'follow',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  })

  const arrayBuffer = await response.arrayBuffer()
  const fileType = await fileTypeFromBuffer(arrayBuffer)
  if (!fileType) {
    throw new Error(`获取 Favicon 失败：无法识别文件类型`)
  }

  if (fileType.ext === 'ico') {
    const pngBuffer = await convertIcoToPng(arrayBuffer)
    return bufferToPngBase64(pngBuffer)
  } else if (fileType.mime === 'image/png' || fileType.mime === 'image/jpeg') {
    return bufferToPngBase64(
      await sharp(Buffer.from(arrayBuffer)).png().toBuffer()
    )
  } else {
    throw new Error(`获取 Favicon 失败：不支持的文件类型 ${fileType.mime}`)
  }
}

async function getWindowTitleWithAppleScript(
  process: string,
  window: number = 1
): Promise<string> {
  const script = `
    tell application "System Events"
      tell process "${process}"
        return title of window ${window}
      end tell
    end tell`
  const { stdout } = await execAppleScript(script)
  return stdout.trim()
}

async function getCurrentWindowTitleWithPowerShell(): Promise<string> {
  const script = `
chcp 65001
Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    public static extern IntPtr GetTopWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetWindow(IntPtr hWnd, uint uCmd);
    public const uint GW_HWNDNEXT = 2;

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetDesktopWindow();
}
"@

$foreground = [Win32]::GetForegroundWindow()

$desktop = [Win32]::GetDesktopWindow()
$current = [Win32]::GetTopWindow($desktop)

$zOrderList = @()
while ($current -ne [IntPtr]::Zero) {
    if ([Win32]::IsWindowVisible($current) -and [Win32]::GetWindowTextLength($current) -gt 0) {
        $zOrderList += $current
    }
    $current = [Win32]::GetWindow($current, [Win32]::GW_HWNDNEXT)
}

$index = -1
for ($i = 0; $i -lt $zOrderList.Count; $i++) {
    if ($zOrderList[$i] -eq $foreground) {
        $index = $i
        break
    }
}

if ($index -ge 0 -and ($index + 1) -lt $zOrderList.Count) {
    $nextHwnd = $zOrderList[$index + 1]
    $len = [Win32]::GetWindowTextLength($nextHwnd)
    if ($len -gt 0) {
        $sb = New-Object Text.StringBuilder ($len + 1)
        [Win32]::GetWindowText($nextHwnd, $sb, $sb.Capacity) | Out-Null
        $sb.ToString()
    }
} else {
    ""
}`
  const { stdout } = await execPowerShell(script)
  return stdout.split('\r\n')[1]
}

async function readCurrentZenBrowserTab(window: number = 1) {
  const script = `
    tell application "System Events"
      tell process "Zen"
        tell window ${window}
          set currentTitle to title
          set currentUrl to ""
          try
            set currentUrl to value of text field 1 of combo box 1 of group 1 of toolbar 1 of group 1 of group 1 of group 1
          on error
            set currentUrl to value of text field 1 of combo box 1 of group 1 of toolbar 1 of group 1
          end try
          return currentUrl & "\n" & currentTitle
        end tell
      end tell
    end tell`
  const { stdout } = await execAppleScript(script)
  const [url, title] = stdout.split('\n')
  return {
    url: url.indexOf('://') === -1 && url ? `https://${url}` : url,
    title
  }
}

export async function getCurrentBrowserTab(windowPayload: WindowPayload) {
  const app = windowPayload.app
  if (app === 'Zen.app') {
    return await readCurrentZenBrowserTab()
  }

  const url = await readCurrentBrowserUrl()
  let title = ''
  try {
    if (isMacOS()) {
      const appSuffix = '.app'
      const process = app.substring(0, app.length - appSuffix.length)
      title = await getWindowTitleWithAppleScript(process)
    } else if (isWindows()) {
      title = await getCurrentWindowTitleWithPowerShell()
    }
  } catch (err) {
    alert(err)
  }
  return { url, title }
}
