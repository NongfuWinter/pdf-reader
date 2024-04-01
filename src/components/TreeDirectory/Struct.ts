export class Tree {
  id: Symbol
  content: string
  next: Tree | null
  leaves: Tree | null
  constructor(content?: string) {
    this.id = Symbol()
    this.content = content ?? 'Empty'
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
}

export enum STATE{
  CHECK = 'check',
  EDIT = 'edit',
}

export class Communication {
  private choosedId: Symbol | null
    beforeChangeChooseId: ()=>void

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