import { createApp } from 'vue'
import Application from './App.vue'
import './style.css'
import router from '@/router'
import pinia, { useMainStore } from '@/store'
import { FeatureCode } from '@/constant'
import { nonePage, simpleTemplate, regexpTemplate } from '@/utils/common'
import { openURL } from './preload'
import { Action } from 'utools-utils/type'
import CategoryModel from '@/models/CategoryModel'
import ItemModel from '@/models/ItemModel'

let application = createApp(Application).use(pinia).use(router)
application.mount('#app')

const mainStore = useMainStore()

const state = {
  code: '',
  app: <string | undefined>'',
  url: '',
  word: <string | undefined>''
}

utools.onPluginOut(() => {
  application.unmount()
})

utools.onPluginEnter((a) => {
  application.unmount()
  application = createApp(Application).use(pinia).use(router)
  application.mount('#app')
  const action = a as Action

  state.code = action.code
  if (action.code === FeatureCode.QUICK_OPENER) {
    router.replace('/')
  } else if (action.code === FeatureCode.ADD_ITEM) {
    let to = `/info/categories/${CategoryModel.DEFAULT.id}/items/`
    if (action.type === 'window') {
      mainStore.action = action
      to += 'add-item-from-browser'
    }
    router.push(to)
  } else if (action.code === FeatureCode.OPEN_URL) {
    const url = action.payload as string
    openURL(url)
  } else {
    const item = mainStore.getSearchItem(action.code)
    const { url, app, keyword } = item

    console.log(action)
    if (action.type === 'regex') {
      if (ItemModel.isCustomMatch(item)) {
        openURL(regexpTemplate(url, item.customMatch!, action.payload), app)
      } else {
        const query = action.payload.replace(`${keyword} `, '')
        openURL(simpleTemplate(url, { query }), app)
      }
    } else if (action.type === 'over') {
      openURL(simpleTemplate(url, { query: action.payload }), app)
    } else if (ItemModel.getSearchPatternType(url) === false) {
      openURL(url, app)
    } else {
      nonePage()
      state.app = app
      state.url = url
      state.word = ''
      utools.setSubInput((s: any) => (state.word = s.text), '输入关键词')
    }
  }
})

window.addEventListener('keydown', (e) => {
  if (state.code === FeatureCode.QUICK_OPENER) return

  if (e.key === 'Enter') {
    openURL(simpleTemplate(state.url, { query: state.word }), state.app)
  }
})
