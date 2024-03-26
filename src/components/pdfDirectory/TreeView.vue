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

function t(event: any) {
  isLeavesOpen.value = !isLeavesOpen.value

}
</script>

<template>
  <div class="root">
    <div class="content" @click="t($event)">
      <div class="title">
        <p>{{ props.tree.content }}</p>
        <i class="bi bi-chevron-right"></i>
      </div>

      <div class="operation">
        <i class="bi bi-plus-square" style="color: #2a0;"></i>
        <i class="bi bi-x-square" style="color: #d20;"></i>
      </div>
    </div>
    <div class="leaves" :class="{ open: isLeavesOpen }">
      <div>
        <template  v-for="leaf in props.tree">
          <TreeView v-if="leaf != null" :tree="leaf"></TreeView>
        </template>
      </div>
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
  flex-shrink: 0;
  padding: 0.6rem 1rem;
  justify-content: space-between;
  align-items: center;

  .title {
    display: flex;
    align-items: center;
    p {
      vertical-align: middle;
      margin: 0 1rem 0 0;
    }
  }

  .operation {
    &>*{
      margin-right: 2rem;
    }
  }
}

.leaves {
  display: grid;
  grid-template-rows: 0fr;
  margin-left: 2rem;
  overflow: hidden;
  transition: .3s;

  &>div {
    min-height: 0;
  }
}


.open {
  grid-template-rows: 1fr;
}
</style>