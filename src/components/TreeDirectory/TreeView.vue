<script setup lang="ts">
import { ref, inject, onMounted, nextTick } from 'vue'
import { Tree, Communication } from './Struct'
const props = defineProps({
  tree: {
    type: Tree,
    default: new Tree(),
    require: true,
  },
})

let treeCommuni = inject('treeCommuni') as Communication

let selfView = ref<HTMLElement | null>(null)
let isLeavesOpen = ref(false)
let isBeChoosed = ref(false)
let isDraging = ref(false)

function titleContextmenu(event: any){
  isBeChoosed.value = true
  treeCommuni.setChooseId(props.tree.id, ()=>{isBeChoosed.value=false})
}

function drag(event: any){
  let target = event.currentTarget
  const diff = event.clientY - selfView.value!.offsetTop
  selfView.value!.style.height = selfView.value!.clientHeight+'px'
  nextTick(()=>{
    selfView.value!.classList.add('flutter')
    selfView.value!.style.height = '0.5rem'
  })
  

  // window.addEventListener('mousemove', (e)=>{
  //   selfView.value!.style.top = e.clientY - diff +'px'
  //   selfView.value!.style.left = '5rem'
  // })
}

onMounted(()=>{
})
</script>

<template>
  <div class="root" ref="selfView" :class="{'root-choosed':isBeChoosed}">
    <div class="title" 
    :class="{'title-choosed':isBeChoosed}" 
    >
      <div class="content"
      @click="isLeavesOpen = !isLeavesOpen"
      @contextmenu.prevent="titleContextmenu($event)"
      >
        <p>{{ props.tree.content }}</p>
        <i class="bi bi-chevron-right" :class="{'i-tramsition': isLeavesOpen}"
        v-if="props.tree.leaves != null"></i>
      </div>

      <div class="operation" v-if="isBeChoosed">
        <i class="bi bi-grip-horizontal" style="color: #333;"
        @click="drag($event)"></i>
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
  transition: all 1s;
}

.root-choosed {
  background-color: #ddd;
}

.dragging {
  opacity: 1;
}

.title {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  
  .content{
    display: flex;
    flex-grow: 1;
    align-items: center;
    padding: 0.6rem 1rem;
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
    padding: 0.6rem 1rem;
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

.flutter{
  // position: absolute;

  height: 0px;
  

  background-color: #999;
  pointer-events: auto;
}
</style>