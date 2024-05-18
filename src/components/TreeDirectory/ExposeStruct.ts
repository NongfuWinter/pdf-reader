class PureNode{
  prior: PureNode | null
  next: PureNode | null

  constructor() {
    this.prior = null
    this.next = null
  } 

  connect(prior: PureNode|null, next: PureNode|null){
    this.disengage()
    this.prior = prior
    this.next = next

    if(prior){
      prior.next = this
    }
    if(next){
      next.prior = this
    }
  }
  
  disengage(){
    if(this.prior){
      this.prior.next = this.next
    }
    if(this.next){
      this.next.prior = this.prior
    }
    this.prior = null
    this.next = null
  }
}


export class Tree extends PureNode{
  id: symbol
  content: string
  leaves: Leaves
  
  constructor(content?: string) {
    super()
    this.id = Symbol()
    this.content = content ?? 'Empty'
    this.leaves = new Leaves(this)
  } 

  pushleaf(leaf: Tree){
    this.leaves.push(leaf)
  }
}

export class Leaves extends PureNode{
  root: Tree

  constructor(root: Tree) {
    super()
    this.root = root
  }

  [Symbol.iterator]() {
    let leaf = this.next
    return {
      next: () => {
        if(leaf == null){
          return {value: null, done: true}
        }else{
          let result = leaf
          leaf = leaf.next
          return {value: result as Tree, done: false}
        }
      }
    }
  }

  push(leaf: Tree){
    let currentLeaf: PureNode = this
    while(currentLeaf.next){
      currentLeaf = currentLeaf.next
    }
    leaf.connect(currentLeaf, null)
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