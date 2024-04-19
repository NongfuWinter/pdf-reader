<script setup lang="ts">
import { ref } from 'vue'
import { OPERATION_MENU as MENU, ToolsNavProps } from './Struct'

const {props} = defineProps<{
  props: ToolsNavProps
}>()

const emits = defineEmits<{
}>()

enum DROP_STYLE{
  NULL = 'null',
  AHEAD = 'ahead',
  BEHIND = 'behind',
  INSIDE = 'inside',
}

const isDragEnter = ref(DROP_STYLE.NULL)

function dragEnter(event: any, changeValue: DROP_STYLE){
  isDragEnter.value = changeValue
  console.log('TOOLS dragEnter', isDragEnter.value);
}

function dragLeave(event: any, expectValue: DROP_STYLE){
  if(isDragEnter.value == expectValue){
    isDragEnter.value = DROP_STYLE.NULL
  }
  console.log('TOOLS leave', isDragEnter.value);
}

function t(){
  isDragEnter.value = DROP_STYLE.NULL
  props.setMenu(MENU.NULL)
  console.log('TTTTTTTTTTTT');
}
</script>

<template>
  <Transition name="slide-fade">
  <div class="operation" v-if="!props.menuCompare(MENU.NULL)">
    <template v-if="props.menuCompare(MENU.MAIN)">
      <div draggable="true" @dragstart="props.dragStart($event)" @dragend="props.dragEnd($event)">
        <i class="bi bi-grip-horizontal" style="color: #333;"></i>
      </div>
      <div>
        <i class="bi bi-pencil-square" style="color: #25d;" ></i>
      </div>
      <div>
        <i class="bi bi-plus-square" style="color: #2a0;" @click="props.setMenu(MENU.ADD)"></i>
      </div>
      <div>
        <i class="bi bi-x-square" style="color: #d20;" @click="props.setMenu(MENU.DRAG)"></i>
      </div>
    </template>
    <template v-else-if="props.menuCompare(MENU.DRAG)" >
      <div class="change" :class="{'change-hover': isDragEnter == DROP_STYLE.AHEAD}" 
      @dragenter="dragEnter($event, DROP_STYLE.AHEAD)" @dragleave="dragLeave($event,DROP_STYLE.AHEAD)"
      @drop="t()" >
        <i class="bi bi-indent" style="transform: scale(1.2) rotateZ(-90deg)"></i>
      </div>
      <div class="change" :class="{'change-hover': isDragEnter == DROP_STYLE.INSIDE}" 
      @dragenter="dragEnter($event, DROP_STYLE.INSIDE)" @dragleave="dragLeave($event, DROP_STYLE.INSIDE)">
        <i class="bi bi-fullscreen" style="transform: scale(0.9) rotateZ(-90deg)"></i>
      </div>
      <div>
        <i class="bi bi-indent" style="transform: scale(1.2) rotateZ(90deg);"></i>
      </div>
      <div>
        <i class="bi bi-reply" @click="props.setMenu(MENU.MAIN)"></i>
      </div>
    </template>

    <template v-else-if="props.menuCompare(MENU.ADD)">
      <div>
        <i class="bi bi-indent"></i>
      </div>
      <div>
        <i class="bi bi-reply " @click="props.setMenu(MENU.MAIN)"></i>
      </div>
    </template>
  </div>
</Transition>
</template>

<style scoped lang="less">
.operation {
  display: flex;
  align-self: stretch;
  padding: auto 1rem;

  div{
    display: flex;
    margin-right: 1px;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    align-items: center;
    // background-color: red;
  }
  div:last-child{
    margin-right: 1rem;
  }
  & i{
    font-size: 1.1rem;
  }
  & i:last-child{
    margin-right: 0;
  }
}

.change{
  color: #25d;
  & *{
    pointer-events: none;
  }
}

.change-hover{
  position: relative;
  transition: color 1s initial;
  animation: some .8s infinite;
}

@keyframes some {
  20%{ 
    color: #59f;
    transform: scale(1.5);
  }
}

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
</style>