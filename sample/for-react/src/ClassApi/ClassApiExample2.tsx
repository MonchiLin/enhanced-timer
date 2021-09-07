import React from 'react'
import { Button, Tag, Typography } from "antd";
import { Countdown } from '@monchilin/countdown/src';



class SendCaptcha extends React.Component<any, any> {

  state = {
    disabled: false,
    isFirst: false,
    value: 10
  }

  countdown = new Countdown({
    timerConfig: {
      from: 10,
      to: 0,
      step: 1,
      delay: 1000
    },
    hooks: {
      onUpdate: (value) => {
        this.setState({value})
      },
      onStart: () => {
        this.setState({isFirst: false, disabled: true})
      },
      onDestroy: () => {
        this.setState({disabled: false})
      }
    }
  })

  render() {
    const {disabled, isFirst, value} = this.state
    const countDownDisplayValue = value.toFixed(0)

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
      <Button disabled={disabled} onClick={() => this.countdown.start()}>
        {isFirst ? "发送" : "重新发送"}
      </Button>
    </>
  }
}

class UseStartDirectly extends React.Component<any, any> {
  state = {
    value: 10
  }

  componentDidMount() {
    Countdown.Start({
      timerConfig: {
        from: this.state.value,
        to: 0
      },
      hooks: {
        onUpdate: (value) => {
          this.setState({value})
        }
      }
    })
  }

  render() {
    return <>
      <Typography.Title level={2}>直接使用 Start 静态方法</Typography.Title>
      <Tag color={"green"}>
        倒计时值: {this.state.value}
      </Tag>
    </>
  }

}

export class ClassApiExample2 extends React.Component<any, any> {

  render() {
    return <>
      <Typography.Title level={2}>特性展示(ClassApi)</Typography.Title>
      <SendCaptcha/>
      <UseStartDirectly/>
    </>


  }
}
