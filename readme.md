# 基于配置的定时器管理器

> [实现原理：如何写一个靠谱的前端倒计时库](https://juejin.im/post/5e706477f265da57360ba65d)

## 快速上手

    yarn add @monchilin/countdown

### 使用

参考

```typescript
// 导入
import CountdownService from "./src";

// 实例化服务类，token 参考 other 部分
const service = new CountdownService({token: "随机值"})

// 每次触发定时器的回掉
const doSome = (current) => {
}

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

## 特性

-   [x] 毫秒级精度
-   [x] 自动校正时间
-   [x] 完整的定时器管理(暂停/恢复)
-   [x] 可快速上手的语义化 API 设计，完全符合直觉
-   [x] 自动清除结束的定时器(`clearInterval`)
-   [x] 完全使用 TypeScript 编写，编译时保证类型安全
-   [x] React 版全功能示例(包含 Hooks 和 Class)
-   [ ] Vue 版全功能示例(包含 Option 和 CompositionApi)
-   [ ] Angular2+ 版全功能示例

## 构造函数参数

### Countdown 参数

| 名称           | 描述                                                                                  | 类型签名                        | 默认值    | 可选  |
| ------------ | ----------------------------------------------------------------------------------- | --------------------------- | ------ | --- |
| loggerLevel  | 日志级别 none: 不打印 debug: 打印日志 info: 打印日志的同时打印当前实例                                      | "none" \| "debug" \| "info" | "none" | √   |
| intervalImpl | 定时器的实现，默认为 RAF，在不支持 RAF 时则会回退到 setInterval，如果指定为 RAF 但是环境不支持 RAF 也会回退到 setInterval。 | "interval" \| "RAF"         | "RAF"  | √   |
| precision    | 定时器精度                                                                               | number                      | 100    | √   |

### 定时器参数

- 如果 from 大于 to 则从 from 递减到 to
- 如果 from 小于 to 则从 from 递增到 to
- 如果 from 等于 to 则直接调用 completed 生命周期

| 名称    | 描述       | 类型签名   | 默认值  | 可选  |
| ----- | -------- | ------ | ---- | --- |
| from  | 定时器起始值   | number |      | ×   |
| to    | 定时器截至值   | number |      | ×   |
| step  | 每次改变时的值  | number | 1    | √   |
| delay | 每次延迟的毫秒数 | number | 1000 | √   |

### 生命周期参数

注：生命周期只会在对应的事件触发成功才会执行，例如调用了 `resume` 方法，但是并没有先调用 `pause` (暂停)，那么是不会执行 `onResume` 生命周期的。=

| 名称          | 描述                                                                       | 类型签名                                        | 可选  |
| ----------- | ------------------------------------------------------------------------ | ------------------------------------------- | --- |
| onStart     | 当定时器被启动时调用 (不包括从暂停中回复)                                                   | () => void                                  | √   |
| onUpdate    | 每次经过指定延迟 ( delay ) 后回调的函数，参数为当前倒计时的事                                     | () => void                                  | √   |
| onRestart   | 当定时器重新启动时调用，并非从暂停后恢复                                                     | () => void                                  | √   |
| onDestroy   | 当定时器被销毁时调用，如果是定时器正常结束销毁则参数为 "automatic"，如果是手动调用实例的 destroy 方法则为 "manual" | (time: number) => void                      | √   |
| onPause     | 当定时器被暂停时调用                                                               | (source: "manual"   \| "automatic") => void | √   |
| onResume    | 当定时器被从暂停中恢复时调用                                                           | () => void                                  | √   |
| onCompleted | 当定时器正常结束时调用                                                              | () => void                                  | √   |



## 从 0.x 版本迁移到 1.0

这个库最初的版本设计之初作者某些 API 设计不够语义化，并且缺少部分 API，恰好这段时间有空做了一个大版本的重构，原有 API 进行了一些改变。

不过值得庆幸的是因为原有的思路设计已经足够成熟，所以大多数变化都是重命名和移动位置。

### 重命名

-   CountdownService -> Countdown，因为作者在项目中一般会将比较复杂的类命名为 XXService，但是这作为一个库的命名显然有些 不够合理，所以去掉了 `Service` 部分。
-   timeout -> delay，思来想去发现还是和 setInterval 参数名保持一些更好，这样可以避免使用者增加心智负担，而且更加符合直觉。
-   countdown -> start，为了和生命周期函数保持一致，重命名启动倒计时的方法名为 start，并且将参数转为构造函数传入。

### 移除构造函数的 token 参数

这个参数设计之初为了处理 Countdown 实例丢失，也可以手动清除定时器，并且避免产生重复的定时器，所以开放了一个叫做 `token` 的参数，
但是作者在使用的过程中也发觉这个参数不够友好，使用者在传入这个参数时还需要考虑参数是否唯一的问题，不然就会误伤已经在执行的定时器， 
而且 Countdown 实例都丢失了 token 也基本上不会在找到了，所以索性移除了这个设计。

### 移动 countdown 函数的 start 和 complete 参数到生命周期参数

原有的设计思路就是单纯的为定时器增加两个回调，在开始定时器和结束定时器时回调，在项目中推广时发现从开发角度设计简单实用的 api， 从使用者的角度却发现并不如意，恰好 `Vue`
的生命周期设计启发了我，最后我将常用的[生命周期](#生命周期)整理在一起，这样看起来整齐了很多 Yeah!

### 新特性

- 增加 from 比 to 小的情况处理，作为递增处理

## Others

q: 为什么不使用 Web Worker 避免切换标签时间出错？ a: 因为兼容性。

