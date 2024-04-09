<script setup lang="ts">
import { ref, inject, onMounted, nextTick, h } from 'vue'
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
let scapegoatView = ref<HTMLElement | null>(null)
let leavesView = ref<HTMLElement | null>(null)
let isLeavesOpen = ref(false)
let isBeChoosed = ref(false)
let isDraging = ref(false)

let dragDiffX = 0
let dragDiffY = 0

let height = ref('auto')

function titleContextmenu(event: any){
  isBeChoosed.value = true
  treeCommuni.setChooseId(props.tree.id, ()=>{isBeChoosed.value=false})
}

function dragOver(event: any){
  console.log('draging!');
  scapegoatView.value!.style.top = event.clientY + dragDiffY +'px'
  scapegoatView.value!.style.left = event.clientX + dragDiffX +'px'
}

function dragStart(event: any){
  console.log('strat')

  selfView.value!.style.visibility = 'hidden'
  dragDiffX = selfView.value!.getBoundingClientRect().left - event.clientX
  dragDiffY = selfView.value!.getBoundingClientRect().top - event.clientY
  
  isDraging.value = true
  nextTick(()=>{
    scapegoatView.value!.style.height = selfView.value!.clientHeight+'px'
    scapegoatView.value!.style.width = selfView.value!.clientWidth+'px'
    scapegoatView.value!.style.visibility = 'visible'
    scapegoatView.value!.style.top = selfView.value!.getBoundingClientRect().top +'px'
    scapegoatView.value!.style.left = selfView.value!.getBoundingClientRect().left +'px'

  })
  
  document.addEventListener('dragover', dragOver)
}

function dragEnd(event: any){
  console.log('is end!', scapegoatView.value!.style.top);
  document.removeEventListener('dragover', dragOver)
  let fin = scapegoatView.value!.animate(
    {
      left: [scapegoatView.value!.style.left, selfView.value!.getBoundingClientRect().left+'px'],
      top: [scapegoatView.value!.style.top, selfView.value!.getBoundingClientRect().top+'px'],
    },
    {
      duration: 1500,
      easing:"ease-in-out",
    }
  )

  fin.onfinish = ()=>{
    scapegoatView.value!.style.left = selfView.value!.getBoundingClientRect().left+'px'
    scapegoatView.value!.style.top = selfView.value!.getBoundingClientRect().top+'px'
    isDraging.value = false
    selfView.value!.style.visibility = 'visible'
  }
  
}



function contentClick(){
  isLeavesOpen.value = !isLeavesOpen.value

}

onMounted(()=>{
  
})
</script>

<template>
  <div class="root" ref="selfView" :class="{'root-choosed':isBeChoosed}" 
  :style="{ 'heighti': height}" draggable="true" @dragstart="dragStart($event)" @dragend="dragEnd($event)">
    <div class="title" 
    :class="{'title-choosed':isBeChoosed}" 
    >
      <div class="content"
      @click="contentClick()"
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
    <div class="leaves" ref="leavesView" :class="{ open: isLeavesOpen }">
      <div>
        <template  v-for="leaf in props.tree">
          <TreeView v-if="leaf != null" :tree="leaf"></TreeView>
        </template>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="isDraging" ref="scapegoatView" class="root a" :class="{'root-choosed':isBeChoosed}">
    <div class="title title-choosed">
      <div class="content">
        <p>{{ props.tree.content }}</p>
        <i v-if="props.tree.leaves != null" class="bi bi-chevron-right" :class="{'i-tramsition': isLeavesOpen}"
        ></i>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<style scoped lang="less">
.a{
  position: fixed;
  visibility: hidden;
  background-color: #ddd;
}

.root {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  overflow: hidden;
  // transition: all 3s;
  
}
.root:hover{
  background-color: #cfc;
}

.root-choosed {
  background-color: #ddd;
  height: auto;
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
      transition: transform .5s;
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
  // pointer-events: none;
}
</style>