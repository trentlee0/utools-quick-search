<template>
  <div
    class="bg-gray-200 dark:bg-gray-500 w-4 h-4 flex rounded overflow-hidden cursor-pointer"
    @click="handleClickEvent"
  >
    <input
      class="cursor-pointer w-full h-full outline-none accent-blue-500"
      type="checkbox"
      :checked="value"
      :hidden="!value"
      @input="emits('input', $event)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{value?: boolean}>(), {value: false})

const emits = defineEmits(['update:value', 'input'])

const handleClickEvent = (e: any) => {
  emits('update:value', e.target.checked)
}
</script>

<style lang="sass" scoped></style>
