<script setup lang="ts">
import { ref } from 'vue'
import { Tree, STATE } from './TreeStruct'
const props = defineProps({
  state: {
    type: String as ()=>STATE,
    default: STATE.CHECK,
    require: true,
  },
  tree: {
    type: Tree,
    default: new Tree(),
    require: true,
  },
})

let isLeavesOpen = ref(false)

function t(event: any) {
  isLeavesOpen.value = !isLeavesOpen.value

}

function drag(event: any){
  event.target.classList.add("dragging");
}
</script>

<template>
  <div class="root" draggable="true" @drag="drag($event)">
    <div class="content" @click="t($event)">
      <div class="title">
        <p>{{ props.tree.content }}</p>
        <i class="bi bi-chevron-right" v-if="props.tree.leaves != null"></i>
      </div>

      <div class="operation" v-if="props.state == STATE.EDIT">
        <i class="bi bi-pencil-square" style="color: #25d;"></i>
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

.root:hover{
  cursor: grab;
}

.dragging{
  opacity: 1;
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
    &>i{
      margin-right: 1rem;
    }
    i:last-child{
      margin-right: 0;
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