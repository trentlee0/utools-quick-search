<template>
  <svg-icon
    :path="useIcon(type)"
    :size="realSize ? realSize : SizeMap[size]"
    :viewbox="viewbox"
    :flip="flip"
    :rotate="rotate"
    :style="{color: color ?? ''}"
  ></svg-icon>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'
import {useIcon} from '@/hooks/useIcon'

enum SizeMap {
  'x-small' = 12,
  'small' = 16,
  'default' = 24,
  'medium' = 28,
  'large' = 36,
  'x-large' = 40
}

withDefaults(
  defineProps<{
    type: string
    size?: 'x-small' | 'small' | 'default' | 'medium' | 'large' | 'x-large'
    realSize?: number
    color?: string
    viewbox?: string
    flip?: 'horizontal' | 'vertical' | 'both' | 'none'
    rotate?: number
  }>(),
  {
    size: 'default',
    viewbox: '0 0 24 24',
    rotate: 0
  }
)
</script>

<style lang="sass" scoped></style>
