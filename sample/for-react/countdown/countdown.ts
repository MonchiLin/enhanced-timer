import { CountdownTypeDefinition } from './type-definition';

const noop = () => null

const DEFAULT_CONFIG: Required<CountdownTypeDefinition.Config> = {
  precision: 100,
  intervalImpl: 'RAF',
  loggerLevel: "none",
};

const DEFAULT_HOOKS: Required<CountdownTypeDefinition.Hooks> = {
  onStart: noop,
  onCompleted: noop,
  onRestart: noop,
  onUpdate: noop,
  onDestroy: noop,
  onPause: noop,
  onResume: noop,
};

const TAG = '[countdown.service]'

type NorS = number | string

const arithmeticWrapper = (fn: (arg1: number, arg2: number) => number | string) => {
  return (arg1: NorS, arg2: NorS) => {
    if (typeof arg1 === "string") {
      arg1 = Number.parseFloat(arg1)
    }
    if (typeof arg2 === "string") {
      arg2 = Number.parseFloat(arg2)
    }
    const result = fn(arg1, arg2)
    return Number.parseFloat(result.toString())
  }
}

// https://www.jianshu.com/p/a026245661bb
const add = arithmeticWrapper((arg1: number, arg2: number) => {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
})

const sub = arithmeticWrapper((arg1: number, arg2: number) => {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
})

const mul = arithmeticWrapper((arg1: number, arg2: number) => {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
})


const div = arithmeticWrapper((arg1: number, arg2: number) => {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return (r1 / r2) * Math.pow(10, t2 - t1);
})

const setIntervalRAF = (fn: (...args: any[]) => void, delay: number) => {
  // 记录开始时间
  let start = new Date().getTime();
  // 创建一个对象保存 raf 的 timer 用于清除 raf
  const handle: CountdownTypeDefinition.Handle = {
    timer: 0,
  };

  // 创建一个闭包函数
  const loop = () => {
    // 每次储存 timer， 注意看，这里递归调用了 loop，这就是 raf 的用法
    handle.timer = requestAnimationFrame(loop);
    // loop 本次被调用的时间
    const current = new Date().getTime();
    // 计算距离上次调用 loop 过了多久 = 本次调用时间 - 起始时间
    const delta = current - start;
    // 如果 delta >= delay 就意味着已经经过 delay 的时间，将再次调用 fn
    if (delta >= delay) {
      fn();
      // 重新记录开始时间
      start = new Date().getTime();
    }
  };

  handle.timer = requestAnimationFrame(loop);
  return handle;
}

const supportRAF = typeof requestAnimationFrame === 'function';

export class Countdown {
  // 是否处于暂停状态，只提供 get，避免被修改
  get isPause() {
    return this._isPause
  };

  private _isPause = false

  /**
   * 当定时器到达 step 时执行的函数集合，可以添加多个
   * 这是一个私有函数，你不应该访问他，而是应该通过
   * @private
   */
  private tasks: CountdownTypeDefinition.Task[] = [];

  // 一些用于矫正时间的数据
  private timeForRectification = {
    // 启动定时器时的时间     = Date.getTime()
    thisStartUpTime: 0,
    // 本次定时器器开始时间   = Date.getTime()
    currentStartUpTime: 0,
    // 本次定时器器望结束时间  = 启动定时器时的时间 + (单位时间 * 1000) 乘 1000 是因为用的毫秒级时间戳
    //    单位时间 = 递减 ? (from - to) / step : (to - from) / step
    currentExpectedEndTime: 0
  };

  // 有可能使用 requestAnimationFrame 来模拟 setInterval 所以使用 timer 包一层
  private handle: CountdownTypeDefinition.Handle = {
    timer: 0,
  };

  // 储存倒计时的配置，用于暂停后恢复倒计时使用
  private timerConfig!: Required<CountdownTypeDefinition.TimerConfig>
  private currentTimerConfig!: Required<CountdownTypeDefinition.TimerConfig>
  private config = DEFAULT_CONFIG
  private hooks = DEFAULT_HOOKS

  private setInterval!: (fn: (...args: any[]) => void, delay: number) => { timer: number };
  private direction!: CountdownTypeDefinition.Direction


  /**
   * @param {CountdownTypeDefinition.Config} config                   - Countdown 类初始化配置文件
   * @param config.loggerLevel                                        - 日志级别，默认为 none
   *                                                                      none: 不打印
   *                                                                      debug: 打印日志
   *                                                                      info: 打印日志的同时打印当前实例
   * @param config.intervalImpl                                       - 定时器的实现，默认为 RAF，在不支持 RAF 时则会回退到 setInterval，如果指定为 RAF 但是环境不支持 RAF 也会回退到 setInterval
   *                                                                      interval: 使用默认的 scope.setInterval 实现，这是一种保守的实现方式，在浏览器/NodeJS/WeApp/UniApp 等大多数 JS 运行时都有实现
   *                                                                      RAF: 使用 requestAnimationFrame 实现，这种方式相较于 setInterval 可以实现更高的精度，但是仅在浏览器环境中有效，在 UniApp WeApp 等非标砖 JS 运行时不支持
   * @param config.precision                                          - 定时器精度，默认为 100 毫秒
   *
   * @param {CountdownTypeDefinition.Hooks} hooks                     - 生命周期函数
   * @param hooks.onStart                                             - 生命周期函数：当定时器被启动时调用 (不包括从暂停中回复)
   * @param hooks.onUpdate                                            - 生命周期函数：每次经过指定延迟 ( delay ) 后回调的函数，参数为当前倒计时的事件
   * @param hooks.onReStart                                           - 生命周期函数：当定时器重新启动时调用，并非从暂停后恢复
   * @param hooks.onDestroy                                           - 生命周期函数：当定时器被销毁时调用，如果是定时器正常结束销毁则参数为 "automatic"，如果是手动调用实例的 destroy 方法则为 "manual"
   * @param hooks.onPause                                             - 生命周期函数：当定时器被暂停时调用
   * @param hooks.onResume                                            - 生命周期函数：当定时器被从暂停中恢复时调用
   * @param hooks.onCompleted                                         - 生命周期函数：当定时器正常结束时调用
   *
   * @param {CountdownTypeDefinition.TimerConfig} timerConfig         - 定时器配置，如果 from 大于 to 则从 from 递减到 to，如果 from 小于 to 则从 from 递增到 to，如果 from 等于 to 则直接调用 completed 生命周期
   * @param timerConfig.from                                          - 定时器起始值
   * @param timerConfig.to                                            - 定时器截至值
   * @param timerConfig.step                                          - 每次改变时的值
   * @param timerConfig.delay                                         - 每次延迟的毫秒数
   *
   */
  constructor({config = {}, hooks = {}, timerConfig}: CountdownTypeDefinition.CtorParameters) {
    this.initialize({config, hooks, timerConfig})
  }

  private initialize({config, hooks, timerConfig}: CountdownTypeDefinition.CtorParameters) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.config.intervalImpl = (supportRAF && this.config.intervalImpl === 'RAF') ? 'RAF' : 'interval';

    // 若是在浏览器的环境中则默认使用 requestAnimationFrame 来实现，否则使用 setInterval 实现
    // 当然，若是手动指定定时器为 "setInterval" 则强制使用 setInterval
    this.setInterval =
      this.config.intervalImpl === 'RAF'
        ? setIntervalRAF
        : (fn, delay) => {
          const timer: number = setInterval(fn, delay) as any;
          return {timer};
        };

    this.hooks = {
      ...this.hooks,
      ...hooks
    }

    this.timerConfig = {
      step: 1,
      delay: 1000,
      ...timerConfig,
    }
    // 浅克隆
    this.currentTimerConfig = {...this.timerConfig}

    if (this.timerConfig.from > this.timerConfig.to) {
      this.direction = "decrease"
    } else if (this.timerConfig.from > this.timerConfig.to) {
      this.direction = "increase"
    }

    this._isPause = false
  }

  public static Start(config: CountdownTypeDefinition.CtorParameters) {
    const countdown = new Countdown(config)
    countdown.start()
    return countdown
  }

  /**
   * 终止当前 timer
   */
  private clearInterval = (): void => {
    this.log('clearRequestInterval');
    switch (this.config.intervalImpl) {
      case "interval":
        return clearInterval(this.handle.timer);
      case "RAF":
        return cancelAnimationFrame(this.handle.timer)
    }
  };

  private log(...args: any[]) {
    switch (this.config.loggerLevel) {
      case "none":
        return
      case "debug":
        return console.log(TAG + " ", ...args);
      case "info":
        return console.log(TAG + " ", ...args, this);
    }
  }

  start() {
    const {from, to, delay, step} = this.currentTimerConfig
    if (from === to) {
      return this.complete()
    }

    // 起始时间 = 当前时间
    this.timeForRectification.thisStartUpTime = new Date().getTime();

    // 这里乘 1000 是因为用的时间戳做对比
    this.timeForRectification.currentExpectedEndTime = this.timeForRectification.thisStartUpTime + delay

    // this.log('onStart');
    this.hooks.onStart();

    this.handle = this.setInterval(() => {
      if (this.IsCompleted) {
        this.hooks.onUpdate(this.currentTimerConfig.to)
        this.tasks.forEach((cb) => cb?.(this.currentTimerConfig.to));
        return this.complete()
      }

      // this.log('countdown loop currentFromValue =>', this.currentFromValue);
      const NotCompletedFromRectifyTime = this.rectifyTime()
      if (NotCompletedFromRectifyTime) {
        this.timeForRectification.currentExpectedEndTime = this.timeForRectification.currentExpectedEndTime + delay
        this.hooks.onUpdate(this.currentTimerConfig.from)
        this.tasks.forEach((cb) => cb?.(this.currentTimerConfig.from));
        this.currentTimerConfig.from = this.getNewCurrentFromValue()
      } else {
        debugger
        return this.complete()
      }
    }, delay);
  }

  private getNewCurrentFromValue() {
    const step = this.currentTimerConfig.step
    switch (this.direction) {
      case "decrease":
        return sub(this.currentTimerConfig.from, step)
      case "increase":
        return add(this.currentTimerConfig.from, step)
    }
  }

  /**
   * 如果 from 到 to 是递减的，则判断当前值是否大于 to
   * 如果 from 到 to 是递增的，则判断当前值是否小于 to
   *
   * @private
   * @return boolean
   */
  private get IsCompleted() {
    const to = this.currentTimerConfig.to
    switch (this.direction) {
      case "decrease":
        return this.currentTimerConfig.from <= to
      case "increase":
        return this.currentTimerConfig.from >= to
    }

  }

  /**
   * 增加一个 task，每次会被定时器回调
   * @param listener
   */
  addTask(listener: CountdownTypeDefinition.Task) {
    this.tasks.push(listener);
  }

  private complete() {
    this.clearInterval();
    this.hooks.onCompleted()
    this.hooks.onDestroy("automatic")
  }

  /**
   * 矫正时间，未到期返回 true，到期返回 false
   * @return boolean
   */
  private rectifyTime() {

    /**
     *
     * 例如当前数值为            5
     * 结束值                  0
     * 每次递减数值为            1
     *
     * 执行倒计时动作时的时间      12:00(中午12点)
     * 期望执行倒计时动作时的时间   12:05(中午12点05分)
     * 期望倒计时执行次数         5
     *
     * 假设执行了第一次
     * 实际执行到目前的时间 = 12:01，new Date().getTime()
     * 执行到现在的期望时间 = 12:01，
     * 偏移值            = 执行到现在的期望时间 - 实际执行到目前的时间
     *
     */

    const {delay, from} = this.currentTimerConfig
    const now = new Date().getTime();

    // 偏差 = 当前的倒计时 - 期望的当前剩余时间 / 1000 （因为期望的剩余时间是时间戳）
    const offset = sub(
      sub(now, this.timeForRectification.currentExpectedEndTime),
      delay
    )

    if (offset > 0) {
      const count = offset / delay
      // 检测少执行的次数
      debugger
    }

    // this.log('误差 =>', offset);
    // 处理离开屏幕太久的情况, 早就已经完成了倒计时，在调用函数的地方进行处理，若是返回 false 则认为已经倒计时结束
    if (offset > from) {
      return false;
    }

    // if (offset >= div(this.config.precision, 1000)) {
    //   // this.config.precision：精度
    //   // 如果误差已经大于容许的偏差则矫正一次当前的倒计时
    //   switch (this.direction) {
    //     case "decrease":
    //       this.currentTimerConfig.from -= offset
    //       break
    //     case "increase":
    //       this.currentTimerConfig.from += offset
    //       break
    //   }
    // }
    // console.log("leave", this.currentTimerConfig.from, offset)
    return true;
  }

  /**
   * 暂停当前倒计时
   */
  pause() {
    if (this._isPause) {
      this.log('it was _isPause');
    }
    if (this.timerConfig == null) {
      this.log('please call countdown() first');
    } else {
      this._isPause = true;
      this.clearInterval();
      this.hooks.onPause()
    }
  }

  /**
   * 继续当前倒计时
   * 使用外部 最后一次 调用 countdown 方法的参数，startTime 使用调用 suspend() 时的值
   */
  resume() {
    // 如果没有调用了暂停方法，或者 config 还没有值
    if (!this._isPause || !this.timerConfig) {
      this.log('please call pause() first');
    } else {
      this._isPause = false;
      this.hooks.onResume()
      this.start();
    }
  }

  /**
   * 重置定时器相关参数，然后重新调用
   */
  restart(ctorParameters: Partial<CountdownTypeDefinition.CtorParameters> = {}) {
    this.destroy()
    this.hooks.onRestart()
    const timerConfig = {...this.timerConfig, ...(ctorParameters.timerConfig || {})}
    const config = {...this.config, ...(ctorParameters.config || {})}
    const hooks = {...this.hooks, ...(ctorParameters.hooks || {})}
    this.initialize({timerConfig, config, hooks})
    this.start();
  }

  /**
   * 清理定时器
   */
  destroy() {
    this.log('destroy');
    // 有可能 handle 还不存在
    if (this.handle) {
      this.clearInterval();
      this.hooks.onDestroy("manual")
    }
  }
}