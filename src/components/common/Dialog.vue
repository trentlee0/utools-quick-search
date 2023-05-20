<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div class="dialog-mask" v-if="modelValue">
        <div
          ref="outsideContent"
          class="dialog-container"
          @click="handleOutsideClick"
        >
          <div class="bg-white dark:bg-neutral-800">
            <div class="flex items-center p-3">
              <Icon
                class="mr-2 cursor-pointer"
                :real-size="20"
                :icon="mdiClose"
                @click="emit('update:modelValue', false)"
                v-if="btnType === 'close'"
              ></Icon>
              <span class="select-none font-bold">{{ title }}</span>
            </div>

            <Divider></Divider>

            <div class="p-4 pb-5">
              <slot></slot>
            </div>

            <div
              class="flex justify-end px-4 py-3"
              v-if="btnType === 'confirm'"
            >
              <Btn
                class="mr-3 border shadow-sm dark:border-gray-500"
                @click="handleCancelClick"
              >
                取消
              </Btn>
              <Btn
                class="bg-blue-500 text-white shadow-sm"
                @click="handleConfirmClick"
              >
                确认
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Divider from '@/components/common/Divider.vue'
import Btn from '@/components/common/Btn.vue'
import Icon from '@/components/common/Icon.vue'
import { ref } from 'vue'
import { mdiClose } from '@mdi/js'

const outsideContent = ref(null)

const props = withDefaults(
  defineProps<{
    modelValue: boolean
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

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function handleConfirmClick() {
  emit('confirm')
  emit('update:modelValue', false)
}

function handleCancelClick() {
  emit('cancel')
  emit('update:modelValue', false)
}

function handleOutsideClick(e: any) {
  if (props.outsideClosable && e.target === outsideContent.value) {
    emit('update:modelValue', false)
  }
}
</script>

<style lang="sass">
.dialog-mask
  @apply fixed top-0 left-0 w-full h-full flex z-50
  background: rgba(0, 0, 0, 0.65)
  transition: all 0.3s ease

.dialog-container
  @apply shadow-lg m-auto
  transition: all 0.3s ease

.dialog-enter-from
  opacity: 0

.dialog-leave-to
  opacity: 0

.dialog-enter-from .dialog-container,.dialog-leave-to .dialog-container
  transform: scale(1.1)
</style>
