<template>
  <TextField
    ref="textFieldRef"
    :model-value="modelValue"
    :icon="mdiMagnify"
    :autofocus="autofocus"
    placeholder="搜索"
    @focus="isFocused = true"
    @blur="isFocused = false"
    @update:model-value="emit('update:modelValue', $event)"
  ></TextField>
</template>

<script setup lang="ts">
import TextField from '@/components/common/TextField.vue'
import { useKeyDown } from '@/hooks/useKeyDown'
import { mdiMagnify } from '@mdi/js'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    autofocus?: boolean
  }>(),
  {
    autofocus: false
  }
)

const textFieldRef = ref<InstanceType<typeof TextField> | null>(null)
const isFocused = ref(false)

function focus() {
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  textFieldRef.value?.focus()
}

useKeyDown((e) => {
  if (
    ((utools.isMacOS() && e.metaKey) || (utools.isWindows() && e.ctrlKey)) &&
    !e.shiftKey &&
    !e.altKey &&
    e.key === 'f'
  ) {
    focus()
  }
  if (/^\w$/.test(e.key)) {
    focus()
    if (!isFocused.value) {
      emit('update:modelValue', props.modelValue + e.key)
    }
  }
})

defineExpose({
  focus
})

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="sass" scoped></style>
