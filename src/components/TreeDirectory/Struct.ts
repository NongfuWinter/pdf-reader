export enum STATE{
  CHECK = 'check',
  EDIT = 'edit',
}

export enum OPERATION_MENU{
  NULL = 'null',
  MAIN = 'main',
  DRAG = 'drag',
  ADD = 'add',
}

export interface ToolsNavProps{
  menuCompare: (expection: OPERATION_MENU) => boolean
  setMenu: (menu: OPERATION_MENU) => void
  setEditTitle: ()=>void
  onFocus: ()=>void
  delete: ()=>void
  dragStart: (event: DragEvent) => void
  dragEnd: (event: DragEvent) => void
}