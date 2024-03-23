<script setup lang="ts">
import { Tree } from './Tree'
import TreeView from './TreeView.vue';

let root = new Tree('root')
let a = new Tree('a')
a.leaves = new Tree('a leaf 1')
a.leaves.next = new Tree('a leaf 2')
let b = new Tree('b')
b.leaves = new Tree('b leaf')
b.leaves.leaves = new Tree('b leaf\'s leaf')
root.leaves = a
a.next = b
</script>

<template>
  <div class="base">
    <template v-for="leaf in root">
      <TreeView v-if="leaf != null" :tree="leaf"></TreeView>
    </template>
  </div>
</template>

<style scoped lang="less">
.base {
  border: #555 solid 5px;
  padding: 0.1rem 0.5rem;
}
</style>