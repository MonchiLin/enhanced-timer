# 一个靠谱的倒计时库

> [如何写一个靠谱的前端倒计时库](https://juejin.im/post/5e706477f265da57360ba65d)

> 这个库本人已经在生产环境中实践一年了，有足够灵活的使用方式和完善代码注释，如果有小伙伴在使用过程中遇到什么问题或者需要新的功能请在 issue 里面留言


## 安装

```
yarn add @monchilin/countdown
```



## 使用

参考 https://github.com/MonchiLin/countdown/tree/master/demo

```typescript
// 导入
import CountdownService from "./src";

// 实例化服务类，token 参考 other 部分
const service = new CountdownService({ token: "随机值" })

// 每次触发定时器的回掉
const doSome = (current) => {}

// 增加监听器
service.addListener(doSome)

// 开始倒计时（从 60 开始，每 1000 毫秒，减少 1，直到小于等于 0 结束）
service.countdown({
  from: 60,
  to: 0,
  step: 1,
  timeout: 1000,
})
```

## countdown() API
| Property | Type | Option | Description |
|-------------|----------|--------------|----------------------------------------------------------------|
|from|number|false|起始值|
|to|number|false|结束值|
|step|number|false|递减值|
|complete|function|true|倒计时结束的回调函数|
|start|function|true|倒计时开始的回调函数|
|timeout|number|true|倒计时的建个，单位为毫秒，默认为 1000|



### Other

#### 为什么我需要传入一个 token？
token 是本库对开发者的约束，一个好的程序应该避免定时器未被清除，而 token 则是避免这种情况发生的解决办法，详见文章这部分（TODO 补全）

