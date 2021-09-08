import { Component } from '@angular/core';
import { Countdown } from "@monchilin/countdown/es";

@Component({
  selector: 'countdown-example1',
  templateUrl: `./countdown-example1.html`
})
export class CountdownExample1 {
  value = 0

  continueable = false
  pauseable = false
  destroySource = ""
  destroyed = false

  get friendlySource() {
    if (!this.destroyed) {
      return ""
    }
    switch (this.destroySource) {
      case "automatic":
        return `自动销毁`
      case "manual":
        return `手动销毁`
    }
    return ""
  }

  get displayValue() {
    return this.value.toFixed(2)
  }

  countdown = new Countdown({
    timerConfig: {
      from: 0,
      to: 10
    },
    hooks: {
      onStart: () => {
        this.pauseable = true
        this.continueable = false
      },
      onPause: () => {
        this.pauseable = false
        this.continueable = true
      },
      onResume: () => {
        this.continueable = false
        this.pauseable = true
      },
      onUpdate: (value) => {
        this.value = value
      },
      onRestart: () => {
        this.pauseable = true
        this.continueable = false
      },
      onDestroy: (source) => {
        this.destroySource = source
        this.destroyed = true
        this.continueable = false
        this.pauseable = false
      }
    }
  })

}
