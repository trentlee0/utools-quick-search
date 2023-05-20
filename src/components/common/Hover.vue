<template>
  <div class="mask transition duration-200">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
.mask
  filter: opacity(0.88)

.mask:hover
  filter: opacity(1)
</style>
