<template>
  <div class="col-span-2"></div>
  <div :class="`col-span-2 ${AlignMap[align]}`">
    {{ label }}
    <span v-show="!!help" :title="help" class="cursor-default text-xs">?</span>
  </div>
  <div class="col-span-5">
    <slot></slot>
  </div>
  <div class="col-span-3">
    <div class="text-xs text-red-500" v-if="verify?.msg" v-show="verify.show">
      {{ verify.msg }}
    </div>
  </div>
</template>

<script setup lang="ts">
enum AlignMap {
  right = 'text-right',
  left = 'text-left',
  center = 'text-center'
}

withDefaults(
  defineProps<{
    label?: string
    align?: keyof typeof AlignMap
    verify?: {
      msg: string
      show: boolean
    }
    help?: string
  }>(),
  {
    align: 'right'
  }
)
</script>

<style lang="sass" scoped></style>
