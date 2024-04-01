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

</script>

<template>
  <div class="base">
    <div class="main">
      <template v-for="leaf in root">
        <TreeView v-if="leaf != null" :tree="leaf"></TreeView>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.base {
  // border: #555 solid 1px;
  // padding: 0.1rem 0.5rem;
}

.main{
  padding: 1rem;
}

.nav{
  display: flex;
  border-bottom: #aaa solid 1px;

  li{
    padding: 0.7rem 2rem;
    // flex-grow: 1;

    &:first-child{
      padding-left: 1rem;
      padding-right: 1rem;
    }    
  }

  .active {
      color: #4a8; 
    }
}

.flutter{
  position: absolute;
  background-color: #ccc;
  pointer-events: auto;
}
</style>