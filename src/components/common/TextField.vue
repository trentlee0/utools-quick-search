<template>
  <div class="flex w-full items-center">
    <label v-if="label" :for="label" class="mr-2">{{ label }}</label>
    <div
      class="input-class w-full rounded-md px-3 py-1 flex items-center border focus-within:border-gray-500 dark:focus-within:border-gray-400 transition"
      :class="`${
        disabled
          ? 'cursor-default border-gray-100 dark:border-stone-700'
          : 'cursor-text border-gray-300 dark:border-stone-600'
      } ${SizeMap[size]}`"
      @click="clickEvent"
    >
      <div class="mr-2" v-if="icon">
        <Icon :type="icon"></Icon>
      </div>
      <input
        :id="label"
        ref="textInput"
        :disabled="disabled"
        :type="type"
        class="input-class w-full outline-none"
        :value="value"
        :placeholder="placeholder"
        :autofocus="autofocus"
        @input="handlInputEvent"
        @blur="emits('blur', $event)"
      />
      <div class="ml-2 cursor-default" v-if="!!appendIcon">
        <Icon :type="appendIcon" size="small"></Icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import Icon from '@/components/common/Icon.vue'

enum SizeMap {
  small = 'text-sm',
  medium = '',
  large = 'text-lg'
}

withDefaults(
  defineProps<{
    value?: string
    icon?: string
    autofocus?: boolean
    placeholder?: string
    label?: string
    type?: string
    disabled?: boolean
    appendIcon?: string
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    autofocus: false,
    full: false,
    text: 'text',
    disabled: false,
    size: 'medium'
  }
)

const emits = defineEmits(['update:value', 'input', 'blur'])
const handlInputEvent = (e: any) => {
  emits('update:value', e.target.value)
  emits('input', e.target.value)
}

const textInput = ref<any>()
const clickEvent = () => {
  textInput.value.focus()
}
</script>

<style lang="sass" scoped>
.input-class
  @apply bg-transparent
</style>
