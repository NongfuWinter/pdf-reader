import { defineStore } from 'pinia';

export const useStyleStore = defineStore('style', {
    state: ()=>({
        windowInWidth: 0,
        windowInHeight: 0,

    }),
    actions: {
        setWindowInWidth(width: number){
            this.windowInWidth = width
        },
        setWindowInHeight(height: number){
        this.windowInHeight = height
        }
    }
})