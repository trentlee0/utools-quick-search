<template>
  <button
    class="mask outline-none transition duration-200"
    :class="`${ButtonType[type]}`"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
enum ButtonType {
  normal = 'py-1 px-3 rounded-md',
  circle = 'p-2 rounded-full',
  float = 'p-2 rounded-full fixed right-8 bottom-6'
}

withDefaults(
  defineProps<{
    type?: keyof typeof ButtonType
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
