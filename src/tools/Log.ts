export class Log{

  static create(...args: any[]){
    console.log('%c'+args.shift()+': ', 'color: orange', ...args)
  }

  static delete(...args: any[]){
    console.log('%c'+args.shift()+': ', 'color: orange', ...args)
  }

  static info(...args: any[]){
    console.log('%c'+args.shift()+': ', 'color: orange', ...args)
  }

  static right(...args: any[]){
    console.log('%c'+args.shift()+': ', 'color: orange', ...args)
  }

  static false(...args: any[]){
    console.log('%c'+args.shift()+': ', 'color: orange', ...args)
  }
}