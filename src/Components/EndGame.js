import React from 'react'



function EndGame(text) {
  return ({width, height}) => {
    return <g className="end-game-plate">
    <rect x={0} y={0} width={width} height={height} fill="grey" opacity={.6} />
    <text fill="white" x={width/2} y={height/2}>{text}</text>
  </g>
  }
}

export const Victory = EndGame('Перемога!!!')
export const Defeat = EndGame('Поразка!!!')