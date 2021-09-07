import React from "react";
import "./SigongGrid.css"

type P = {
  TopLeft?: React.ComponentType
  TopRight?: React.ComponentType
  BottomLeft?: React.ComponentType
  BottomRight?: React.ComponentType
}

export function SigongGrid({TopLeft, TopRight, BottomLeft, BottomRight}: P) {
  return <div className="parent">
    <div className="row">
      <div className="column">
        {TopLeft && <TopLeft/>}
      </div>
      <div className="column">
        {TopRight && <TopRight/>}
      </div>
    </div>
    <div className="row">
      <div className="column">
        {BottomLeft && <BottomLeft/>}
      </div>
      <div className="column">
        {BottomRight && <BottomRight/>}
      </div>
    </div>
  </div>
}