export class Tree {
  content: string
  next: Tree | null
  leaves: Tree | null
  constructor(content?: string) {
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