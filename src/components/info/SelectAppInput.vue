<template>
  <div class="flex items-center">
    <TextField
      :model-value="modelValue"
      placeholder="默认应用"
      @input="handleInputEvent"
      @blur="emit('blur', $event)"
    ></TextField>
    <div class="ml-2 cursor-pointer" title="选择应用">
      <Icon @click="openFileDialog" :icon="mdiApps"></Icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextField from '@/components/common/TextField.vue'
import Icon from '@/components/common/Icon.vue'
import { mdiApps } from '@mdi/js'

withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  {
    modelValue: ''
  }
)

const emit = defineEmits(['input', 'blur', 'update:modelValue', 'select-file'])

function openFileDialog() {
  const getFilter = () => {
    if (utools.isWindows()) return { name: '可执行程序', extensions: ['exe'] }
    if (utools.isMacOS()) return { name: '应用程序', extensions: ['app'] }
    return { name: '可执行文件', extensions: [''] }
  }
  const getPath = () => {
    if (utools.isWindows()) return utools.getPath('desktop')
    if (utools.isMacOS()) return '/Applications'
    return '/usr'
  }
  const filePaths = utools.showOpenDialog({
    filters: [getFilter()],
    defaultPath: getPath()
  })
  const filePath = filePaths?.at(0)
  emit('update:modelValue', filePath)
  emit('select-file', filePath)
}

function handleInputEvent(value: string) {
  emit('update:modelValue', value)
  emit('input', value)
}
</script>

<style lang="sass" scoped></style>
