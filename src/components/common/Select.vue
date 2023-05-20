<template>
  <select
    class="rounded-md border border-gray-300 bg-transparent px-1 py-1 outline-none dark:border-stone-600"
    :value="modelValue"
    @input="handleInputEvent"
  >
    <option
      v-for="(item, index) in items"
      :key="`${item.text}-${index}`"
      :value="item.id"
    >
      {{ item.text }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { toMap } from '@/utils/collections'

interface ItemProp {
  id: string
  text: string
}

const props = defineProps<{
  modelValue: string
  items: Array<ItemProp>
}>()

const map = toMap(props.items, (item) => item.id)

const emit = defineEmits(['update:modelValue', 'input'])
function handleInputEvent(e: Event) {
  const id = (e.target as HTMLInputElement).value
  emit('update:modelValue', id)
  emit('input', map.get(id))
}
</script>

<style lang="sass" scoped></style>
