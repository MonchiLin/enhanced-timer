import React, { useEffect, useMemo, useState } from 'react'
import { useCountdown } from "../use-countdown";
import { Button, Tag, Typography } from "antd";
import { Countdown } from "@monchilin/countdown/src";

const SendCaptcha = () => {
  const [disabled, setDisabled] = useState(false)
  const [isFirst, setIsFirst] = useState(false)

  const countdown = useCountdown({
    timerConfig: {
      from: 10,
      to: 0,
      step: 1,
      delay: 1000
    },
    hooks: {
      onStart() {
        setIsFirst(false)
        setDisabled(true)
      },
      onDestroy() {
        setDisabled(false)
      }
    }
  })
  const countDownDisplayValue = useMemo(() => countdown.currentTime.toFixed(0), [countdown.currentTime])

  return <>
    <Typography.Title level={2}>发送验证码</Typography.Title>
    {
      disabled
        ? <Tag color={"green"}>
          剩余时间: {countDownDisplayValue}
        </Tag>
        : <Tag color={"green"}>
          等待发送
        </Tag>
    }
    <Button disabled={disabled} onClick={countdown.start}>
      {isFirst ? "发送" : "重新发送"}
    </Button>
  </>
}

const UseStartDirectly = () => {
  const [value, setValue] = useState(10)

  useEffect(() => {
    Countdown.Start({
      timerConfig: {
        from: value,
        to: 0
      },
      hooks: {
        onUpdate(value) {
          setValue(value)
        }
      }
    })
  }, [])

  return <>
    <Typography.Title level={2}>直接使用 Start 静态方法</Typography.Title>
    <Tag color={"green"}>
      倒计时值: {value}
    </Tag>
  </>
}

export function HooksApiExample2() {
  return (
    <Typography>
      <Typography.Title level={2}>特性展示(HooksApi)</Typography.Title>
      <SendCaptcha/>
      <UseStartDirectly/>
    </Typography>
  )
}
