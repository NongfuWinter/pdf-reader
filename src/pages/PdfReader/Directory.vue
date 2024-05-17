<script setup lang="ts">
import { Tree, Communication } from '@/components/TreeDirectory/ExposeStruct'
import TreeView from '@/components/TreeDirectory/TreeView.vue';
import { ref, provide } from 'vue'

let treeCommuni = new Communication()
provide('treeCommuni', treeCommuni)

let root = new Tree('root')
let a = new Tree('a')
a.pushleaf(new Tree('a leaf 1'))
a.pushleaf(new Tree('a leaf 2'))
a.pushleaf(new Tree('a leaf 3'))
let b = new Tree('b')
b.pushleaf(new Tree('b leaf 1'))
b.leaves?.pushleaf(new Tree('b leaf\'s leaf'))
b.pushleaf(new Tree('b leaf 2'))

let c = new Tree('c')
let d = new Tree('d')

root.pushleaf(a)
root.pushleaf(b)
root.pushleaf(c)
root.pushleaf(d)

function test(){
  
}
</script>

<template>
  <div class="base">
    <div class="root-operation">
      <div class="operation">
        <i class="bi bi-chevron-bar-expand" style="color: #44b;"></i>
      </div>
      <div class="operation">
        <i class="bi bi-plus-square" style="color: #4b0;" ></i>
      </div>
      <div class="operation">
        <i class="bi bi-chevron-bar-contract" style="color: #a0a;"></i>
      </div>
    </div>

    <div class="leaves">
      <template v-for="leaf in root">
        <TreeView v-if="leaf != null" :tree="leaf"></TreeView>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">

.base {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  // padding: 1rem;
  // position: relative;
}

.root-operation{
  display: flex;
  justify-content: end;
  padding: .6rem .8rem;
  border-bottom: 1px solid #ccc;

  .operation{
    margin-left: 2rem;
    i{
      font-size: 1.1rem;
    }
  }
  
  .operation:last-child{
    margin-right: 1rem;
  }
}

.leaves{
  padding: 1rem;
}

</style>