<template>
  <div
    class="flex w-full items-center justify-center"
    @dragover.prevent="dragging = true"
    @dragenter="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="handleDropEvent"
    :class="{'bg-neutral-200 dark:bg-neutral-600': dragging}"
  >
    <div
      class="w-14 h-14 cursor-pointer relative"
      title="选择图标"
      @click="openFileDialog"
    >
      <div
        class="absolute -left-2 -top-2 w-4 h-4 flex items-center justify-center cursor-default rounded-full text-neutral-500 bg-neutral-100 shadow-xl"
        @click.stop="handleDetachClick"
        v-show="!!src"
      >
        <Icon type="mdiCloseThick" :real-size="10"></Icon>
      </div>
      <Image
        v-show="src"
        class="w-full h-full border dark:border-gray-600"
        :src="src"
        scale="contain"
        alt="图标"
      ></Image>
      <div
        v-show="!src"
        class="w-full h-full flex justify-center items-center border dark:border-neutral-600 hover:border-gray-300 dark:hover:border-gray-500"
      >
        <Icon type="mdiImagePlusOutline" :real-size="20"></Icon>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      @change="handleSelectFile"
      accept=".png,.jpeg,.jpg,.webp"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import Image from '@/components/common/Image.vue'
import Icon from '@/components/common/Icon.vue'
import {ref} from 'vue'

withDefaults(
  defineProps<{
    src?: string
  }>(),
  {
    src: ''
  }
)

const fileInput = ref<any>(null)
const openFileDialog = () => {
  fileInput.value.click()
}

const emits = defineEmits(['select-file', 'detach-file'])
const handleSelectFile = (e: any) => {
  const file = e.target.files[0]
  emits('select-file', file)
}

const dragging = ref(false)
const handleDropEvent = (e: any) => {
  dragging.value = false
  const file = e.dataTransfer.files[0]
  emits('select-file', file)
}
const handleDetachClick = () => {
  emits('detach-file')
}
</script>

<style lang="sass" scoped></style>
