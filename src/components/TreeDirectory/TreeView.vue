<script setup lang="ts">
import { ref, inject, onMounted, nextTick, h } from 'vue'
import { OPERATION_MENU, ToolsNavProps } from './Struct'
import { Tree, Communication } from './ExposeStruct'
import ToolsNav from './ToolsNav.vue'

const props = defineProps<{
  tree: Tree
}>()

let treeCommuni = inject('treeCommuni') as Communication

let selfView = ref<HTMLElement | null>(null)
let titleView = ref<HTMLElement | null>(null)
let scapegoatView = ref<HTMLElement | null>(null)
let leavesView = ref<HTMLElement | null>(null)

let isLeavesOpen = ref(false)
let isEdit = ref(false)
let isDraging = ref(false)
let isHover = ref(false)
let isHoverLeaf = ref(false)
let isDragEnter = ref(false)

let dragEnterNumber = 0 
let dragDiffX = 0
let dragDiffY = 0

let operationMenu = ref(OPERATION_MENU.NULL)

function titleContextmenu(event: any){
  if(isEdit.value){
    isEdit.value = false
    operationMenu.value = OPERATION_MENU.NULL
  }else{
    isEdit.value = true
    operationMenu.value = OPERATION_MENU.MAIN
    treeCommuni.setChooseId(props.tree.id, ()=>{isEdit.value=false})
  }
}

function dragOver(event: any){
  console.log('draging!');
  scapegoatView.value!.style.top = event.clientY + dragDiffY + 30+'px'
  scapegoatView.value!.style.left = event.clientX + 20 +'px'
}

function d(event: any){
  event.preventDefault()
}

function dragStart(event: DragEvent){
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

function dragEnd(event: DragEvent){
  console.log('is end!');
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
    operationMenu.value = OPERATION_MENU.NULL
  }
}

function drop(){
  isDragEnter.value = false
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

let toolsNavProps: ToolsNavProps = {
  menuCompare: (expect: OPERATION_MENU) => expect == operationMenu.value,
  setMenu: (menu: OPERATION_MENU) => {operationMenu.value=menu},
  dragStart,
  dragEnd,
}
</script>

<template>
  <div class="root" ref="selfView" 
  :class="{'root-choosed': isEdit || isDragEnter, 'root-hover-bgc': isHover,
  'root-hover-boeder': isHover && !isHoverLeaf}" 
  @dragenter.stop="dragEnter($event)" @dragleave.stop="dragLeave($event)" 
  @dragover="d($event)" @drop="drop"
  @mouseover="mouseOver($event)" @mouseout="mouseleave($event)">
    <div class="title" ref="titleView" :class="{'title-choosed':isEdit}">
      <div class="content"
      @click="contentClick()"
      @contextmenu.prevent="titleContextmenu($event)"
      >
        <p>{{ props.tree.content }}</p>
        <i v-if="props.tree.leaves != null" 
        class="bi bi-chevron-right" :class="{'i-transform': isLeavesOpen}"></i>
      </div>
      
        <ToolsNav :props="toolsNavProps"/>

    </div>
    <div class="leaves" ref="leavesView" :class="{ 'leaves-open': isLeavesOpen }">
      <div>
        <template  v-for="leaf in props.tree">
          <TreeView v-if="leaf != null" :tree="leaf"></TreeView>
        </template>
      </div>
    </div>
    <div class="line" :class="{'line-open': isLeavesOpen, 'line-choosed': isEdit}">
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


@line-width: 2px;

.root, .a {
  border-radius: 1rem;
  overflow: hidden;
  transition-property: background-color, border ;
  transition-duration: .2s, .5s;
  border: rgba(0, 0, 0, 0) solid 1px;
}

.a{
  position: fixed;
  visibility: hidden;
  background-color: rgba(221,221,221, 0.8);
  border: #ccc solid 1px;
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
  // background-color: #cec;
  // border-bottom: #aca solid 2px;
}

.root-choosed {
  background-color: #eee;
  border: #bbb solid 1px;
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
  margin-bottom: .5rem;
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