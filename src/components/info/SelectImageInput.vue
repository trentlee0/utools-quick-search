<template>
  <div
    class="flex w-full items-center justify-center"
    @dragover.prevent="dragging = true"
    @dragenter="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="handleDropEvent"
    :class="{ 'bg-neutral-200 dark:bg-neutral-600': dragging }"
  >
    <div
      class="relative h-14 w-14 cursor-pointer"
      title="选择图标"
      @click="openFileDialog"
    >
      <div
        class="absolute -left-2 -top-2 flex h-4 w-4 cursor-default items-center justify-center rounded-full bg-neutral-100 text-neutral-500 shadow-xl"
        @click.stop="handleDetachClick"
        v-show="!!src"
      >
        <Icon :icon="mdiCloseThick" :real-size="10"></Icon>
      </div>
      <Image
        v-show="src"
        class="h-full w-full border dark:border-gray-600"
        :src="src"
        scale="contain"
        alt="图标"
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
      accept=".png,.jpeg,.jpg,.webp"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import Image from '@/components/common/Image.vue'
import Icon from '@/components/common/Icon.vue'
import { ref } from 'vue'
import { mdiCloseThick, mdiImagePlusOutline } from '@mdi/js'

withDefaults(
  defineProps<{
    src?: string
  }>(),
  {
    src: ''
  }
)

const fileInputRef = ref<HTMLInputElement | null>(null)
function openFileDialog() {
  fileInputRef.value?.click()
}

const emit = defineEmits(['select-file', 'detach-file'])
function handleSelectFile(e: Event) {
  const file = (e.target as HTMLInputElement).files![0]
  emit('select-file', file)
}

const dragging = ref(false)
function handleDropEvent(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer!.files[0]
  emit('select-file', file)
}
function handleDetachClick() {
  emit('detach-file')
}
</script>

<style lang="sass" scoped></style>
