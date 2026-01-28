<template>
  <svg-icon
    ref="svgIconRef"
    class="inline"
    :path="icon"
    :size="realSize ? realSize : SizeMap[size]"
    :viewbox="viewbox"
    :flip="flip"
    :rotate="rotate"
    :style="{ color: color ?? '' }"
  ></svg-icon>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'
import { onMounted, ref, watch } from 'vue'

enum SizeMap {
  'x-small' = 12,
  'small' = 16,
  'default' = 24,
  'medium' = 28,
  'large' = 36,
  'x-large' = 40
}

const props = withDefaults(
  defineProps<{
    icon: string
    size?: keyof typeof SizeMap
    realSize?: number
    color?: string
    viewbox?: string
    flip?: 'horizontal' | 'vertical' | 'both' | 'none'
    rotate?: number
    loading?: boolean
  }>(),
  {
    size: 'default',
    viewbox: '0 0 24 24',
    rotate: 0
  }
)

const svgIconRef = ref<InstanceType<typeof SvgIcon> | null>(null)
const animationRef = ref<Animation | null>(null)

onMounted(() => {
  if (props.loading === undefined) return

  animationRef.value = (svgIconRef.value?.$el as HTMLOrSVGImageElement).animate(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
    {
      duration: 1500,
      iterations: Infinity
    }
  )
  animationRef.value.cancel()
})

watch(
  () => props.loading,
  (loading) => {
    if (loading) {
      animationRef.value?.play()
    } else {
      animationRef.value?.cancel()
    }
  }
)
</script>

<style lang="sass" scoped></style>
