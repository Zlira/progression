import React from 'react'


export default function Character({xPosition, radius, children}) {
    return <g className='character-group' transform={`translate(${xPosition}, 0)`}>
      <circle r={radius} cx={radius} cy={radius} fill='red'/>
      {children}
      <text x={radius*.5} y={radius*1.5} fill="white">25</text>
    </g>
}