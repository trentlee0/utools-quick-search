<template>
  <div class="w-full px-2">
    <Header :title="op === 'add' ? '添加项目' : '修改项目'"></Header>

    <BasicForm class="mt-10">
      <BasicFormItem label="图标">
        <div class="relative flex justify-center">
          <SelectImageInput
            :src="data.icon"
            :disabled="isBuiltinItem"
            @select-file="handleSelectIcon"
            @detach-file="handleDetachIcon"
          ></SelectImageInput>

          <div class="absolute right-0 top-0 flex h-full items-center">
            <template v-if="!isBuiltinItem">
              <div
                class="cursor-pointer select-none"
                v-show="isWebURL"
                title="获取 URL 的图标"
                @click="handleDownloadFavicon"
              >
                <Icon
                  ref="getFaviconIconRef"
                  :icon="getFaviconIconLoading ? mdiSync : mdiWebSync"
                  :real-size="20"
                  :loading="getFaviconIconLoading"
                ></Icon>
              </div>
              <div
                class="ml-1 cursor-pointer select-none"
                v-show="isAppExist"
                title="获取应用的图标"
                @click="handleGetAppIcon"
              >
                <Icon :icon="mdiApplicationOutline" :real-size="20"></Icon>
              </div>
            </template>
          </div>
        </div>
      </BasicFormItem>

      <BasicFormItem label="名称" required :verify="rules.title.verify">
        <TextField
          ref="titleFieldRef"
          placeholder="指令名称"
          v-model="data.title"
          @blur="checkProp(rules, 'title', data.title)"
          :append-icon="isBuiltinItem ? mdiPackage : undefined"
          append-icon-title="内置项目"
          :disabled="isBuiltinItem"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem label="子标题">
        <TextField
          v-model="data.subtitle"
          :placeholder="`指令描述，默认为“${ItemModel.DEFAULT_SUBTITLE}”`"
          :disabled="isBuiltinItem"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem
        label="URL"
        required
        :verify="rules.url.verify"
        title="要使项目根据关键词进行搜索：
- 默认情况，请用 `{query}` 替换关键词；
- 而对于自定义匹配，需要用 `${n}` 替换关键词中的匹配项，其表示正则表达式中第 n 个或命名为 n 的匹配分组。"
      >
        <TextField
          v-model="data.url"
          placeholder="http(s):// 开头的网址，或者 URL Scheme"
          @blur="handleURLBlur"
          :append-icon="
            searchPatternType === 'query'
              ? mdiMagnify
              : searchPatternType === 'regex'
              ? mdiRegex
              : ''
          "
          :disabled="isBuiltinItem"
        >
          <template #append v-if="isEncodedURL || searchPatternType">
            <div class="flex items-center justify-center">
              <div
                v-if="isEncodedURL"
                class="flex w-[24px] cursor-pointer items-center justify-center"
                title="URL 解码"
                @click="handleDecodeURL"
              >
                <Icon :real-size="22" :icon="mdiCodeTags"></Icon>
              </div>
              <div class="w-2" v-if="isEncodedURL && searchPatternType"></div>
              <div
                v-if="searchPatternType"
                class="flex w-[24px] cursor-pointer items-center justify-center"
                title="测试 URL"
                @click="testURLDialog = true"
              >
                <Icon :real-size="20" :icon="mdiOpenInNew"></Icon>
              </div>
            </div>
          </template>
        </TextField>
      </BasicFormItem>

      <template v-if="searchPatternType === 'query'">
        <BasicFormItem
          label="搜索前缀"
          title="直接在主搜索框输入 `<搜索前缀> <搜索关键词>` 即可进入搜索"
          :verify="rules.keyword.verify"
        >
          <TextField
            v-model="data.keyword"
            placeholder="搜索前缀"
            @blur="checkProp(rules, 'keyword', data.keyword)"
          >
          </TextField>
        </BasicFormItem>
        <BasicFormItem label="默认搜索" title="在主搜索框匹配任何文本默认显示">
          <Checkbox
            :model-value="data.isOver"
            @click="data.isOver = !data.isOver"
          ></Checkbox>
        </BasicFormItem>
      </template>

      <template v-if="searchPatternType === 'regex'">
        <BasicFormItem
          label="自定义匹配"
          title="自定义匹配正则表达式"
          required
          :verify="rules.customMatch.verify"
        >
          <TextField
            v-model="data.customMatch"
            placeholder="正则表达式"
            @blur="checkProp(rules, 'customMatch', data.customMatch)"
          >
          </TextField>
        </BasicFormItem>
      </template>

      <BasicFormItem label="分类">
        <div class="flex items-center">
          <Select
            class="h-9 w-full"
            v-model="data.categoryId"
            :items="categoryStore.categories"
          ></Select>
          <div class="ml-2 cursor-pointer" title="所有分类">
            <Icon @click="categoryDialog = true" :icon="mdiShapeOutline"></Icon>
          </div>
        </div>
      </BasicFormItem>

      <BasicFormItem
        label="打开方式"
        :verify="{
          ...rules.app.verify,
          show: data.app?.trim() ? !isAppExist : false
        }"
      >
        <SelectAppInput
          v-model="data.app"
          @blur="checkProp(rules, 'app', data.app)"
          @select-file="checkProp(rules, 'app', data.app)"
        ></SelectAppInput>
      </BasicFormItem>

      <BasicFormItem>
        <Btn class="w-full bg-blue-500 text-white" @click="saveSearchItem">
          {{ op === 'update' ? '保存' : '添加' }}
        </Btn>

        <Btn
          class="mt-4 mb-2 w-full bg-red-500 text-white"
          @click="deleteDialog = true"
          v-if="op === 'update' && !isDefaultSearchItem(searchItemId)"
        >
          删除
        </Btn>
      </BasicFormItem>
    </BasicForm>

    <Dialog v-model="testURLDialog" title="测试 URL" btn-type="close">
      <TextField
        ref="testURLInputRef"
        :placeholder="
          searchPatternType === 'regex' ? '输入匹配正则的文本' : '输入关键词'
        "
        v-model="testURLInput"
        @keydown.enter="
          !$event.isComposing && isTestURLInputValid && handleTestURL()
        "
      ></TextField>
      <div class="mt-2 w-72">
        <template v-if="isTestURLInputValid">
          <div class="cursor-default">测试时打开 URL：</div>
          <div>{{ handledTestURL }}</div>
        </template>
      </div>
      <template #footer>
        <div class="flex justify-end px-4 pb-3 text-sm">
          <Btn
            class="text-white shadow-sm"
            :class="
              isTestURLInputValid
                ? 'bg-blue-500'
                : 'bg-neutral-200 dark:bg-neutral-700'
            "
            @click="handleTestURL"
            :disabled="!isTestURLInputValid"
          >
            打开
          </Btn>
        </div>
      </template>
    </Dialog>

    <Dialog v-model="deleteDialog" title="提示" @confirm="deleteSearchItem">
      <div class="w-52">确定要删除吗？</div>
    </Dialog>

    <Dialog btn-type="close" v-model="categoryDialog" title="所有分类">
      <ul class="w-72">
        <li
          v-for="(category, index) in categoryStore.categories"
          :key="category.id"
          class="flex items-center justify-between"
        >
          <input
            class="mr-1 bg-transparent outline-none"
            :value="category.text"
            :disabled="category.id === CategoryModel.DEFAULT.id"
            @blur="handleUpdateCategory($event, index)"
          />
          <Btn
            v-show="category.id !== CategoryModel.DEFAULT.id"
            class="flex-none text-sm font-bold text-red-500"
            @click="handleDeleteCategory(category, index)"
          >
            删除
          </Btn>
        </li>
        <li class="mt-5 flex justify-between">
          <TextField
            v-model="newCategoryName"
            size="small"
            class="mr-1"
            placeholder="分类名"
          ></TextField>
          <Btn
            class="flex-none text-sm font-bold text-blue-500"
            @click="handleAddCategory"
          >
            添加
          </Btn>
        </li>
      </ul>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import TextField from '@/components/common/TextField.vue'
import Btn from '@/components/common/Btn.vue'
import Icon from '@/components/common/Icon.vue'
import Header from '@/components/common/Header.vue'
import Select from '@/components/common/Select.vue'
import Dialog from '@/components/common/Dialog.vue'
import Checkbox from '@/components/common/Checkbox.vue'
import SelectAppInput from '@/components/info/SelectAppInput.vue'
import BasicFormItem from '@/components/info/BasicFormItem.vue'
import BasicForm from '@/components/info/BasicForm.vue'
import SelectImageInput from '@/components/info/SelectImageInput.vue'

import ItemModel from '@/models/ItemModel'
import CategoryModel from '@/models/CategoryModel'
import {
  reactive,
  ref,
  computed,
  onDeactivated,
  watchEffect,
  watch,
  nextTick
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore, useMainStore } from '@/store'
import {
  deepCopy,
  simpleTemplate,
  regexpTemplate,
  createRegExp
} from '@/utils/common'
import { checkFormAsync, checkProp, isValidRegex, Rules } from '@/utils/check'
import {
  mdiShapeOutline,
  mdiMagnify,
  mdiPackage,
  mdiCodeTags,
  mdiWebSync,
  mdiRegex,
  mdiSync,
  mdiApplicationOutline,
  mdiOpenInNew
} from '@mdi/js'
import { FileConstant } from '@/constant'
import { encodeToBase64 } from '@/utils/files'
import {
  existsFile,
  getFavicon,
  getHtmlTitle,
  getCurrentBrowserTab,
  convertImageToPngBase64,
  openCommand
} from '@/preload'
import { WindowAction } from 'utools-utils'

const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()
const categoryStore = useCategoryStore()

function handleDeleteCategory(category: CategoryModel, index: number) {
  if (mainStore.hasSearchItem(category.id)) {
    alert('当前分类下含有项目')
  } else {
    categoryStore.removeCategory(index)
  }
}

const isBuiltinItem = computed(
  () =>
    !!ItemModel.DEFAULT_SEARCH_ITEMS.find((item) => item.id === data.value.id)
)

const testURLInputRef = ref<InstanceType<typeof TextField> | null>(null)
const testURLDialog = ref(false)
const testURLInput = ref('')
const regexSearchPatternRegExp = computed(() => {
  if (
    searchPatternType.value === 'regex' &&
    data.value.customMatch &&
    isValidRegex(data.value.customMatch)
  )
    return createRegExp(data.value.customMatch)
  return null
})
const isTestURLInputValid = computed(() => {
  if (searchPatternType.value === 'query') return testURLInput.value.length > 0
  if (searchPatternType.value === 'regex')
    return regexSearchPatternRegExp.value?.test(testURLInput.value)
  return true
})

watch(testURLDialog, (newVal) => {
  if (newVal) {
    nextTick(() => {
      testURLInputRef.value?.focus()
    })
  } else {
    testURLInput.value = ''
  }
})

const handledTestURL = computed(() => {
  if (!testURLDialog.value) return undefined

  if (searchPatternType.value === 'regex') {
    if (data.value.customMatch) {
      return regexpTemplate(
        data.value.url,
        data.value.customMatch,
        testURLInput.value
      )
    }
  } else if (searchPatternType.value === 'query') {
    return simpleTemplate(data.value.url, { query: testURLInput.value })
  }
})

function handleTestURL() {
  if (!data.value.url) return

  try {
    if (handledTestURL.value) {
      openCommand(handledTestURL.value, data.value.app)
    }
  } catch (e) {
    alert(e)
  }
}

async function handleURLBlur() {
  checkProp(rules, 'url', data.value.url)
  if (isWebURL.value) {
    if (!data.value.title) {
      const htmlTitle = await getHtmlTitle(data.value.url)
      if (htmlTitle) {
        if (htmlTitle.includes(' - ')) {
          const [title, subtitle] = htmlTitle.split(' - ')
          data.value.title = title.trim()
          data.value.subtitle = subtitle.trim()
        } else if (htmlTitle.includes(' | ')) {
          const [subtitle, title] = htmlTitle.split(' | ')
          data.value.title = title.trim()
          data.value.subtitle = subtitle.trim()
        } else {
          data.value.title = htmlTitle
        }
        rules['title'].verify.show = false
      }
    }
  }
}

function handleUpdateCategory(e: any, index: number) {
  try {
    categoryStore.updateCategory(index, e.target.value)
  } catch (err) {
    alert(err)
  }
}

function handleAddCategory() {
  try {
    categoryStore.addCategory(newCategoryName.value)
    newCategoryName.value = ''
  } catch (err) {
    alert(err)
  }
}

const searchPatternType = computed(() => {
  const type = ItemModel.getSearchPatternType(data.value.url)
  if (type) return type
  return false
})

const isEncodedURL = computed(() => /%[0-9a-fA-F]{2}/.test(data.value.url))
function handleDecodeURL() {
  data.value.url = decodeURI(data.value.url)
}

const isWebURL = computed(() => /^https?:\/\/.+/.test(data.value.url))
async function handleDownloadFavicon() {
  try {
    getFaviconIconLoading.value = true
    const icon = await getFavicon(data.value.url)
    if (icon) {
      data.value.icon = icon
      getFaviconIconLoading.value = false
    }
  } catch (err: unknown) {
    getFaviconIconLoading.value = false
    alert(err)
  }
}

const isAppExist = computed(
  () => !!data.value.app?.trim() && existsFile(data.value.app)
)
function handleGetAppIcon() {
  if (isAppExist.value) {
    data.value.icon = utools.getFileIcon(data.value.app!)
  }
}

const op = ref<'update' | 'add'>('update')

const deleteDialog = ref(false)
const categoryDialog = ref(false)
const newCategoryName = ref('')

const searchItemId = ref(-1)
const data = ref(new ItemModel())

function isDefaultSearchItem(itemId: number) {
  return (
    ItemModel.DEFAULT_SEARCH_ITEMS.findIndex((item) => item.id === itemId) !==
    -1
  )
}

const titleFieldRef = ref<InstanceType<typeof TextField> | null>(null)

watchEffect(async () => {
  if (route.name !== 'Info') return

  const itemId = route.params.itemId as string
  const categoryId = route.params.categoryId as string

  // 通过项目 ID 区分页面作用
  if (/^[0-9]+$/.test(itemId)) {
    op.value = 'update'
    searchItemId.value = parseInt(itemId)
    data.value = deepCopy(mainStore.getSearchItem(searchItemId.value))
    data.value.enabled = data.value.enabled !== false
  } else {
    titleFieldRef.value?.focus()
    op.value = 'add'
    data.value = new ItemModel()
    // 设置默认分类 ID
    data.value.categoryId = categoryId
    if (itemId === 'add-item-from-browser') {
      const action = mainStore.action as WindowAction
      const tab = await getCurrentBrowserTab(action.payload)
      data.value.url = tab.url
      data.value.title = tab.title
    }
  }
})

const getFaviconIconLoading = ref(false)
// 变量恢复默认值
onDeactivated(() => {
  testURLDialog.value = false
  testURLInput.value = ''
  deleteDialog.value = false
  categoryDialog.value = false
  newCategoryName.value = ''
  getFaviconIconLoading.value = false
  for (const key in rules) {
    rules[key].verify.show = false
  }
})

const rules = reactive<Rules>({
  title: {
    check: (value?: string) => !!value,
    verify: { msg: '名称不能为空' }
  },
  url: {
    check: (value?: string) => !!value,
    verify: { msg: 'URL 不能为空' }
  },
  app: {
    check: (value?: string) => !value || existsFile(value),
    verify: { msg: '文件不存在' }
  },
  keyword: {
    check: (value?: string) => !value || /^[a-zA-Z0-9]+$/.test(value),
    verify: { msg: '搜索前缀只能为字母或数字' }
  },
  customMatch: {
    check: (value?: string) => !!value && isValidRegex(value),
    verify: {
      msg: '自定义匹配不能为空，且只能为 JavaScript 风格的正则表达式',
      disabled: () => searchPatternType.value !== 'regex'
    }
  }
})

async function saveSearchItem() {
  try {
    if (searchPatternType.value === 'query') {
      data.value.customMatch = ''
    } else if (searchPatternType.value === 'regex') {
      data.value.keyword = ''
    } else {
      data.value.customMatch = ''
      data.value.keyword = ''
    }
    await checkFormAsync(rules, data.value)
    if (op.value === 'add') {
      try {
        await mainStore.addSearchItem(data.value)
      } catch (err) {
        mainStore.removeSearchItem(data.value.id)
        return alert(err)
      }
    } else {
      await mainStore.updateSearchItem(searchItemId.value, data.value)
    }
    router.replace('/')
  } catch (err) {
    alert(err)
  }
}

function deleteSearchItem() {
  mainStore.removeSearchItem(searchItemId.value)
  router.replace('/')
}

async function handleSelectIcon(file: File) {
  // 限制图片的大小，单位 MB
  const limit = 0.512
  if (file.size > limit * FileConstant.MB) {
    alert(`图片大小不能超过 ${limit} MB！`)
    return
  }
  if (FileConstant.FEATURE_IMAGE_TYPES.includes(file.type)) {
    data.value.icon = await encodeToBase64(file)
  } else {
    data.value.icon = await convertImageToPngBase64(
      await file.arrayBuffer(),
      file.type
    )
  }
}

function handleDetachIcon() {
  data.value.icon = ''
}
</script>

<style lang="sass" scoped></style>
