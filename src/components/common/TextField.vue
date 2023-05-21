<template>
  <div class="flex w-full items-center">
    <label v-if="label" :for="label" class="mr-2">{{ label }}</label>
    <div
      class="input-class flex w-full items-center rounded-md border px-3 py-1 transition focus-within:border-gray-500 dark:focus-within:border-gray-400"
      :class="`${
        disabled
          ? 'cursor-default border-gray-100 dark:border-stone-700'
          : 'cursor-text border-gray-300 dark:border-stone-600'
      } ${SizeMap[size]}`"
      @click="clickEvent"
    >
      <div class="mr-2" v-if="icon">
        <Icon :icon="icon"></Icon>
      </div>
      <input
        :id="label"
        ref="textInput"
        :disabled="disabled"
        :type="type"
        :readonly="readonly"
        class="input-class w-full outline-none"
        :value="modelValue"
        :placeholder="placeholder"
        :autofocus="autofocus"
        @input="handlInputEvent"
        @blur="emit('blur', $event)"
      />
      <div
        class="ml-2 flex cursor-default items-center"
        v-if="!!appendIcon"
        :title="appendIconTitle"
      >
        <Icon :icon="appendIcon" size="small"></Icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/common/Icon.vue'

enum SizeMap {
  small = 'text-sm',
  medium = '',
  large = 'text-lg'
}

withDefaults(
  defineProps<{
    modelValue?: string
    icon?: string
    autofocus?: boolean
    placeholder?: string
    label?: string
    type?: string
    disabled?: boolean
    readonly?: boolean
    appendIcon?: string
    appendIconTitle?: string
    size?: keyof typeof SizeMap
  }>(),
  {
    autofocus: false,
    full: false,
    text: 'text',
    disabled: false,
    readonly: false,
    size: 'medium'
  }
)

const emit = defineEmits(['update:modelValue', 'input', 'blur'])
function handlInputEvent(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('input', value)
}

const textInput = ref<HTMLInputElement | null>(null)
function clickEvent() {
  textInput.value?.focus()
}
</script>

<style lang="sass" scoped>
.input-class
  @apply bg-transparent
</style>
