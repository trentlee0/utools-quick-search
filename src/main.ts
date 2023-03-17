import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import './style.css'
import router from './router'
import {useMainStore} from './store'
import {isUTools} from '@/utils/common'
import {FeatureCode} from '@/constant'

createApp(App).use(createPinia()).use(router).mount('#app')

if (isUTools()) {
  function beforeExecute() {
    utools.hideMainWindow()
    utools.outPlugin()
  }

  function nonePage() {
    utools.hideMainWindow()
    utools.setExpendHeight(0)
    utools.showMainWindow()
  }

  function buildURL(url: string, query?: string) {
    return encodeURI(query === undefined ? url : url.replace('{query}', query))
  }

  const mainStore = useMainStore()

  type TmpState = {
    code: string
    app?: string
    url: string
    word?: string
  }

  const state: TmpState = {
    code: '',
    app: '',
    url: '',
    word: ''
  }

  utools.onPluginEnter(({code, type, payload}) => {
    state.code = code
    if (code === FeatureCode.QUICK_SEARCH) return

    const {url, app, keyword} = mainStore.getSearchItem(code)

    if (type === 'regex') {
      beforeExecute()
      open(buildURL(url, (payload as string).replace(`${keyword} `, '')), app)
    } else if (!url.includes('{query}')) {
      beforeExecute()
      open(buildURL(url), app)
    } else {
      nonePage()
      state.app = app
      state.url = url
      state.word = ''
      utools.setSubInput((s: any) => (state.word = s.text), '输入关键词')
    }
  })

  window.addEventListener('keydown', (e) => {
    if (state.code === FeatureCode.QUICK_SEARCH) return
    if (e.key === 'Enter') {
      beforeExecute()
      open(buildURL(state.url, state.word), state.app)
    }
  })
} else {
  // @ts-ignore
  window.open = (query: string, app?: string) => {
    console.warn(`preload.js ==> open('${query}', '${app}')`)
  }
  // @ts-ignore
  window.existsFile = (path: string) => {
    console.warn(`preload.js ==> existsFile('${path}')`)
    return true
  }
}
