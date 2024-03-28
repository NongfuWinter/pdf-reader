<script setup lang="ts">
import { Tree, STATE } from './TreeStruct'
import TreeView from './TreeView.vue';
import { ref } from 'vue'

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

let state = ref(STATE.CHECK)

function drag(event: any){
  console.log(event.clientX, event); 
}
</script>

<template>
  <div class="base">
    <ul class="nav">
      <li>
        <i class="bi bi-chevron-right"></i>
        <i class="bi bi-chevron-right"></i>
      </li>
      <li :class="{'active': state==STATE.CHECK}" @click="state=STATE.CHECK">
        查看
      </li>
      <li :class="{'active': state==STATE.EDIT}" @click="state=STATE.EDIT">
        编辑
      </li>
    </ul>
    <div class="main">
      <template v-for="leaf in root">
        <TreeView v-if="leaf != null" :tree="leaf" :state="state" @click="drag($event)"></TreeView>
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
</style>./TreeStruct