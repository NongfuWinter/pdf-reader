<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Info from './Info.vue'
import Directory from './Directory.vue'

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
onMounted(() => {
  list.value.push(2)
  list.value.push(2)
})
</script>


<template>

 
    <ul class="lables">
      <li><i class="bi bi-chevron-right"></i></li>
      <li v-for="lable, index in lables" @click="chooseLable = index"
      :class="{'active':(chooseLable==index)}">
        {{ lable }}
      </li>
    </ul>


  <div>
    <component :is="components[chooseLable]"></component>
  </div>

</template>

<style scoped lang="less">
.lables {
  display: flex;
  flex-direction: row;
  color: #111;
  border-bottom: #aaa solid 1px;
  

  li {
    padding: 0.7rem 2rem;

    &:first-child{
      padding-left: 1rem;
      padding-right: 1rem;
    }

    &:last-child {
      border-right: none;
    }
  }

  .active {
    // background: #9be;
    color: #4a8;
  }
}

.a {
  background-color: #000;
}
</style>