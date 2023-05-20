<template>
  <TextField
    :model-value="modelValue"
    :icon="mdiMagnify"
    :autofocus="autofocus"
    placeholder="搜索"
    @update:model-value="emit('update:modelValue', $event)"
  ></TextField>
</template>

<script setup lang="ts">
import TextField from '@/components/common/TextField.vue'
import { mdiMagnify } from '@mdi/js'

withDefaults(
  defineProps<{
    modelValue: string
    autofocus?: boolean
  }>(),
  {
    autofocus: false
  }
)

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="sass" scoped></style>
