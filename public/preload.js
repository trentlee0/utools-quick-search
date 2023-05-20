const { existsSync } = require('fs')
const { exec } = require('child_process')

function handleError(err) {
  if (!err) return
  utools.copyText(err.toString())
  utools.showNotification(`已复制错误: ${err}`)
}

function execCommand(command) {
  if (utools.isWindows()) {
    exec(command, { shell: 'powershell.exe' }, handleError)
  } else {
    exec(command, handleError)
  }
}

function buildOpenOnWindows(query, app) {
  return `Start-Process ${app ? `-FilePath "${app}"` : ''} "${query}"`
}

function buildOpenOnMacOS(query, app) {
  return `open ${app ? `-a "${app}"` : ''} "${query}"`
}

function buildOpenOnLinux(query, app) {
  return `${app ? app : 'xdg-open'} "${query}"`
}

function getCommand(query, app) {
  if (utools.isWindows()) return buildOpenOnWindows(query, app)
  if (utools.isMacOS()) return buildOpenOnMacOS(query, app)
  return buildOpenOnLinux(query, app)
}

window.openQuery = (query, app) => {
  execCommand(getCommand(query, app))
}

window.existsFile = (path) => {
  if (!path) return false
  return existsSync(path)
}
