import React, { useMemo } from 'react'
import { Countdown } from "@monchilin/countdown/src";
import { Button, Col, Row, Tag, Typography } from "antd";
import { CountdownTypeDefinition } from "@monchilin/countdown/src";

const {Title, Paragraph, Text, Link} = Typography;

type State = {
  currentValue: number
  pauseable: boolean
  continueable: boolean
  destroyed: boolean
  destroySource: CountdownTypeDefinition.Source | ""
}

export class ClassApiExample1 extends React.Component<any, State> {
  countdown: Countdown

  constructor(props: any) {
    super(props);
    this.state = {
      currentValue: 0,
      pauseable: false,
      continueable: false,
      destroyed: false,
      destroySource: ""
    }
    this.countdown = new Countdown({
      timerConfig: {
        from: 0,
        to: 10,
        step: 1,
        delay: 1000
      },
      hooks: {
        onUpdate: value => {
          this.setState({currentValue: value})
        },
        onStart: () => {
          this.setState({pauseable: true})
        },
        onPause: () => {
          this.setState({continueable: true, pauseable: false})
        },
        onResume: () => {
          this.setState({continueable: false, pauseable: true})
        },
        onDestroy: (source) => {
          this.setState({continueable: false, pauseable: true, destroyed: true, destroySource: source})
        }
      }
    })
  }

  render() {
    const {continueable, destroyed, pauseable, currentValue, destroySource} = this.state

    const displayValue = currentValue.toFixed(2)
    let friendlySource = ""
    if (destroySource) {
      if (destroySource === "manual") {
        friendlySource = "手动销毁"
      } else {
        friendlySource = `自动销毁`
      }
    }

    return <Typography>
      <Title level={2}>基础功能演示(ClassApi)</Title>
      <Tag color={"blue"}>
        当前值: {displayValue}
      </Tag>
      <Col>
        <Row><Button onClick={() => this.countdown.start()}>开始</Button></Row>
        <Row><Button disabled={!pauseable} onClick={() => this.countdown.pause()}>暂停</Button></Row>
        <Row><Button disabled={!continueable} onClick={() => this.countdown.resume()}>恢复</Button></Row>
        <Row><Button onClick={() => this.countdown.destroy()}>手动销毁</Button>
          {
            destroyed && <Tag color="magenta">销毁方式: {friendlySource}</Tag>
          }
        </Row>
        <Row><Button onClick={() => this.countdown.restart()}>重置</Button></Row>
      </Col>
    </Typography>
  }
}