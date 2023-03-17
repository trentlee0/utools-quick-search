<template>
  <div class="flex items-center">
    <TextField
      :value="value"
      placeholder="默认应用"
      @input="handleInputEvent"
      @blur="emits('blur', $event)"
    ></TextField>
    <div class="ml-2 cursor-pointer" title="选择应用">
      <Icon @click="openFileDialog" type="mdiApps"></Icon>
    </div>
    <input
      ref="fileInput"
      type="file"
      @change="handleSelectFile"
      accept=".app,.exe"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import TextField from '@/components/common/TextField.vue'
import Icon from '@/components/common/Icon.vue'
import {ref} from 'vue'
import {isUTools} from '@/utils/common'

withDefaults(
  defineProps<{
    value?: string
  }>(),
  {
    value: ''
  }
)

const fileInput = ref<HTMLInputElement | null>(null)
const openFileDialog = () => {
  if (isUTools()) {
    const getFilter = () => {
      if (utools.isWindows()) return {name: '可执行程序', extensions: ['exe']}
      if (utools.isMacOS()) return {name: '应用程序', extensions: ['app']}
      return {name: '可执行文件', extensions: ['']}
    }
    const filePaths = utools.showOpenDialog({
      filters: [getFilter()],
      defaultPath: utools.isMacOS()
        ? '/Applications'
        : utools.getPath('desktop')
    })
    const filePath = filePaths?.at(0)
    emits('update:value', filePath)
    emits('select-file', filePath)
  } else {
    fileInput.value?.click()
  }
}

const emits = defineEmits(['input', 'blur', 'update:value', 'select-file'])
const handleSelectFile = (e: any) => {
  const {files} = e.target
  const filePath = files[0]?.path
  emits('update:value', filePath)
  emits('select-file', filePath)
}

const handleInputEvent = (value: string) => {
  emits('update:value', value)
  emits('input', value)
}
</script>

<style lang="sass" scoped></style>
