<template>
  <div class="w-full px-2">
    <Header :title="op === 'add' ? '添加搜索项' : '修改搜索项'"></Header>

    <BasicForm class="mt-10">
      <BasicFormItem label="图标">
        <div class="flex justify-center">
          <SelectImageInput
            :src="data.icon"
            @select-file="handleSelectIcon"
            @detach-file="handleDetachIcon"
          ></SelectImageInput>
        </div>
      </BasicFormItem>

      <BasicFormItem label="名称" :verify="rules.title.verify">
        <TextField
          v-model:value="data.title"
          @blur="checkProp(rules, 'title', data.title)"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem label="子标题">
        <TextField
          v-model:value="data.subtitle"
          placeholder="默认应用打开"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem
        label="URL"
        :verify="rules.url.verify"
        help="要使用搜索，请用 `{query}` 替换搜索关键词"
      >
        <TextField
          v-model:value="data.url"
          @blur="checkProp(rules, 'url', data.url)"
          :append-icon="isQueryItem ? 'mdiMagnify' : ''"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem
        label="关键字"
        help="直接在主搜索框输入 `关键字 <搜索关键词>` 即可搜索（需要 URL 包含 `{query}`）"
        :verify="rules.keyword.verify"
      >
        <TextField
          :disabled="!isQueryItem"
          v-model:value="data.keyword"
          @blur="checkProp(rules, 'keyword', data.keyword)"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem label="分类">
        <div class="flex items-center">
          <Select
            class="w-full h-9"
            v-model:value="data.categoryId"
            :items="categories"
          ></Select>
          <div class="ml-2 cursor-pointer" title="所有分类">
            <Icon @click="categoryDialog = true" type="mdiShapeOutline"></Icon>
          </div>
        </div>
      </BasicFormItem>

      <BasicFormItem label="打开方式" :verify="rules.app.verify">
        <SelectAppInput
          v-model:value="data.app"
          @blur="checkProp(rules, 'app', data.app)"
          @select-file="checkProp(rules, 'app', data.app)"
        ></SelectAppInput>
      </BasicFormItem>

      <BasicFormItem>
        <Btn class="bg-blue-500 text-white w-full" @click="saveSearchItem">
          {{ op === 'updateOrDelete' ? '保存' : '添加' }}
        </Btn>

        <Btn
          class="mt-4 bg-red-500 text-white w-full"
          @click="deleteDialog = true"
          v-if="op === 'updateOrDelete'"
        >
          删除
        </Btn>
      </BasicFormItem>
    </BasicForm>

    <Dialog
      v-model:value="deleteDialog"
      title="提示"
      @confirm="deleteSearchItem"
    >
      <div class="w-52">确定要删除吗？</div>
    </Dialog>

    <Dialog
      v-model:value="categoryDialog"
      title="所有分类"
      :outside-closable="false"
      btn-type="close"
    >
      <ul class="w-72">
        <li
          v-for="(category, index) in categories"
          :key="category.id"
          class="flex items-center justify-between"
        >
          <input
            :disabled="category.id === CategoryModel.DEFAULT.id"
            class="bg-transparent outline-none mr-1"
            :value="category.text"
            @blur="handleUpdateCategory($event, index)"
          />
          <Btn
            v-show="category.id !== CategoryModel.DEFAULT.id"
            class="flex-none text-red-500 font-bold text-sm"
            @click="handleDeleteCategory(category, index)"
          >
            删除
          </Btn>
        </li>
        <li class="flex justify-between mt-5">
          <TextField
            v-model:value="newCategory"
            size="small"
            class="mr-1"
            placeholder="分类名"
          ></TextField>
          <Btn
            class="flex-none text-blue-500 font-bold text-sm"
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
import SelectAppInput from '@/components/search-item-form/SelectAppInput.vue'
import BasicFormItem from '@/components/search-item-form/BasicFormItem.vue'
import BasicForm from '@/components/search-item-form/BasicForm.vue'
import SelectImageInput from '@/components/search-item-form/SelectImageInput.vue'
import SearchItemModel from '@/models/SearchItemModel'
import CategoryModel from '@/models/CategoryModel'
import {reactive, ref, computed, onActivated, onDeactivated} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCategoryStore, useMainStore} from '@/store'
import {deepCopy} from '@/utils/common'
import {checkFormAsync, checkProp, Rules} from '@/utils/check'

const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()
const categoryStore = useCategoryStore()

const handleDeleteCategory = (category: CategoryModel, index: number) => {
  if (mainStore.hasAnySearchItem(category.id)) {
    alert('当前分类下含有内容')
  } else {
    categoryStore.removeCategory(index)
  }
}
const handleUpdateCategory = (e: any, index: number) => {
  categoryStore.updateCategory(index, e.target.value).catch((err) => alert(err))
}
const handleAddCategory = () => {
  categoryStore
    .addCategory(newCategory.value)
    .then(() => {
      newCategory.value = ''
    })
    .catch((err) => alert(err))
}

const categories = computed(() => categoryStore.categories)
const isQueryItem = computed(() => {
  if (data.value.url.includes('{query}')) {
    return true
  } else {
    data.value.keyword = ''
    return false
  }
})

const op = ref<'updateOrDelete' | 'add'>()

const deleteDialog = ref<boolean>(false)
const categoryDialog = ref<boolean>(false)
const newCategory = ref<string>('')

const searchItemId = ref<number>(-1)
const data = ref<SearchItemModel>(new SearchItemModel())
onActivated(() => {
  const {itemId, categoryId} = route.params
  // 通过搜索项 ID 区分页面作用
  if (!!itemId) {
    op.value = 'updateOrDelete'
    searchItemId.value = parseInt(itemId as string)
    data.value = deepCopy(mainStore.getSearchItem(searchItemId.value))
  } else {
    op.value = 'add'
    data.value = new SearchItemModel()
    // 设置默认分类 ID
    data.value.categoryId = categoryId as string
  }
})
// 变量恢复默认值
onDeactivated(() => {
  deleteDialog.value = false
  categoryDialog.value = false
  newCategory.value = ''
  Object.values(rules).forEach((item) => {
    item.verify.show = false
  })
  data.value = new SearchItemModel()
})

const rules = reactive<Rules>({
  title: {
    check: (value?: string) => !!value,
    verify: {msg: '名称不能为空', show: false}
  },
  url: {
    check: (value?: string) => !!value,
    verify: {msg: 'URL 不能为空', show: false}
  },
  app: {
    check: (value?: string) => !value || existsFile(value),
    verify: {msg: '文件不存在', show: false}
  },
  keyword: {
    check: (value?: string) => !value || /^[a-zA-Z0-9]+$/.test(value),
    verify: {msg: '关键字只能为字母或数字', show: false}
  }
})
const saveSearchItem = () => {
  checkFormAsync(rules, data.value)
    .then(() => {
      if (op.value === 'add') {
        mainStore
          .addSearchItem(data.value)
          .then(() => router.replace('/'))
          .catch((err) => {
            mainStore.removeSearchItem(data.value.id)
            alert(err)
          })
      } else {
        mainStore
          .updateSearchItem(searchItemId.value, data.value)
          .then(() => router.replace('/'))
          .catch((err) => alert(err))
      }
    })
    .catch((err: Error) => alert(err.message))
}

const deleteSearchItem = () => {
  mainStore.removeSearchItem(searchItemId.value)
  router.replace('/')
}

const handleSelectIcon = (file: any) => {
  // 限制图片的大小，单位 MB
  const limit = 0.512
  if (file.size > limit * 1024 * 1024) {
    alert(`图片大小要小于等于 ${limit} MB！`)
    return
  }
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
      const str = String.fromCharCode(...new Uint8Array(buffer))
      return `data:${file.type};base64,${window.btoa(str)}`
    }
    data.value.icon = arrayBufferToBase64(reader.result as ArrayBuffer)
  }
}
const handleDetachIcon = () => {
  data.value.icon = ''
}
</script>

<style lang="sass" scoped></style>
