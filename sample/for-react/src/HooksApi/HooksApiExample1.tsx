import React, { useMemo } from 'react'
import { useCountdown } from "../use-countdown";
import { Button, Col, Row, Tag, Typography } from "antd";

export function HooksApiExample1() {
  const countdown = useCountdown({
    timerConfig: {
      from: 0,
      to: 10,
      step: 1,
      delay: 1000
    },
    config: {
      loggerLevel: "debug"
    }
  })

  const displayValue = useMemo(() => countdown.currentTime.toFixed(2), [countdown.currentTime])
  const friendlySource = useMemo(() => {
    if (!countdown.destroyed) {
      return ""
    }
    switch (countdown.destroySource) {
      case "automatic":
        return `自动销毁`
      case "manual":
        return `手动销毁`
    }
  }, [countdown.destroySource, countdown.destroyed])

  return (
    <Typography>
      <Typography.Title level={2}>基础功能演示（HooksApi）</Typography.Title>
      <Tag color={"blue"}>
        当前值: {displayValue}
      </Tag>
      <Col>
        <Row><Button onClick={countdown.start}>开始</Button></Row>
        <Row><Button disabled={!countdown.pauseable} onClick={countdown.pause}>暂停</Button></Row>
        <Row><Button disabled={!countdown.continueable} onClick={countdown.resume}>恢复</Button></Row>
        <Row><Button onClick={countdown.destroy}>手动销毁</Button>{ countdown.destroyed && <Tag color="magenta">销毁方式: {friendlySource}</Tag> }</Row>
        <Row><Button onClick={() => countdown.restart()}>重置</Button></Row>
      </Col>
    </Typography>
  )
}
