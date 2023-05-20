<template>
  <td class="cursor-pointer pl-4 pr-3" @click="handleRowClick">
    <div class="flex select-none items-center">
      <Image
        v-if="props.icon"
        class="h-9 w-9 flex-none bg-cover bg-center"
        :class="disabledClass"
        :src="props.icon"
        scale="cover"
        @click="handleRowClick"
      >
      </Image>
      <div class="h-9 w-2" @click="handleRowClick"></div>
      <div class="cursor-pointer overflow-hidden" @click="handleRowClick">
        <div class="truncate text-lg" :class="disabledClass">
          <span>{{ props.title }}</span>
          <icon
            class="ml-1 text-neutral-500 dark:text-neutral-400"
            :icon="mdiPackage"
            size="x-small"
            v-show="builtin"
          ></icon>
        </div>
        <div
          class="truncate text-sm text-gray-500 dark:text-gray-400"
          :class="disabledClass"
          :title="props.subtitle"
        >
          {{ props.subtitle }}
        </div>
      </div>
    </div>
  </td>
  <td class="truncate pr-5" :class="disabledClass">
    <span :title="props.url">{{ props.url }}</span>
  </td>
  <td class="pr-2">
    <div
      v-show="!!categoryName"
      :title="categoryName"
      class="max-w-fit truncate rounded-lg p-1 text-sm text-white opacity-80"
      :class="`${mapColor(categoryName)}`"
    >
      {{ categoryName }}
    </div>
  </td>
  <td class="truncate pr-2" :class="disabledClass">
    <span>{{ props?.keyword }}</span>
  </td>
  <td>
    <Checkbox v-model="props.enabled" @click="handleCheckEvent"></Checkbox>
  </td>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import Image from '@/components/common/Image.vue'
import Checkbox from '@/components/common/Checkbox.vue'
import { computed } from 'vue'
import { useCategoryStore } from '@/store'
import { mdiPackage } from '@mdi/js'

const COLORS = [
  'bg-lime-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-violet-500'
]

function mapColor(s: string) {
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
    builtin?: boolean
  }>(),
  {
    enabled: true,
    builtin: false
  }
)

const categoryStore = useCategoryStore()
const categoryName = computed(
  () => categoryStore.getCategory(props.categoryId)?.text
)

const disabledClass = computed(() => (!props.enabled ? 'row-checked' : ''))

const emit = defineEmits(['enabled-change', 'row-click'])

function handleCheckEvent() {
  emit('enabled-change', !props.enabled)
}

function handleRowClick() {
  emit('row-click')
}
</script>

<style lang="sass" scoped>
.row-checked
  @apply text-gray-300 dark:text-gray-500 line-through
</style>
