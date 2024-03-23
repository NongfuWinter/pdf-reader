<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from './Tree'
const props = defineProps({
  tree: {
    type: Tree,
    default: new Tree(),
    require: true
  } 
})

let isLeavesOpen = ref(false)

function t(event: any){
  isLeavesOpen.value = !isLeavesOpen.value
  
}
</script>

<template>
  <div class="root">
    <div class="content" @click="t($event)">
      <p>{{ props.tree.content }}</p>
      <i class="bi bi-chevron-right"></i>
    </div>
    <div class="leaves" :class="{open: isLeavesOpen}" v-for="leaf in props.tree">
      <TreeView v-if="leaf!=null" :tree="leaf"></TreeView>
    </div>
  </div>
</template>

<style scoped lang="less">
.root {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
}

.content {
  display: flex;
  padding: 0.6rem 1rem;

  // background-color: #fff;
  p {
    margin: 0 2rem 0 0;
  }

  i {
    // width: 4rem;
    // height: 2rem;
  }
}

.leaves {
  display: grid;
  grid-template-rows: 0fr;
  margin-left: 2rem;
  overflow-y: hidden;
  transition: .2s;

  &>*{
    min-height: 0;
  }
}

.open{
  grid-template-rows: 1fr;
}
</style>