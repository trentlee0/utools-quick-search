<template>
  <div class="flex w-full items-center">
    <label v-if="label" :for="label" class="mr-2">{{ label }}</label>
    <div
      class="input-class flex w-full items-center rounded-md border px-2 py-1 transition focus-within:border-gray-500 dark:focus-within:border-gray-400"
      :class="`${
        disabled
          ? 'cursor-default border-gray-100 dark:border-stone-700'
          : 'cursor-text border-gray-300 dark:border-stone-600'
      } ${SizeMap[size]}`"
      @click="focus"
    >
      <div class="mr-1" v-if="icon">
        <Icon :icon="icon" :real-size="22"></Icon>
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
        @compositionstart="handleCompositionStart($event as CompositionEvent)"
        @compositionend="handleCompositionEnd($event as CompositionEvent)"
        @input="handleInputEvent($event as InputEvent)"
        @focus="emit('focus', $event)"
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
    <div class="ml-2" v-if="$slots.append">
      <slot name="append"></slot>
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input', payload: InputEvent | CompositionEvent): void
  (e: 'focus', payload: FocusEvent): void
  (e: 'blur', payload: FocusEvent): void
}>()

const composing = ref(false)

function handleCompositionStart(e: CompositionEvent) {
  composing.value = true
}

function handleCompositionEnd(e: CompositionEvent) {
  composing.value = false
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('input', e)
}

function handleInputEvent(e: InputEvent) {
  if (composing.value) return
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('input', e)
}

const textInput = ref<HTMLInputElement | null>(null)

function focus() {
  textInput.value?.focus()
}

defineExpose({
  focus
})
</script>

<style lang="sass" scoped>
.input-class
  @apply bg-transparent
</style>
