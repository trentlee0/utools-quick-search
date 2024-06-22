<template>
  <div
    class="flex w-full items-center justify-center"
    @dragover.prevent="handleDragEnter"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDropEvent"
    :class="{ 'bg-neutral-200 dark:bg-neutral-600': dragging }"
  >
    <div
      class="relative h-14 w-14 cursor-pointer select-none"
      title="选择图标，可拖拽图片到此"
      @click="openFileDialog"
    >
      <div
        class="absolute -left-2 -top-2 flex h-4 w-4 cursor-default items-center justify-center rounded-full bg-neutral-100 text-neutral-500 shadow-xl"
        @click.stop="handleDetachClick"
        v-show="!!src && !disabled"
      >
        <Icon :icon="mdiCloseThick" :real-size="10"></Icon>
      </div>
      <Image
        v-show="src"
        class="h-full w-full border dark:border-gray-600"
        :src="src"
        scale="contain"
        alt="图标"
        :draggable="true"
      ></Image>
      <div
        v-show="!src"
        class="flex h-full w-full items-center justify-center border hover:border-gray-300 dark:border-neutral-600 dark:hover:border-gray-500"
      >
        <Icon :icon="mdiImagePlusOutline" :real-size="20"></Icon>
      </div>
    </div>
    <input
      ref="fileInputRef"
      type="file"
      @change="handleSelectFile"
      :accept="acceptTypes"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import Image from '@/components/common/Image.vue'
import Icon from '@/components/common/Icon.vue'
import { ref } from 'vue'
import { mdiCloseThick, mdiImagePlusOutline } from '@mdi/js'

const props = withDefaults(
  defineProps<{
    src?: string
    disabled?: boolean
  }>(),
  {
    src: ''
  }
)

const acceptTypes = ref(['image/png', 'image/jpeg'].join(','))

const fileInputRef = ref<HTMLInputElement | null>(null)
function openFileDialog() {
  if (!props.disabled) {
    fileInputRef.value?.click()
  }
}

function handleDragEnter() {
  if (props.disabled) return
  dragging.value = true
}

function handleDragLeave() {
  if (props.disabled) return
  dragging.value = false
}

const emit = defineEmits(['select-file', 'detach-file'])
function handleSelectFile(e: Event) {
  const file = (e.target as HTMLInputElement).files![0]
  emit('select-file', file)
}

function getDropData(e: DragEvent) {
  if (!e.dataTransfer?.types.length) return null

  for (let i = 0; i < e.dataTransfer.types.length; i++) {
    const type = e.dataTransfer.types[i]
    if (type === 'Files') {
      return { type: 'Files', data: e.dataTransfer.files }
    } else {
      return { type, data: e.dataTransfer.getData(type) }
    }
  }
  return null
}

const dragging = ref(false)
function handleDropEvent(e: DragEvent) {
  if (props.disabled) return

  dragging.value = false

  const drop = getDropData(e)
  if (!drop) return
  if (drop.type !== 'Files') {
    alert('仅支持图片文件！')
    return
  }

  const file = (drop.data as FileList)[0]
  if (file.type && acceptTypes.value.includes(file.type)) {
    emit('select-file', file)
  } else {
    alert('图片类型只能是：' + acceptTypes.value)
  }
}
function handleDetachClick() {
  emit('detach-file')
}
</script>

<style lang="sass" scoped></style>
