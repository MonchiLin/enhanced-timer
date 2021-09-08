import { Component } from '@angular/core';
import { Countdown } from "@monchilin/countdown/es";

@Component({
  selector: 'countdown-example2',
  templateUrl: `./countdown-example2.html`
})
export class CountdownExample2 {

  disabled = false
  isFirst = false
  value = 10

  get countDownDisplayValue() {
    return this.value.toFixed(2)
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
        this.value = value
      },
      onStart: () => {
        this.isFirst = false
        this.disabled = true
      },
      onDestroy: () => {
        this.disabled = false
      }
    }
  })


  countdown2: Countdown
  value2 = 10

  constructor() {
    this.countdown2 = Countdown.Start({
      timerConfig: {
        from: 10,
        to: 0,
      },
      hooks: {
        onUpdate: (value) => {
          this.value2 = value
        }
      }
    })
  }


}
