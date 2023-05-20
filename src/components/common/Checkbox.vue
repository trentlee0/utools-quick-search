<template>
  <div
    class="flex h-4 w-4 cursor-pointer overflow-hidden rounded bg-gray-200 dark:bg-gray-500"
    @click="handleClickEvent"
  >
    <input
      class="h-full w-full cursor-pointer accent-blue-500 outline-none"
      type="checkbox"
      :checked="modelValue"
      :hidden="!modelValue"
      @input="emit('input', $event)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue?: boolean }>(), { modelValue: false })

const emit = defineEmits(['update:modelValue', 'input'])

function handleClickEvent(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>

<style lang="sass" scoped></style>
