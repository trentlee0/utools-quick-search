<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div class="dialog-mask" v-if="modelValue" @click="handleOutsideClick">
        <div class="dialog-container" @click.stop>
          <div class="rounded-md bg-white dark:bg-neutral-800">
            <div class="flex items-center px-4 py-3">
              <slot name="header">
                <Icon
                  class="mr-2 cursor-pointer"
                  :real-size="20"
                  :icon="mdiClose"
                  @click="emit('update:modelValue', false)"
                  v-if="btnType === 'close'"
                ></Icon>
                <span class="select-none font-bold">{{ title }}</span>
              </slot>
            </div>

            <Divider></Divider>

            <div class="px-5 py-4">
              <slot></slot>
            </div>

            <slot name="footer">
              <div
                v-if="btnType === 'confirm'"
                class="flex justify-end px-4 pb-3 text-sm"
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
            </slot>
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
import { mdiClose } from '@mdi/js'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    persistence?: boolean
    btnType?: 'none' | 'close' | 'confirm'
  }>(),
  {
    title: '',
    persistence: false,
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

function handleOutsideClick(e: Event) {
  if (!props.persistence) {
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
