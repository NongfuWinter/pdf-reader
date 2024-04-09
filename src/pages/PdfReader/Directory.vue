<script setup lang="ts">
import { Tree, Communication } from '@/components/TreeDirectory/Struct'
import TreeView from '@/components/TreeDirectory/TreeView.vue';
import { ref, provide } from 'vue'

let treeCommuni = new Communication()
provide('treeCommuni', treeCommuni)

let root = new Tree('root')
let a = new Tree('a')
a.leaves = new Tree('a leaf 1')
a.leaves.next = new Tree('a leaf 2')
a.leaves.next.next = new Tree('a leaf 3')
let b = new Tree('b')
b.leaves = new Tree('b leaf')
b.leaves.leaves = new Tree('b leaf\'s leaf')
root.leaves = a
a.next = b
let c = new Tree('c')
b.next = c
let d = new Tree('d')
c.next = d

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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding: 1rem;
  // position: relative;
}
</style>