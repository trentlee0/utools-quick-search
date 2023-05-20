<template>
  <div class="flex items-center pt-1">
    <Btn
      type="circle"
      class="text-gray-700 dark:text-gray-100"
      @click="router.replace('/')"
    >
      <Icon :icon="mdiClose"></Icon>
    </Btn>
    <div class="ml-5 text-lg font-bold">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/common/Btn.vue'
import Icon from '@/components/common/Icon.vue'
import { mdiClose } from '@mdi/js'
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps<{ title: string }>()
</script>

<style lang="sass" scoped></style>
