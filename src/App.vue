<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts"></script>

<style lang="sass">
body
  @apply w-screen h-screen overflow-x-hidden overflow-y-auto dark:text-gray-100 dark:bg-utools-black
</style>
