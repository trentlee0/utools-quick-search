<template>
  <button
    :class="`mask outline-none ${ButtonType[type]} transition duration-200`"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
enum ButtonType {
  'normal' = 'py-1 px-3 rounded-md',
  'circle' = 'p-2 rounded-full',
  'float' = 'p-2 rounded-full fixed right-8 bottom-6'
}

withDefaults(
  defineProps<{
    type?: 'normal' | 'circle' | 'float'
  }>(),
  {
    type: 'normal'
  }
)
</script>

<style lang="sass" scoped>
.mask
  filter: opacity(0.88)
.mask:hover
  filter: opacity(1)
</style>
