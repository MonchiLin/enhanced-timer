import React, { useEffect } from 'react'
import { useCountdown } from "./use-countdown";

export function HooksApi() {
  const countdown = useCountdown({
    timerConfig: {
      from: 5,
      to: 0,
      step: 1
    }
  })

  useEffect(() => {
    countdown.start()
  }, [])

  return (
    <>
      <p>
        <button type="button">
          当前值: {countdown.currentTime}
        </button>
      </p>
      <button disabled={!countdown.pauseable} onClick={countdown.pause}>暂停</button>
      <button onClick={countdown.resume}>恢复</button>
    </>
  )
}
