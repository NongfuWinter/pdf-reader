<script setup lang="ts">

</script>

<template>
  <div class="base">
    <nav class="nav">导航</nav>
    <RouterView></RouterView>
  </div>
</template>

<style lang="less" scoped>
//@width = 5rem;

.base{
  height: 500px;
  display: flex;
  flex-direction: column;

  &>*{
    flex-grow: 1;
  }
}
.nav{
  height: 4rem;
  border-bottom: #aaa solid 1px;
  
}
</style>