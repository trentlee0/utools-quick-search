<template>
  <img
    :class="`${ScaleMap[scale]} ${SideMap[side]}`"
    :src="src"
    :alt="alt"
    :draggable="draggable"
  />
</template>

<script setup lang="ts">
enum ScaleMap {
  contain = 'object-contain',
  cover = 'object-cover',
  fill = 'object-fill',
  none = 'object-none',
  'scale-down' = 'object-scale-down'
}

enum SideMap {
  center = 'object-center',
  top = 'object-top',
  left = 'object-left',
  bottom = 'object-bottom',
  right = 'object-right'
}

withDefaults(
  defineProps<{
    src?: string
    alt?: string
    scale?: keyof typeof ScaleMap
    side?: keyof typeof SideMap
    draggable?: boolean
  }>(),
  {
    scale: 'contain',
    side: 'center',
    draggable: false
  }
)
</script>

<style lang="sass" scoped></style>
