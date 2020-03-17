import {useEffect, useRef, useState} from "react";
import CountdownService, {CountdownConfig} from "../../src";

type UseCountDownParameter = {
  initialValue;
  token?: string | number;
}

function useCountDown(
  {
    token = "",
    initialValue,
  }: UseCountDownParameter
) {
  const countdownRef = useRef(new CountdownService({token: token}));
  const [countdown, updateCountdown] = useState(initialValue);

  const open = (args: CountdownConfig) => {
    countdownRef.current.countdown(args)
  }

  const close = () => {
    countdownRef.current.destroy()
  }

  const suspend = () => {
    countdownRef.current.suspend()
  }

  const keepOn = () => {
    countdownRef.current.keepOn()
  }

  const restart = () => {
    countdownRef.current.restart()
  }

  useEffect(() => {
    countdownRef.current.addListener(updateCountdown)

    return () => {
      close()
    }
  }, [])

  return {
    countdown,
    updateCountdown,
    open,
    close,
    suspend,
    keepOn,
    restart,
  }
}

export {
  useCountDown,
  UseCountDownParameter
}
