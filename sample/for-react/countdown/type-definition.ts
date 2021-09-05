export namespace CountdownTypeDefinition {
  export type CtorParameters = {
    config?: Config
    timerConfig: TimerConfig
    hooks?: Hooks
  }
  export type Hooks = {
    onStart?: () => void
    onCompleted?: () => void
    onRestart?: () => void
    onUpdate?: (time: number) => void
    onDestroy?: (source: "manual" | "automatic") => void
    onPause?: () => void
    onResume?: () => void
  }
  export type Task = (v: number) => void
  export type Source = "manual" | "automatic"
  export type Direction = "increase" | "decrease"
  export type Handle = {
    timer: number;
  }
  export type TimerConfig = {
    from: number;
    to: number;
    step?: number;
    delay?: number;
  }
  export type Config = {
    loggerLevel?: "none" | "debug" | "info"
    intervalImpl?: "interval" | "RAF"
    precision?: number;
  }

}
