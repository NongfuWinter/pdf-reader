<script setup lang="ts">
import Test1 from './Test1.vue'
</script>

<template>
  <Suspense>
    <Test1 :pageNumber="10"></Test1>
  </Suspense>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
