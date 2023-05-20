<template>
  <div class="list">
    <ListItem
      v-for="item in data"
      :icon="item.icon"
      :title="item.title"
      :subtitle="item.subtitle"
      :keyword="item.keyword"
    >
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import ListItem from './ListItem.vue'

interface ListItem {
  title: string
  subtitle?: string
  icon?: string
  keyword?: string
}

withDefaults(
  defineProps<{
    data: Array<ListItem>
    loading?: boolean
  }>(),
  {
    loading: false
  }
)
</script>

<style lang="sass" scoped></style>
