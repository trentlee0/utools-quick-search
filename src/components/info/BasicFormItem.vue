<template>
  <div class="col-span-2"></div>
  <div class="col-span-2 cursor-default" :class="`${AlignMap[align]}`">
    <span class="" :title="title">{{ label }}</span>
    <span v-if="help" :title="help" class="text-xs">?</span>
    <span v-if="required" class="ml-px text-sm text-red-500">*</span>
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
    required?: boolean
    help?: string
    title?: string
  }>(),
  {
    align: 'right'
  }
)
</script>

<style lang="sass" scoped></style>
