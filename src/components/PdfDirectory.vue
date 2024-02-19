<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps({
  index: {
    type: Number,
    default: 0,
  }
})

let list = ref(new Array())
onMounted(()=>{
    list.value.push(2)
    list.value.push(2)
})
</script>

<template>
    <ul v-for="l in list">
        <li>{{ l }}</li>
    </ul>
</template>

<style lang="less">
    
</style>