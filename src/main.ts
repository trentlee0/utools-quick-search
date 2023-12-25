import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
import pinia, { useMainStore } from './store'
import { FeatureCode } from '@/constant'
import { buildURL, nonePage } from '@/utils/common'
import { openQuery } from './preload'
import { Action } from 'utools-utils/type'

createApp(App).use(pinia).use(router).mount('#app')

const mainStore = useMainStore()

const state = {
  code: '',
  app: <string | undefined>'',
  url: '',
  word: <string | undefined>''
}

utools.onPluginEnter((action) => {
  const { code, type, payload } = action as Action

  state.code = code
  if (code === FeatureCode.QUICK_SEARCH) return

  const { url, app, keyword } = mainStore.getSearchItem(code)

  if (type === 'regex') {
    openQuery(buildURL(url, payload.replace(`${keyword} `, '')), app)
  } else if (type === 'over') {
    openQuery(buildURL(url, payload), app)
  } else if (url.lastIndexOf('{query}') === -1) {
    openQuery(buildURL(url), app)
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
    openQuery(buildURL(state.url, state.word), state.app)
  }
})
