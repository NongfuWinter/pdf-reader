<script setup lang="ts">
import { onMounted, onBeforeMount, ref, shallowRef, triggerRef, nextTick, watch} from 'vue';
import { useStyleStore } from '@/stores'
import PdfDirectory from './PdfDirectory.vue'
import * as pdfjs from 'pdfjs-dist'
// @ts-ignore
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs' 

enum PageNodeTypes{
  CANVAS,
  LOAD,
  NULL,
}

// 定义接口与类
class PageNode{
  id: number
  number: number
  prior: PageNode | null
  next: PageNode | null
  intersectionObserver: IntersectionObserver | null
  container: HTMLElement | HTMLCanvasElement | null
  type: PageNodeTypes

  constructor(number: number, type: PageNodeTypes = PageNodeTypes.NULL){
    this.id = pageNodeId++
    this.number = number
    this.prior = null
    this.next = null
    this.intersectionObserver = null
    this.container = null
    this.type = type
  }

  initObserver(){
    if(this.type == PageNodeTypes.CANVAS){
      this.intersectionObserver = new IntersectionObserver(
        (entries) =>{
          if(entries[0].isIntersecting){
            // routeLinkList.insert(this)
          }else{

          }
        },
        {
          root: pdfView.value,
          threshold: 0.2,
        }
      )
    }else if(this.type == PageNodeTypes.LOAD){
      this.intersectionObserver = new IntersectionObserver(
        (entries, intersectionObserver) =>{
          console.log('load number is: ', this.number,  this.id, entries[0].intersectionRatio);
          if(!entries[0].isIntersecting){
            return
          }else{
            pdfView.value!.style.overflowY = "hidden"
          }
          const newPageNode = new PageNode(this.number, PageNodeTypes.CANVAS)
          if(this.next!.number - this.prior!.number == 2){
            if(this.prior!.type == PageNodeTypes.CANVAS){
              setCurrentNode(this.prior!)
            }else{
              setCurrentNode(this.next!)
            }
            newPageNode.insert(this.prior!, this.next!)
            this.prior = null
            this.next = null
            intersectionObserver.disconnect()
            triggerRef(pageLinkList)
            nextTick().then(()=>{
              console.log('1: ', newPageNode)
            })
          }else if(this.number - this.prior!.number == 1){
            setCurrentNode(this.prior!)
            newPageNode.insert(this.prior!, this)
            this.number++
            triggerRef(pageLinkList)
            nextTick().then(()=>{
              console.log('2: ', newPageNode)
            })
          }else if(this.next!.number - this.number == 1){
            setCurrentNode(this.next!)
            newPageNode.insert(this, this.next!)
            this.number--
            triggerRef(pageLinkList)
            nextTick().then(()=>{
              console.log('3: ', newPageNode)
            })
          }else{
            throw "LoadNode create CanvasNode Error!"
          }
          
        },
        {
          root: pdfView.value,
          threshold: 0.8,
        }
      )
    }
  }

  observe(){
    if(this.container){
      this.intersectionObserver!.observe(this.container)
    }else{
      console.log('loadContainer is empty!');
    }
  }

  connect(priorNode: PageNode|null, nextNode:PageNode|null){
    if(priorNode != null){
      this.prior = priorNode
      priorNode.next = this
    }

    if(nextNode != null){
      this.next = nextNode
      nextNode.prior = this
    }
  }

  disengage(){
    if(this.prior != null){
      this.prior.next = null
      this.prior = null
    }

    if(this.next != null){
      this.next.prior = null
      this.next = null
    }
  }

  deleteCanvas(){
    console.log('now delete pageNode: ', this);

    if(this.prior!.type != PageNodeTypes.LOAD && this.next!.type != PageNodeTypes.LOAD){
      let newLoadNode = new PageNode(this.number, PageNodeTypes.LOAD)
      newLoadNode.connect(this.prior, this.next)
      console.log('create new loadNode: ', newLoadNode);
      
    }else if(this.prior!.type == PageNodeTypes.LOAD){
      this.prior!.number++
      this.prior!.next = this.next
      this.next!.prior = this.prior
      
    }else if(this.next!.type == PageNodeTypes.LOAD){
      this.next!.number--
      this.prior!.next = this.next
      this.next!.prior = this.prior

    }else{
      console.log('4', this.prior, this.next);
      
    }
  
    this.prior = null
    this.next = null
    triggerRef(pageLinkList)
    console.log('%cdelete success!', 'color: green');
  }
}

class PageLinkList{
  head: PageNode
  tail: PageNode

  constructor(initailNumber: number, maxNumber: number){
    const head = new PageNode(0)
    const tail = new PageNode(pdfDoc.numPages+1)
    const initailNode = new PageNode(initailNumber, PageNodeTypes.CANVAS)
    initailNode.connect(head, tail)
    this.head = head
    this.tail = tail
    currentNode = initailNode
    routeLinkList.insert(initailNode)
    
    if(maxNumber == 1){
      return
    }
    if(initailNumber != 1){
      const node = new PageNode(initailNumber-1, PageNodeTypes.LOAD)
      node.connect(head, initailNode)
    }
    if(initailNumber != maxNumber){
      const node = new PageNode(initailNumber+1, PageNodeTypes.LOAD)
      node.connect(initailNode, tail)
    }
  }

  [Symbol.iterator]() {
    let node = this.head
    
    return {
      next: () => {
        if (node.next != this.tail) {
          node = node.next!
          return { value: node, done: false };
        } else {
          return { value: node, done: true };
        }
      },
    }
  }

  push(newNode: PageNode): PageNode|null{
    for (const node of this) {
      if(node!.next == null){
        // node!.next = newNode
        newNode.next = this.head.next
        this.head.next = newNode
        return null
      }
    }
    
    return null
  }

}

class RouteNode{
  data: PageNode
  next: RouteNode | null

  constructor(data: PageNode){
    this.data = data
    this.next = null
  }
}

class RouteLinkList{
  static MAX_SIZE = 4
  head: RouteNode | null
  size: number

  constructor(){
    this.head = null
    this.size = 0
  }

  [Symbol.iterator]() {
    let node = this.head
    
    return {
      next: () => {
        if (node != null) {
          let currentNode = node
          node = node.next
          return { value: currentNode, done: false }
        } else {
          return { done: true };
        }
      },
    }
  }

  insert(pageNode: PageNode){
    let isInsert = false
    let newRouteNode = new RouteNode(pageNode)

    if(this.head == null){
      isInsert = true
    }else if(this.head.next == null){
      if(pageNode.id != this.head.data.id){
        isInsert = true
      }
    }else{
      for (const routeNode of this) {
        if(routeNode!.next == null){
          isInsert = true
          break
        }else if(pageNode.id == routeNode!.next.data.id){
          routeNode!.next = routeNode!.next.next
          routeNode!.next!.next = null
          isInsert = true
          break
        }
      }
    }

    if(isInsert){
      newRouteNode.next = this.head
      this.head = newRouteNode
      this.size++
    }
    console.log('%cRouteNode insert success!', 'color: green', this);
    this.clean()
  }

  clean(){
    if(this.size >= RouteLinkList.MAX_SIZE){
      let halfSize = Math.floor(RouteLinkList.MAX_SIZE/2)
      this.size = halfSize 
      
      let newEndNode!: RouteNode
      for (const routeNode of this) {
        halfSize--
        if(halfSize == 0){
          newEndNode = routeNode!
        }
      }
      while(newEndNode.next != null){
        console.log('%ccleaning... ', 'color: cyan;', newEndNode, routeLinkList)
        newEndNode.next.data.deleteCanvas()
        newEndNode.next = newEndNode.next.next
      }
    }
  }
}

const props = defineProps({
  pageNumber: {
    type: Number,
    default: 1,
  }
  
})

// 模板引用
const pdfView = ref<HTMLInputElement | null>() // pdf渲染组件

// 导入store
const style = useStyleStore() // 全局尺寸样式data

// 定义常数
const initialPageNumber = 10
const PAGE_ARRAY_MAX_LENGTH = 30

let pageNodeId = 1
let currentNodeTop = 0
let currentNode!: PageNode


// 页码路由列表
const pageNumberRouterList = ref([])

var url = '/1.pdf'

// The workerSrc property shall be specified
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// Asynchronous download of PDF
const loadingTask = pdfjs.getDocument(url)
const pdfDoc = await loadingTask.promise

// pdf页面链表初始化
const routeLinkList = new RouteLinkList()
const pageLinkList = shallowRef(new PageLinkList(props.pageNumber, pdfDoc.numPages))

watch(
  ()=>style.windowInWidth,
  async ()=>{
    await nextTick()
    setAllPageWidth(pdfView.value!.offsetWidth)
  }
)

// pdf初始渲染
function pdfRender(pageWidth: number){
  console.log("pdfInitialWidth: ", pageWidth);
  for (const node of pageLinkList.value) {
    console.log('pdfRender: ', node);
  }
}

// pdf单页初始渲染
async function renderPage(pageNode: PageNode){
  const pageNumber = pageNode.number
  const container = pageNode.container as HTMLCanvasElement
  const pageWidth = pdfView.value!.offsetWidth
  console.log('!!!ready to render Page ', pageNode);
  
  await pdfDoc.getPage(pageNumber).then(
    (page) => {
      console.log('ready to render Page ', pageNode);
      var scale = 0.5;
      var outputScale = window.devicePixelRatio || 1;
      var viewport = page.getViewport({scale: scale/outputScale});
      viewport = page.getViewport({scale: pageWidth/viewport.width});
      var context = container.getContext('2d');
      
      if(!context){
        console.error('Page render fail!');
        return
      }else{
        container.width = Math.floor(viewport.width);
        container.height = Math.floor(viewport.height);
        setPageWidth(container, pageWidth)

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        var renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          console.log('Page rendered');
        }).catch(()=>{
          console.error('Page fail!');
        }

        );
      }
    }
  ).catch(e=>console.error(e));
  
}

function setPageWidth(container: HTMLCanvasElement, width: number){
  const aspectRatio = container.width/container.height
  container.style.width = Math.floor(width) + "px";
  container.style.height =  Math.floor(width / aspectRatio) + "px";
  console.log("sw, sh: ", container.style.width, container.style.height);
}

function setAllPageWidth(newWidth: number){
  // pageContainerList.value.forEach(container => {
  //   setPageWidth(container, newWidth)
  // })
}

function setCurrentNode(pageNode: PageNode){
  currentNode = pageNode
  currentNodeTop = currentNode.container!.getBoundingClientRect().top
}

function handleScroll(){
  console.log('handleScroll: ', currentNode);
  let newTop = currentNode.container!.getBoundingClientRect().top
  if(newTop != currentNodeTop){
    pdfView.value!.scrollTop += newTop - currentNodeTop 
  }
  
}

// 生命周期钩子
onMounted(()=>{
  pdfRender(pdfView.value!.offsetWidth)
  console.log('list width: ', pdfView.value!.offsetWidth, pageLinkList.value.head)
})

// 自定义指令
const vLoadRef = {
  beforeMount: function (el: HTMLElement, binding: any) {
    const loadNode = <PageNode>(binding.value)
    loadNode.container = el
  },
  mounted: (_: HTMLElement, binding: any) => {
    const loadNode = <PageNode>(binding.value)
    loadNode.initObserver()
    loadNode.observe()
  },
}

const vCanvasRef = {
  beforeMount: (el: HTMLCanvasElement, binding: any) => {
    const pageNode = <PageNode>(binding.value)
    pageNode.container = el
  },
  mounted: (_: HTMLCanvasElement, binding: any) => {
    const pageNode = <PageNode>(binding.value)
    pageNode.initObserver()
    pageNode.observe()
    renderPage(pageNode).then(()=>{
      pdfView.value!.style.overflowY = "auto"
      routeLinkList.insert(pageNode)
      console.log(pageNode, pageLinkList.value);
      
      handleScroll()
    })
  },
}

function test(event: any) {
  console.log('target: ', event.target.__vnode, event.target.markSomething);
  event.target.markSomething = 10
}

function t1(event: any){
  let a = event.target.getBoundingClientRect()
  console.log('%cnoew', 'color: red', a);
  
}
</script>

<template>
  <div class="base" :style="{width: style.windowInWidth+'px', height: style.windowInHeight+'px'}">
    <nav>导航</nav>
    <div class="list">
      <div class="editor" @click="test($event)">
        <PdfDirectory></PdfDirectory>
      </div>
      
      <div class="pdfView" ref="pdfView">
        <template v-for="pnode of pageLinkList" :key="pnode.id">
          <template v-if="(pnode instanceof PageNode)">
            <p>{{ pnode.number }}</p>
            <div class="loading" v-load-ref="pnode" v-if="(pnode.type == PageNodeTypes.LOAD)"><p>loading......</p></div>
            <canvas :id="String(pnode.number)" v-canvas-ref="pnode" @click="t1($event)" v-else></canvas>
          </template>
        </template>
      </div>
      <div class="note" >
        <p>pageNumber is {{ pageNumber }}</p>
        <p>width is {{ style.windowInWidth }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//@width = 5rem;

.base{
  height: 500px;
  display: flex;
  flex-direction: column;
}
.list{
  display: flex;
  flex: 1;
  overflow: auto;

  &>*{
    min-width: 0;
    flex: 1;
  }

  .pdfView{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;

    .loading{
      display:flex;
      flex-direction: column;
      justify-content:center;
      height: 3rem;
      font-size: 1rem;
      background-color: #161823;
    }
  }
  .pdfList>*{
    min-width: 0;
    flex: 1;
  }

  .editor{
    background-color: #161823;
  }

  .note{
    background-color: rebeccapurple;
  }
}
</style>