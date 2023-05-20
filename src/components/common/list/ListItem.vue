<template>
  <div class="item select-none">
    <div class="item-icon" v-if="icon">
      <div
        class="item-icon"
        :style="{ 'background-image': `url(${icon})` }"
      ></div>
    </div>
    <div class="item-content">
      <div class="flex-grow overflow-hidden">
        <div class="truncate">{{ title }}</div>
        <div class="truncate text-sm text-gray-400">
          <div class="h-5">{{ subtitle }}</div>
        </div>
      </div>
      <div class="flex-none">
        <slot name="action"></slot>
      </div>
      <div class="w-8 flex-none"></div>
      <div class="flex-none text-gray-400">
        {{ keyword }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
  keyword?: string
}>()
</script>

<style lang="sass" scoped>
.item
  @apply flex h-12 my-2 px-5 items-center

.item-icon
  @apply flex-none w-12 h-12 mr-2 bg-cover bg-no-repeat bg-center

.item-content
  @apply flex-grow flex items-center overflow-hidden
</style>
