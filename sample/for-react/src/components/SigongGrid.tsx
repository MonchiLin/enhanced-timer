import React from "react";
import "./SigongGrid.css"

type P = {
  TopLeft: React.FC
  TopRight: React.FC
  BottomLeft?: React.FC
  BottomRight?: React.FC
}

export function SigongGrid({TopLeft, TopRight, BottomLeft, BottomRight}: P) {
  return <div className="parent">
    <div className="row">
      <div className="column">
        {TopLeft?.({})}
      </div>
      <div className="column">
        {TopRight?.({})}
      </div>
    </div>
    <div className="row">
      <div className="column">
        {BottomLeft?.({})}
      </div>
      <div className="column">
        {BottomRight?.({})}
      </div>
    </div>
  </div>
}