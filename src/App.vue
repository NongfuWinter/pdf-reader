<script setup lang="ts">
import { useStyleStore } from '@/stores'
import HelloWorld from './components/HelloWorld.vue'
import { onBeforeMount} from 'vue'

const style = useStyleStore()

window.onresize = ()=>{
  style.windowInWidth = window.innerWidth
  style.windowInHeight = window.innerHeight
  console.log('window: ', style.windowInWidth, window.innerHeight)
}

onBeforeMount(()=>{
  style.setWindowInWidth(document.body.clientWidth)
  style.setWindowInHeight(document.body.clientHeight)
  console.log(style.windowInWidth, window.devicePixelRatio)
})
</script>

<template>
  <HelloWorld/>
</template>

<style>

</style>