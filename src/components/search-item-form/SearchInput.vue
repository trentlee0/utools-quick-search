<template>
  <TextField
    :value="value"
    icon="mdiMagnify"
    :autofocus="autofocus"
    placeholder="搜索"
    @input="handlInputEvent"
  ></TextField>
</template>

<script setup lang="ts">
import TextField from '@/components/common/TextField.vue'

withDefaults(
  defineProps<{
    value: string
    autofocus?: boolean
  }>(),
  {
    autofocus: false
  }
)

const emits = defineEmits(['update:value', 'input'])
const handlInputEvent = (value: string) => {
  emits('update:value', value)
  emits('input', value)
}
</script>

<style lang="sass" scoped></style>
