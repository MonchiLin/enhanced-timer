type TimerHandler = string | Function;

/**
 * Native Timer Functions
 */
export const nativeTimer = {
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout,
  setInterval: global.setInterval,
  clearInterval: global.clearInterval,
  setImmediate: global.setImmediate,
  clearImmediate: global.clearImmediate,
}

/**
 * Enhanced Timer Functions
 */
export const enhancedTimer = {
  setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number {
    return nativeTimer.setTimeout(handler, timeout, ...args);
  }
};
