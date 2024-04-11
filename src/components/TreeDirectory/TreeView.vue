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

enum OPERATION_MENU{
  MAIN = 'main',
  DRAG = 'drag',
  ADD = 'add',
}

let treeCommuni = inject('treeCommuni') as Communication

let selfView = ref<HTMLElement | null>(null)
let titleView = ref<HTMLElement | null>(null)
let scapegoatView = ref<HTMLElement | null>(null)
let leavesView = ref<HTMLElement | null>(null)

let isLeavesOpen = ref(false)
let isBeChoosed = ref(false)
let isDraging = ref(false)
let isHover = ref(false)
let isHoverLeaf = ref(false)
let isDragEnter = ref(false)

let dragEnterNumber = 0 
let dragDiffX = 0
let dragDiffY = 0

let operationMenu = ref(OPERATION_MENU.MAIN)

function titleContextmenu(event: any){
  if(isBeChoosed.value){
    isBeChoosed.value = false
  }else{
    isBeChoosed.value = true
    treeCommuni.setChooseId(props.tree.id, ()=>{isBeChoosed.value=false})
  }
}

function dragOver(event: any){
  console.log('draging!');
  scapegoatView.value!.style.top = event.clientY + dragDiffY +'px'
  scapegoatView.value!.style.left = event.clientX +'px'
}

function dragStart(event: any){
  console.log('strat')

  isLeavesOpen.value = false

  selfView.value!.style.visibility = 'hidden'
  dragDiffX = selfView.value!.getBoundingClientRect().left - event.clientX
  dragDiffY = selfView.value!.getBoundingClientRect().top - event.clientY
  
  isDraging.value = true
  nextTick(()=>{
    scapegoatView.value!.style.height = titleView.value!.clientHeight+'px'
    scapegoatView.value!.style.width = selfView.value!.clientWidth+dragDiffX+'px'
    scapegoatView.value!.style.visibility = 'visible'
    scapegoatView.value!.style.top = selfView.value!.getBoundingClientRect().top +'px'
    scapegoatView.value!.style.left = selfView.value!.getBoundingClientRect().left-dragDiffX +'px'
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
      duration: 500,
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

function dragEnter(event: any){
  isDragEnter.value = true
  operationMenu.value = OPERATION_MENU.DRAG
  
  console.log('enter: ', props.tree.content, event.target);
  dragEnterNumber++

}

function dragLeave(event: any){
  console.log('leave: ', props.tree.content, event.target);
  dragEnterNumber--
  if(dragEnterNumber == 0){
    isDragEnter.value = false
  }
}

function mouseOver(event: MouseEvent){
  console.log('mouseOver', props.tree.content, event.currentTarget, event);
  if(isDraging.value){
    return
  }
  
  if(event.target instanceof Node && leavesView?.value?.contains(event.target)){
    isHoverLeaf.value = true
  }else{
    isHoverLeaf.value = false
  }
  isHover.value = true
}

function mouseleave(event: any){
  isHover.value = false
  isHoverLeaf.value = false
}

function contentClick(){
  if(props.tree.leaves){
    isLeavesOpen.value = !isLeavesOpen.value
  }

}

onMounted(()=>{
  
})
</script>

<template>
  <div class="root" ref="selfView" 
  :class="{'root-choosed': isBeChoosed || isDragEnter, 'root-hover-bgc': isHover,
  'root-hover-boeder': isHover && !isHoverLeaf}" 
  @dragenter.stop="dragEnter($event)" @dragleave.stop="dragLeave($event)" 
  @mouseover="mouseOver($event)" @mouseout="mouseleave($event)">
    <div class="title" ref="titleView" :class="{'title-choosed':isBeChoosed}">
      <div class="content"
      @click="contentClick()"
      @contextmenu.prevent="titleContextmenu($event)"
      >
        <p>{{ props.tree.content }}</p>
        <i v-if="props.tree.leaves != null" 
        class="bi bi-chevron-right" :class="{'i-transform': isLeavesOpen}"></i>
      </div>
<Transition name="slide-fade">
      <div class="operation" v-if="isBeChoosed || isDragEnter">
        
          <template v-if="operationMenu==OPERATION_MENU.MAIN">
            <div draggable="true" @dragstart="dragStart($event)" @dragend="dragEnd($event)">
              <i class="bi bi-grip-horizontal" style="color: #333;"></i>
            </div>
            <div>
              <i class="bi bi-pencil-square" style="color: #25d;" ></i>
            </div>
            <div>
              <i class="bi bi-plus-square" style="color: #2a0;" @click="operationMenu = OPERATION_MENU.ADD"></i>
            </div>
            <div>
              <i class="bi bi-x-square" style="color: #d20;" @click="operationMenu = OPERATION_MENU.DRAG"></i>
            </div>
          </template>
          <template v-else-if="operationMenu==OPERATION_MENU.DRAG">
            <div>
              <i class="bi bi-indent" style="transform: rotateZ(-90deg);color: #25d;"></i>
            </div>
            <div>
              <i class="bi bi-fullscreen"></i>
            </div>
            <div>
              <i class="bi bi-indent" style="transform: rotateZ(90deg);color: #25d;"></i>
            </div>
            <div>
              <i class="bi bi-reply" @click="operationMenu = OPERATION_MENU.MAIN"></i>
            </div>
          </template>

          <template v-else-if="operationMenu==OPERATION_MENU.ADD">
            <div>
              <i class="bi bi-indent"></i>
            </div>
            <div>
              <i class="bi bi-reply " @click="operationMenu = OPERATION_MENU.MAIN"></i>
            </div>
          </template>
        
        

        
      </div></Transition>

    </div>
    <div class="leaves" ref="leavesView" :class="{ 'leaves-open': isLeavesOpen }">
      <div>
        <template  v-for="leaf in props.tree">
          <TreeView v-if="leaf != null" :tree="leaf"></TreeView>
        </template>
      </div>
    </div>
    <div class="line" :class="{'line-open': isLeavesOpen, 'line-choosed': isBeChoosed}">
      <div></div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="isDraging" ref="scapegoatView" class="a">
    <div class="title title-choosed">
      <div class="content">
        <p>{{ props.tree.content }}</p>
        <i v-if="props.tree.leaves != null" class="bi bi-chevron-right" 
        :class="{'i-tramsition': isLeavesOpen}"
        ></i>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<style scoped lang="less">
.slide-fade-enter-active {
  transition: all .3s ease-in;
}

.slide-fade-leave-active {
  transition: all .3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(200px);
  opacity: 0;
}

@line-width: 2px;

.root, .a {
  border-radius: 1rem;
  overflow: hidden;
  transition-property: background-color, border ;
  transition-duration: .2s, .5s;
  border: rgba(0, 0, 0, 0) solid 2px;
}

.a{
  position: fixed;
  visibility: hidden;
  background-color: rgba(221,221,221, 0.8);
  border: #ccc solid 2px;
  padding-left: @line-width;
  pointer-events: none;
}

.root{
  display: grid;
  grid-template: 
    "line title"
    "line leaves"
    /2px auto;
}

.root-hover-bgc{
  // background-color: #cec;
  // border-left: #aca solid 2px;
}

.root-hover-boeder{
  background-color: #cec;
  // border-bottom: #aca solid 2px;
}

.root-choosed {
  background-color: #eee;
  
  border: #ddd solid 2px;
}

.dragging {
  opacity: 1;
}

.title {
  grid-area: title;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  
  .content{
    display: flex;
    flex-grow: 1;
    align-items: center;
    padding: .6rem 1rem;
    p {
      vertical-align: middle;
      margin: 0 1.5rem 0 0;
      user-select: none;
    }
    i{
      transition: transform .5s;
    }
    .i-transform{
      transform: rotateZ(90deg);
    }
  }

  .operation {
    display: flex;
    align-self: stretch;
    padding: auto 1rem;

    div{
      display: flex;
      margin-right: 1.4rem;
      align-items: center;
    }
    & i{
      font-size: 1.1rem;
    }
    & i:last-child{
      margin-right: 0;
    }
  }
}

.title-choosed{
  // background-color: #333;
}

.leaves {
  grid-area: leaves;

  display: grid;
  grid-template-rows: 0fr;
  margin-left: 1.5rem;
  overflow: hidden;
  transition: .3s;

  &>div {
    min-height: 0;
  }
}

.leaves-open {
  grid-template-rows: 1fr;
}

.line{
  grid-area: line;
  display: grid;
  grid-template-rows: 0fr;
  transition: all .3s ease-in;
  margin-top: 1rem;
  margin-left: .5rem;
  width: @line-width;
  &>div{
    background-color: #aca;
    min-height: 0;
  }
}

.line-open{
  grid-template-rows: 1fr;
}

.line-choosed > div{
  background-color: #aae;
}
</style>