<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function t(){
  router.push({path: '/pdfReader'})
}

function f(){
  router.push({path: '/'})
}
</script>

<template>
  <div class="base">
    <nav class="nav">
      <p @click="router.push({path: '/projectIntro'})">介绍</p>
      <p @click="f()">导航</p>
      <p @click="t()">我的书籍</p>
    </nav>
    <div class="content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped lang="less">
.base{
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: stretch;
}

.nav{
  display: flex;
  flex-direction: row;
  height: 3.5rem;
  border-bottom: #aaa solid 1px;
  align-items: center;
  justify-items: center;

  p{
    padding: 0 1rem;
  }
}

.content{
  display: flex;
  flex-grow: 1;
  place-items: center;
}
</style>