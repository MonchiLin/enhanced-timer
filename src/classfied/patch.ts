import PackageJSON from "../../package.json";
import {enhancedTimer, nativeTimer} from "../enhanced-timer";

/**
 * Setup enhanced-timer globally
 * @returns {void}
 */
export function setup() {
  const globalObject = (typeof window !== "undefined" ? window : global) as any;

  if (globalObject.ENHANCED_TIMER_VERSION) {
    return;
  }

  globalObject.ENHANCED_TIMER_VERSION = PackageJSON.version;
  Object.assign(globalObject, enhancedTimer);
}

/**
 * Revert enhanced-timer globally
 */
export function revert() {
  const globalObject = (typeof window !== "undefined" ? window : global) as any;

  if (globalObject.ENHANCED_TIMER_VERSION) {
    return;
  }

  globalObject.ENHANCED_TIMER_VERSION = undefined;
  Object.assign(globalObject, nativeTimer);
}
