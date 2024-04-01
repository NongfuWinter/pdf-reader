<script setup lang="ts">
import { ref, inject } from 'vue'
import { Tree, Communication } from './Struct'
const props = defineProps({
  tree: {
    type: Tree,
    default: new Tree(),
    require: true,
  },
})

let treeCommuni = inject('treeCommuni') as Communication

let titleView = ref<HTMLElement | null>(null)
let isLeavesOpen = ref(false)
let isBeChoosed = ref(false)

function t(event: any) {
  isLeavesOpen.value = !isLeavesOpen.value

}

function titleContextmenu(event: any){
  isBeChoosed.value = true
  treeCommuni.setChooseId(props.tree.id, ()=>{isBeChoosed.value=false})
}

function drag(event: any){
  let target = event.currentTarget
  target.classList.add('flutter')
  window.addEventListener('mousemove', (e)=>{
    target.style.left = e.clientX+'px'
    target.style.top = e.clientY+'px'
    
  })
}
</script>

<template>
  <div class="root" :class="{'root-choosed':isBeChoosed}">
    <div class="title" ref="titleView"
    :class="{'title-choosed':isBeChoosed}" 
    @click="isLeavesOpen = !isLeavesOpen"
    @contextmenu.prevent="titleContextmenu($event)"
    >
      <div class="content">
        <p>{{ props.tree.content }}</p>
        <i class="bi bi-chevron-right" 
        :class="{'i-tramsition': isLeavesOpen}"
        v-if="props.tree.leaves != null"></i>
      </div>

      <div class="operation" v-if="isBeChoosed">
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
  // background-color: red;
}

.root-choosed{
  background-color: #ddd;
}

.dragging{
  opacity: 1;
}

.title {
  display: flex;
  flex-shrink: 0;
  padding: 0.6rem 1rem;
  justify-content: space-between;
  align-items: center;

  .content{
    display: flex;
    align-items: center;
    p {
      vertical-align: middle;
      margin: 0 1.5rem 0 0;
    }
    i{
      transition: all .5s;
    }
    .i-tramsition{
      transform: rotateZ(90deg);
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

.title-choosed{
  // background-color: #333;
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