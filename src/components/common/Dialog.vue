<template>
  <div
    ref="outsideContent"
    v-show="value"
    class="w-full h-full fixed top-0 left-0 z-50 flex justify-center items-center shadow-sm"
    style="background: rgba(0, 0, 0, 0.65)"
    @click="handleOutsideClick"
  >
    <div class="bg-white dark:bg-neutral-800">
      <div class="p-3 flex items-center">
        <Icon
          class="cursor-pointer mr-2"
          :real-size="20"
          type="mdiClose"
          @click="emitValue"
          v-if="btnType === 'close'"
        ></Icon>
        <span class="font-bold select-none">{{ title }}</span>
      </div>
      <Divider></Divider>
      <div class="p-4 pb-5">
        <slot></slot>
      </div>
      <div class="px-4 py-3 flex justify-end" v-if="btnType === 'confirm'">
        <Btn
          class="mr-3 border dark:border-gray-500 shadow-sm"
          @click="handleCancelClick"
          >取消</Btn
        >
        <Btn
          class="bg-blue-500 text-white shadow-sm"
          @click="handleConfirmClick"
          >确认</Btn
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Divider from '@/components/common/Divider.vue'
import Btn from '@/components/common/Btn.vue'
import Icon from '@/components/common/Icon.vue'
import {ref} from 'vue'

const outsideContent = ref(null)

const props = withDefaults(
  defineProps<{
    value: boolean
    title?: string
    outsideClosable?: boolean
    btnType?: 'close' | 'confirm'
  }>(),
  {
    title: '',
    outsideClosable: true,
    btnType: 'confirm'
  }
)

const emits = defineEmits(['update:value', 'confirm', 'cancel'])
const emitValue = () => {
  emits('update:value', false)
}
const handleConfirmClick = () => {
  emits('confirm')
  emitValue()
}
const handleCancelClick = () => {
  emits('cancel')
  emitValue()
}
const handleOutsideClick = (e: any) => {
  if (props.outsideClosable && e.target === outsideContent.value) {
    emitValue()
  }
}
</script>

<style lang="sass" scoped></style>
