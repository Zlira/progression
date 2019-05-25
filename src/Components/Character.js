import React from 'react'


export default function Character({xPosition, radius, children}) {
    return <g className='character-group' transform={`translate(${xPosition}, 0)`}>
      <circle r={radius} cx={0} cy={radius} fill='red'/>
      {children}
      <text x={0} y={radius} fill="white">25</text>
    </g>
}