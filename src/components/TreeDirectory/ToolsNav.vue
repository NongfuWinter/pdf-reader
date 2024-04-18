<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import { OPERATION_MENU } from './Struct'

const props = defineProps({
  operationMenu: {
    type: String as PropType<OPERATION_MENU>,
    default: OPERATION_MENU.NULL,
    require: true,
  },
  dragStart: {
    type: Function as PropType<(event: DragEvent) => void>,
    default: (_: DragEvent)=>{},
    require: true,
  },
  dragEnd: {
    type: Function as PropType<(event: DragEvent) => void>,
    default: (_: DragEvent)=>{},
    require: true,
  } 
})

const emits = defineEmits<{
}>()
</script>

<template>
  <div class="operation" v-if="operationMenu!=OPERATION_MENU.NULL">
    <template v-if="operationMenu==OPERATION_MENU.MAIN">
      <div draggable="true" @dragstart="props.dragStart($event)" @dragend="dragEnd($event)">
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
      <div class="change">
        <i class="bi bi-indent" style="transform: scale(1.2) rotateZ(-90deg)"></i>
      </div>
      <div class="change">
        <i class="bi bi-fullscreen" style="transform: scale(0.9) rotateZ(-90deg)"></i>
      </div>
      <div>
        <i class="bi bi-indent" style="transform: scale(1.2) rotateZ(90deg);"></i>
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
  </div>
</template>

<style scoped lang="less">
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

.change{
  color: #25d;
}

.change:hover{
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
</style>