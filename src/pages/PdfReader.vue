<script setup lang="ts">
import { onMounted, ref, shallowRef, triggerRef, nextTick, watch} from 'vue';
import { useStyleStore } from '@/stores'
import PdfDirectory from './PdfReader/Compendium.vue'
import * as pdfjs from 'pdfjs-dist'
// @ts-ignore
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs' 

// 定义接口与类
interface LoadNode{
  host: PageNode
  pp: number
  container:  HTMLElement | null
  intersectionObserver: IntersectionObserver

  disengage(): void

  getnextPageNode(): PageNode|null
  
  detection(): {isContinuing: boolean, isEnd: boolean}
  
  createPageNode(): PageNode
  
  observe(): void
}

class ForeLoadNode implements LoadNode{
  host: PageNode
  pp: number
  container: HTMLElement | null
  intersectionObserver: IntersectionObserver

  constructor(host: PageNode){
    this.host = host
    this.pp = host.pp - 1
    this.container = null
    this.intersectionObserver = this.initObserver()
  }

  disengage(){
    lostHeigh = this.container?.offsetHeight ?? 0
    this.host.foreLoad = null
  }

  getnextPageNode():  PageNode|null{
    return this.host.prior
  }

  detection(): {isContinuing: boolean, isEnd: boolean}{
    let isContinuing = false
    let isEnd = false
    const nextPageNode = this.getnextPageNode()

    if(nextPageNode != null){
      if(this.pp - nextPageNode.pp > 2){
        isContinuing = true
      }
    }else{
      isEnd = true
      if(this.pp != minPP){
        isContinuing = true
      }
    }
  
    return {isContinuing, isEnd}
  }

  createPageNode(): PageNode{
    const newPageNode = new PageNode(this.pp)

    const { isContinuing, isEnd } = this.detection()
    
    if(isContinuing){
      newPageNode.foreLoad = new ForeLoadNode(newPageNode)
    }
    if(isEnd){
      pageLinkList.value.head = newPageNode
    }

    newPageNode.connect(this.getnextPageNode(), this.host)

    this.disengage()

    return newPageNode
  }

  initObserver(){
    return new IntersectionObserver(
      ([entry], intersectionObserver) =>{
        if(!entry.isIntersecting){
          return
        }else{
          // pdfView.value!.style.overflowY = "hidden"
        }

        console.log('%cloading : ', 'color: orange', this.pp)
        setCurrentNode(this.host)
        
        const newPageNode = this.createPageNode()
        triggerRef(pageLinkList)
        nextTick().then(()=>{
          console.log('11111', newPageNode)
          // setCurrentNode(newPageNode)
        })
      },
      {
        root: pdfView.value,
        threshold: 0.8,
      }
    )
  }

  observe(){
    if(this.container != null){
      this.intersectionObserver.observe(this.container)
    }else{
      console.error('ForeLoad %d 容器为空， 交叉观测器绑定失败', this.pp)
    }
  }
}

class AftLoadNode implements LoadNode{
  host: PageNode
  pp: number
  container:  HTMLElement | null
  intersectionObserver: IntersectionObserver

  constructor(host: PageNode){
    this.host = host
    this.pp = host.pp + 1
    this.container = null
    this.intersectionObserver = this.initObserver()
  }

  disengage(){
    this.host.aftLoad = null
  }

  getnextPageNode():  PageNode|null{
    return this.host.next
  }

  detection(): {isContinuing: boolean, isEnd: boolean}{
    let isContinuing = false
    let isEnd = false
    const nextPageNode = this.getnextPageNode()

    if(nextPageNode != null){
      if(nextPageNode.pp - this.pp > 2){
        isContinuing = true
      }
    }else{
      isEnd = true
      if(this.pp != maxPP){
        isContinuing = true
      }
    }
  
    return {isContinuing, isEnd}
  }

  createPageNode(): PageNode{
    const newPageNode = new PageNode(this.pp)
    const { isContinuing, isEnd } = this.detection()


    if(isContinuing){
      newPageNode.aftLoad = new AftLoadNode(newPageNode)
    }
    newPageNode.connect(this.host, this.getnextPageNode())
    this.disengage()
    isHandleScroll = false

    return newPageNode
  }

  initObserver(){
    return new IntersectionObserver(
      ([entry], intersectionObserver) =>{
        if(!entry.isIntersecting){
          return
        }else{
          // pdfView.value!.style.overflowY = "hidden"
        }
        console.log('%cloading : ', 'color: orange', this.pp);

        const newPageNode = this.createPageNode()
        triggerRef(pageLinkList)
        nextTick().then(()=>{
          console.log('11111', newPageNode)
          // setCurrentNode(newPageNode)
        })
        
      },
      {
        root: pdfView.value,
        threshold: 0.8,
      }
    )
  }

  observe(){
    if(this.container != null){
      this.intersectionObserver.observe(this.container)
    }else{
      console.error('ForeLoad %d 容器为空， 交叉观测器绑定失败', this.pp)
    }
  }
  // if(this.type == 1 && this.pp == maxPP){
  //     return true

}

class PageNode{
  id: number
  pp: number
  prior: PageNode | null
  next: PageNode | null
  intersectionObserver: IntersectionObserver | null
  container:HTMLCanvasElement | null
  foreLoad: LoadNode | null
  aftLoad: LoadNode | null

  constructor(pp: number){
    this.id = pageNodeId++
    this.pp = pp
    this.prior = null
    this.next = null
    this.intersectionObserver = null
    this.container = null
    this.foreLoad = null
    this.aftLoad = null
  } 

  // updateLoadNodes(){
  //   if(this.prior != null){
  //     const difference = this.number - this.prior.number
  //     if(difference > 2){
  //       this.priorLoad ??= new LoadNode(this)
  //     }else if(difference == 2){
  //       if(this.prior.nextLoad == null){
  //         this.priorLoad ??= new LoadNode(this)
  //       }else{
  //         this.priorLoad = null
  //       }
  //     }else if(difference < 1){
  //       console.error('页码排序错误！')
  //     }
  //   }else{
  //     if(this.number != 0){
  //       this.priorLoad ??= new LoadNode(this)
  //     }
  //   }

  //   if(this.next != null){
  //     const difference = this.next.number - this.number
  //     if(difference > 2){
  //       this.nextLoad ??= new LoadNode(this)
  //     }else if(difference == 2){
  //       if(this.next.nextLoad == null){
  //         this.nextLoad ??= new LoadNode(this)
  //       }else{
  //         this.nextLoad = null
  //       }
  //     }else if(difference < 1){
  //       console.error('页码排序错误！')
  //     }
  //   }else{
  //     if(this.number != pdfDoc.numPages){
  //       this.nextLoad = new LoadNode(this)
  //     }
  //   }
  // }

  initObserver(){
    
  }

  observe(){
    // if(this.container){
    //   this.intersectionObserver!.observe(this.container)
    // }else{
    //   console.log('loadContainer is empty!');
    // }
  }

  createForeLoad(){
    this.foreLoad = new ForeLoadNode(this)
  }

  createAftLoad(){
    this.aftLoad = new AftLoadNode(this)
  }

  // intrude(priorNode: PageNode|null, nextNode:PageNode|null){
  //   if(priorNode != null){
  //     const difference = this.pp - priorNode.pp
  //     if(difference > 2){
  //       this.priorLoad ??= new LoadNode(this)
  //     }else if(difference == 2){
  //       if(this.prior.nextLoad == null){
  //         this.priorLoad ??= new LoadNode(this)
  //       }else{
  //         this.priorLoad = null
  //       }
  //     }else if(difference < 1){
  //       console.error('页码排序错误！')
  //     }
  //   }else{
  //     if(this.pp > 0){
  //       this.priorLoad = new LoadNode(this)
  //     }else if(this.pp < 0){
  //       console.error('页码超出最小值')
  //     }
  //   }

  //   if(nextNode != null){
  //     this.next = nextNode
  //     nextNode.prior = this
  //   }
  // }

  connect(priorNode: PageNode|null, nextNode:PageNode|null){
    if(priorNode != null){
      priorNode.next = this
    }
    if(nextNode != null){
      nextNode.prior = this
    }
    this.prior = priorNode
    this.next = nextNode
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

    // if(this.prior!.type != PageNodeTypes.LOAD && this.next!.type != PageNodeTypes.LOAD){
    //   let newLoadNode = new PageNode(this.number, PageNodeTypes.LOAD)
    //   newLoadNode.connect(this.prior, this.next)
    //   console.log('create new loadNode: ', newLoadNode);
      
    // }else if(this.prior!.type == PageNodeTypes.LOAD){
    //   this.prior!.number++
    //   this.prior!.next = this.next
    //   this.next!.prior = this.prior
      
    // }else if(this.next!.type == PageNodeTypes.LOAD){
    //   this.next!.number--
    //   this.prior!.next = this.next
    //   this.next!.prior = this.prior

    // }else{
    //   console.log('4', this.prior, this.next);
      
    // }
  
    // this.prior = null
    // this.next = null
    // triggerRef(pageLinkList)
    // console.log('%cdelete success!', 'color: green');
  }
}

class PageLinkList{
  head: PageNode

  constructor(initPP: number){
    const initNode = new PageNode(initPP)
    this.head = initNode
    currentNode = initNode
    routeLinkList.insert(initNode)
    
    if(maxPP == minPP){
      return
    }
    if(initPP != minPP){
      initNode.createForeLoad()
    }
    if(initPP != maxPP){
      initNode.createAftLoad()
    }
  }

  [Symbol.iterator]() {
    let node : PageNode|null = this.head
    
    return {
      next: () => {
        if (node != null) {
          const result = node
          node = node.next
          return { value: result, done: false };
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
    default: 10,
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
let lostHeigh = 0
let isHandleScroll = true

// 页码路由列表
const pageNumberRouterList = ref([])

var url = '/1.pdf'

// The workerSrc property shall be specified
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// Asynchronous download of PDF
const loadingTask = pdfjs.getDocument(url)
const pdfDoc = await loadingTask.promise

const minPP = 1
const maxPP = pdfDoc.numPages

// pdf页面链表初始化
const routeLinkList = new RouteLinkList()
const pageLinkList = shallowRef(new PageLinkList(props.pageNumber))

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
  const pp = pageNode.pp
  const container = pageNode.container
  const pageWidth = pdfView.value!.offsetWidth
  console.log('%cready to render Page ', 'color: orange', pageNode);
  
  await pdfDoc.getPage(pp).then(
    (page) => {
      if(container == null){
        console.error('canvas is empty, pageNode: ', pageNode)
        return
      }

      var scale = 0.5;
      var outputScale = window.devicePixelRatio || 1;
      var viewport = page.getViewport({scale: scale/outputScale});
      viewport = page.getViewport({scale: pageWidth/viewport.width});
      var context = container.getContext('2d');
      
      if(!context){
        console.error('context is empty');
        return
      }else{
        container.width = Math.floor(viewport.width);
        container.height = Math.floor(viewport.height);
        setPageWidth(container, pageWidth)

        var renderContext = {
          canvasContext: context,
          viewport: viewport
        }

        var renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          console.log('%cPage rendered', 'color: green');
        }).catch(()=>{
          console.error('Page render fail!');
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
  let newTop = currentNode.container!.getBoundingClientRect().top
  if(newTop != currentNodeTop){
    pdfView.value!.scrollTop += newTop - currentNodeTop - lostHeigh
    lostHeigh = 0
  }
  console.log('handleScroll: ', currentNode, newTop - currentNodeTop);
}

// 生命周期钩子
onMounted(()=>{
  pdfRender(pdfView.value!.offsetWidth)
  console.log('list width: ', pdfView.value!.offsetWidth, pageLinkList.value.head)
})

// 自定义指令
const vLoadRef = {
  beforeMount: function (el: HTMLElement, binding: any) {
    const loadNode = <LoadNode>(binding.value)
    loadNode.container = el
  },
  mounted: (_: HTMLElement, binding: any) => {
    const loadNode = <LoadNode>(binding.value)
    loadNode.observe()
  },
}

const vCanvasRef = {
  beforeMount: (el: HTMLCanvasElement, binding: any) => {
    const pageNode = <PageNode>(binding.value)
    pageNode.container = el
  },
  mounted: (_: HTMLCanvasElement, binding: any) => {
    console.log('%cPageNode randering...', 'color: orange')
    const pageNode = <PageNode>(binding.value)
    pageNode.initObserver()
    pageNode.observe()
    renderPage(pageNode).then(()=>{
      pdfView.value!.style.overflowY = "auto"
      routeLinkList.insert(pageNode)
      console.log(pageNode, pageLinkList.value)
      if(isHandleScroll){
        handleScroll()
        isHandleScroll = !isHandleScroll
      }
      setCurrentNode(pageNode)
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
    <div class="list">
      <div class="editor" @click="test($event)">
        <PdfDirectory></PdfDirectory>
      </div>
      
      <div class="pdfView" ref="pdfView">
        <template v-for="pnode of pageLinkList" :key="pnode?.id">
          <template v-if="pnode != null">
            <div>
              <p class="index">{{ pnode.pp }}</p>
              <div class="loading" v-if="(pnode.foreLoad)" v-load-ref="pnode.foreLoad"><p>loading . . . </p></div>
              <canvas :id="String(pnode.pp)" v-canvas-ref="pnode" @click="t1($event)"></canvas>
              <div class="loading" v-if="(pnode.aftLoad)" v-load-ref="pnode.aftLoad"><p>loading . . . </p></div>
            </div>
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
    border-left: #ccc solid 2px;
    border-right: #ccc solid 2px;
    
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

  // .editor{
  //   // background-color: #ccc;
  // }

  // .note{
  //   // background-color: #ccc;
  // }
}
</style>