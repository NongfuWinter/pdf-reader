<script setup lang="ts">
import PdfView from './PdfView.vue';
</script>

<template>
  <Suspense>
    <PdfView :pageNumber="10"></PdfView>
  </Suspense>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
./pdfView.vue./PdfView.vue