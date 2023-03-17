<template>
  <!-- <div
    class="bg-no-repeat bg-center z-10"
    :style="{backgroundImage: `url(${src})`, backgroundSize: scale}"
  ></div> -->
  <img
    :class="`${ScaleMap[scale]} ${SideMap[side]}`"
    :src="src"
    :alt="alt"
    draggable="false"
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
    scale?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
    side?: 'center' | 'top' | 'left' | 'bottom' | 'right'
  }>(),
  {
    scale: 'contain',
    side: 'center'
  }
)
</script>

<style lang="sass" scoped></style>
