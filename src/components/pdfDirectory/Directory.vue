<script setup lang="ts">

class Tree{
  content: string
  parent: Tree
  child: Array<Tree>
   
  constructor(){
    this.content = ''
    this.parent = new Tree()
    this.child = new Array<Tree>()
  }

  
}

function t(event: any){
  const a = event.currentTarget as HTMLElement
  if(a.parentElement != null){
    a.parentElement.style.backgroundColor = '#888'
    
  }
}


</script>

<template>
<div class="base">
  <div class="parent">
    <div class="content" @click="t($event)">
      <p>第一章***********</p>
      <i class="bi bi-chevron-right"></i>
    </div>
    <div class="children">
      <div class="parent">
        <div class="content">
          <p>1-1</p>
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>
      <div class="parent">
        <div class="content">
          <p>1-2</p>
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="parent">
    <div class="content" @click="t($event)">
      <p>1</p>
      <i class="bi bi-chevron-right"></i>
    </div>
    <div class="children">
      <div class="parent">
        <div class="content">
          <p>1-1</p>
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>
      <div class="parent">
        <div class="content">
          <p>1-2</p>
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="less">
.base{
  border: #555 solid 5px;
  padding: 1rem 1rem;
}

.parent{
  // background-color: #999;
  border-radius: 1rem;
}

.content{
  display: flex;
  padding: 0.6rem 1rem;
  // background-color: #fff;
  p{
    margin: 0 4rem 0 0;
  }
  i{
    // width: 4rem;
    // // height: 2rem;
  }
}

.children{
  margin-left: 2rem;
}
</style>