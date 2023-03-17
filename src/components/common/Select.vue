<template>
  <select
    class="outline-none bg-transparent rounded-md px-1 py-1 border border-gray-300 dark:border-stone-600"
    :value="value"
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
interface ItemProp {
  id: string
  text: string
}

const props = defineProps<{
  value: string
  items: Array<ItemProp>
}>()

const map = new Map<string, ItemProp>()
props.items.forEach((item) => {
  map.set(item.id, item)
})

const emits = defineEmits(['update:value', 'input'])
const handleInputEvent = (e: any) => {
  const id = e.target.value as string
  emits('update:value', id)
  emits('input', map.get(id))
}
</script>

<style lang="sass" scoped></style>
