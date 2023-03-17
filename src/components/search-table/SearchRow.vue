<template>
  <td class="pl-4 pr-3">
    <div class="flex items-center select-none">
      <Image
        v-if="props.icon"
        class="w-9 h-9 bg-cover bg-center flex-none cursor-pointer"
        :class="disabledClass"
        :src="props.icon"
        scale="cover"
        @click="handleRowClick"
      >
      </Image>
      <div class="w-2 h-9 cursor-pointer" @click="handleRowClick"></div>
      <div class="overflow-hidden cursor-pointer" @click="handleRowClick">
        <div class="truncate text-lg" :class="disabledClass">
          {{ props.title }}
        </div>
        <div
          class="text-sm text-gray-500 dark:text-gray-400 truncate"
          :class="disabledClass"
          :title="props.subtitle"
        >
          {{ props.subtitle }}
        </div>
      </div>
    </div>
  </td>
  <td class="pr-5 truncate" :class="disabledClass">
    <span :title="props.url">{{ props.url }}</span>
  </td>
  <td class="pr-2">
    <div
      v-show="!!categoryName"
      :title="categoryName"
      class="text-sm p-1 max-w-fit truncate text-white rounded-lg opacity-80"
      :class="`${mapColor(categoryName)}`"
    >
      {{ categoryName }}
    </div>
  </td>
  <td class="pr-2 truncate" :class="disabledClass">
    <span>{{ props?.keyword }}</span>
  </td>
  <td>
    <Checkbox :value="props.enabled" @click="handleCheckEvent"></Checkbox>
  </td>
</template>

<script setup lang="ts">
import Image from '@/components/common/Image.vue'
import Checkbox from '@/components/common/Checkbox.vue'
import {computed} from 'vue'
import {useCategoryStore} from '@/store'

const COLORS = [
  'bg-lime-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-violet-500'
]

const mapColor = (s: string) => {
  let t = 0
  for (let i = 0; i < s.length; i++) {
    t ^= s.charCodeAt(i)
  }
  t ^= t >>> 9
  return COLORS[t % COLORS.length]
}

const props = withDefaults(
  defineProps<{
    icon?: string
    title: string
    subtitle: string
    url: string
    keyword?: string
    enabled?: boolean
    categoryId: string
  }>(),
  {
    enabled: true
  }
)

const categoryStore = useCategoryStore()
const categoryName = computed(
  () => categoryStore.getCategory(props.categoryId)?.text
)

const disabledClass = computed(() => (!props.enabled ? 'row-checked' : ''))

const emits = defineEmits(['enabled-change', 'row-click'])
const handleCheckEvent = () => {
  emits('enabled-change', !props.enabled)
}
const handleRowClick = () => {
  emits('row-click')
}
</script>

<style lang="sass" scoped>
.row-checked
  @apply text-gray-300 dark:text-gray-500 line-through
</style>
