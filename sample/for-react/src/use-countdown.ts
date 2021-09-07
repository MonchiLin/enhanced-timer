import { useRef, useState } from "react";
import { Countdown, CountdownTypeDefinition } from "@monchilin/countdown/src";

export const useCountdown = (ctorParameters: CountdownTypeDefinition.CtorParameters) => {
  const [pauseable, setPauseable] = useState(true)
  const [continueable, setContinueable] = useState(false)
  const [currentTime, setCurrentTime] = useState(ctorParameters.timerConfig.from)
  const [destroyed, setDestroyed] = useState(false)
  const [destroySource, setDestroySource] = useState<CountdownTypeDefinition.Source | undefined>()
  const countdown = useRef(new Countdown({
    ...ctorParameters,
    hooks: {
      ...(ctorParameters.hooks || {}),
      onStart() {
        ctorParameters.hooks?.onStart?.()
        setDestroyed(false)
      },
      onUpdate(time) {
        ctorParameters.hooks?.onUpdate?.(time)
        setCurrentTime(time)
      },
      onPause() {
        ctorParameters.hooks?.onPause?.()
        setPauseable(false)
        setContinueable(true)
      },
      onResume() {
        ctorParameters.hooks?.onResume?.()
        setPauseable(true)
        setContinueable(false)
      },
      onDestroy(source) {
        ctorParameters.hooks?.onDestroy?.(source)
        setDestroyed(true)
        setDestroySource(source)
      }
    }
  }))

  const start = countdown.current.start.bind(countdown.current)
  const pause = countdown.current.pause.bind(countdown.current)
  const resume = countdown.current.resume.bind(countdown.current)
  const restart = countdown.current.restart.bind(countdown.current)
  const destroy = countdown.current.destroy.bind(countdown.current)

  return {
    pauseable,
    continueable,
    currentTime,
    start,
    pause,
    resume,
    restart,
    destroy,
    destroyed,
    destroySource,
  }
}