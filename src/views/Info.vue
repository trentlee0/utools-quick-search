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

      <BasicFormItem label="名称" required :verify="rules.title.verify">
        <TextField
          v-model="data.title"
          @blur="checkProp(rules, 'title', data.title)"
          :append-icon="isBuiltinItem ? mdiPackage : undefined"
          append-icon-title="内置搜索项"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem label="子标题">
        <TextField
          v-model="data.subtitle"
          placeholder="默认应用打开"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem
        label="URL"
        required
        :verify="rules.url.verify"
        title="要使用搜索，请用 `{query}` 替换搜索关键词"
      >
        <TextField
          v-model="data.url"
          @blur="checkProp(rules, 'url', data.url)"
          :append-icon="isQueryItem ? mdiMagnify : ''"
          :disabled="isBuiltinItem"
        ></TextField>
      </BasicFormItem>

      <BasicFormItem
        label="关键字"
        title="直接在主搜索框输入 `关键字 <搜索关键词>` 即可搜索（需要 URL 包含 `{query}`）"
        :verify="rules.keyword.verify"
      >
        <TextField
          :disabled="!isQueryItem"
          v-model="data.keyword"
          @blur="checkProp(rules, 'keyword', data.keyword)"
        ></TextField>
      </BasicFormItem>

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

      <BasicFormItem label="打开方式" :verify="rules.app.verify">
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
          class="mt-4 w-full bg-red-500 text-white"
          @click="deleteDialog = true"
          v-if="op === 'update' && !isDefaultSearchItem(searchItemId)"
        >
          删除
        </Btn>
      </BasicFormItem>
    </BasicForm>

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
import SelectAppInput from '@/components/info/SelectAppInput.vue'
import BasicFormItem from '@/components/info/BasicFormItem.vue'
import BasicForm from '@/components/info/BasicForm.vue'
import SelectImageInput from '@/components/info/SelectImageInput.vue'
import SearchItemModel from '@/models/SearchItemModel'
import CategoryModel from '@/models/CategoryModel'
import { reactive, ref, computed, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore, useMainStore } from '@/store'
import { deepCopy } from '@/utils/common'
import { checkFormAsync, checkProp, Rules } from '@/utils/check'
import { mdiShapeOutline, mdiMagnify, mdiPackage } from '@mdi/js'
import { FileConstant } from '@/constant'
import { encodeToBase64 } from '@/utils/files'
import { existsFile } from '@/preload'

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
    !!SearchItemModel.DEFAULT_SEARCH_ITEMS.find(
      (item) => item.id === data.value.id
    )
)

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

const isQueryItem = computed(() => {
  if (data.value.url.includes('{query}')) return true
  data.value.keyword = ''
  return false
})

const op = ref<'update' | 'add'>()

const deleteDialog = ref(false)
const categoryDialog = ref(false)
const newCategoryName = ref('')

const searchItemId = ref(-1)
const data = ref(new SearchItemModel())

function isDefaultSearchItem(itemId: number) {
  return (
    SearchItemModel.DEFAULT_SEARCH_ITEMS.findIndex(
      (item) => item.id === itemId
    ) !== -1
  )
}

onActivated(() => {
  const { itemId, categoryId } = route.params

  // 通过搜索项 ID 区分页面作用
  if (itemId) {
    op.value = 'update'
    searchItemId.value = parseInt(itemId as string)
    data.value = deepCopy(mainStore.getSearchItem(searchItemId.value))
    data.value.enabled = data.value.enabled !== false
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
  newCategoryName.value = ''
  for (const key in rules) {
    rules[key].verify.show = false
  }
})

const rules = reactive<Rules>({
  title: {
    check: (value?: string) => !!value,
    verify: { msg: '名称不能为空', show: false }
  },
  url: {
    check: (value?: string) => !!value,
    verify: { msg: 'URL 不能为空', show: false }
  },
  app: {
    check: (value?: string) => !value || existsFile(value),
    verify: { msg: '文件不存在', show: false }
  },
  keyword: {
    check: (value?: string) => !value || /^[a-zA-Z0-9]+$/.test(value),
    verify: { msg: '关键字只能为字母或数字', show: false }
  }
})

async function saveSearchItem() {
  try {
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
    alert(`图片大小要小于等于 ${limit} MB！`)
    return
  }
  data.value.icon = await encodeToBase64(file)
}

function handleDetachIcon() {
  data.value.icon = ''
}
</script>

<style lang="sass" scoped></style>
