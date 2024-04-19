export class Tree {
  id: Symbol
  content: string
  prior: Tree | null
  next: Tree | null
  leaves: Tree | null
  constructor(content?: string) {
    this.id = Symbol()
    this.content = content ?? 'Empty'
    this.prior = null
    this.next = null
    this.leaves = null
  } 

  [Symbol.iterator]() {
    let leaf = this.leaves
    return {
      next: () => {
        if(leaf == null){
          return {value: null, done: true}
        }else{
          let result = leaf
          leaf = leaf.next
          return {value: result, done: false}
        }
      }
    }
  }

  connect(priorTree: Tree, nextTree: Tree){
    this.disengage()
    this.prior = priorTree
    this.next = nextTree
    priorTree.next = this
    nextTree.prior = this
  }

  disengage(){
    if(this.prior){
      this.prior.next = null
      this.prior = null
    }
    if(this.next){
      this.next.prior = null
      this.next = null
    }
  }

  pushleaf(leaf: Tree){
    let currentLeaf = this.leaves
    if(currentLeaf){
      while(currentLeaf.next){
        currentLeaf = currentLeaf.next
      }
      currentLeaf.next = leaf
    }else{
      this.leaves = leaf
    }
  }

}

export class Communication {
  private choosedId: Symbol | null
  beforeChangeChooseId: ()=>void

  // isDragging: boolean

  constructor(){
    this.choosedId = null
    this.  beforeChangeChooseId = ()=>{}
  }

  setChooseId (newId: Symbol, beforeChangeChooseId: ()=>void){
    if(newId != this.choosedId){
      this.choosedId = newId
      this.  beforeChangeChooseId()
      this.  beforeChangeChooseId = beforeChangeChooseId
    }
  }

  getChooseID(){
    return this.choosedId
  }
}