import { useRef, useState } from "react";
import { Countdown, CountdownTypeDefinition } from "../countdown";

export const useCountdown = (ctorParameters: CountdownTypeDefinition.CtorParameters) => {
  const [pauseable, setPauseable] = useState(true)
  const [currentTime, setCurrentTime] = useState(ctorParameters.timerConfig.from)
  const countdown = useRef(new Countdown({
    ...ctorParameters,
    hooks: {
      ...(ctorParameters.hooks || {}),
      onUpdate(time) {
        ctorParameters.hooks?.onUpdate?.(time)
        setCurrentTime(time)
      },
      onPause() {
        ctorParameters.hooks?.onPause?.()
        setPauseable(false)
      },
      onResume() {
        ctorParameters.hooks?.onResume?.()
        setPauseable(true)
      },
    }
  }))

  const start = countdown.current.start.bind(countdown.current)
  const pause = countdown.current.pause.bind(countdown.current)
  const resume = countdown.current.resume.bind(countdown.current)
  const addTask = countdown.current.addTask.bind(countdown.current)
  const restart = countdown.current.restart.bind(countdown.current)

  return {
    pauseable,
    currentTime,
    start,
    pause,
    resume,
    addTask,
    restart,
  }
}