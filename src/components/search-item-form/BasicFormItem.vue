<template>
  <div class="col-span-2"></div>
  <div :class="`col-span-2 ${AlignMap[align]}`">
    {{ label }} <span v-show="!!help" :title="help" class="text-xs cursor-default">?</span>
  </div>
  <div class="col-span-5">
    <slot></slot>
  </div>
  <div class="col-span-3">
    <div class="text-red-500 text-xs" v-if="verify?.msg" v-show="verify.show">
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
    align?: 'right' | 'left' | 'center'
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
