<template>
  <td class="pl-4 pr-3">
    <div class="flex select-none items-center">
      <Image
        v-if="icon"
        class="h-9 w-9 flex-none bg-cover bg-center"
        :src="icon"
        scale="cover"
      >
      </Image>
      <div class="h-9 w-2"></div>
      <div class="overflow-hidden">
        <div class="truncate text-lg">
          <span>{{ title }}</span>
          <icon
            class="ml-1 text-neutral-500 dark:text-neutral-400"
            :icon="mdiPackage"
            size="x-small"
            v-show="builtin"
          ></icon>
        </div>
        <div
          class="truncate text-sm"
          :class="`${enabled ? 'text-gray-500 dark:text-gray-400' : ''}`"
          :title="subtitle"
        >
          {{ subtitle }}
        </div>
      </div>
    </div>
  </td>
  <td class="truncate pr-5">
    <span :title="url">{{ url }}</span>
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
  <td class="truncate pr-2">
    <span>{{ keyword }}</span>
  </td>
  <td>
    <Checkbox
      :model-value="enabled"
      @click.stop="emit('enabled-change', !enabled)"
    ></Checkbox>
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

const emit = defineEmits(['enabled-change'])
</script>

<style lang="sass" scoped></style>
