export {};

declare global {
  /**
   * If enhanced-timer is globally patched, this variable will be set to the version of enhanced-timer
   * You can use this to determine if enhanced-timer is globally patched
   */
  const ENHANCED_TIMER_VERSION: string;
}
