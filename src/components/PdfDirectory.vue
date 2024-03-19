<script setup lang="ts">
import { ref, onMounted, VueElement } from 'vue'
import Info from './pdfDirectory/Info.vue'
import Directory from './pdfDirectory/Directory.vue'

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  }
})

const lables = ['章节', '简介']

const components = [Directory, Info]

let chooseLable = ref(0)


let list = ref(new Array())
onMounted(()=>{
    list.value.push(2)
    list.value.push(2)
})
</script>


<template>
  <nav >
    <ul class="options">
      <li v-for="lable, index in lables" @click="chooseLable = index">
        {{ lable }}
      </li>
    </ul>
  </nav>

  <div>
    <component :is="components[chooseLable]"></component>
  </div>
  
</template>

<style lang="less">
.options{
  display: flex;
  flex-direction: row;
  padding: 0.5rem 0;
  
  li{

    border-right: #999 solid 1px;
    &:last-child{
    border-right: none;

    }
  }
  

  &>*{
    flex-grow: 1;
  }
}

.a{
  background-color: #000;
}
</style>