import React from 'react'


export default function FoodItems({xPos, yPos, children}) {
  return <g
    className="food-items"
    transform={`translate(${xPos}, ${yPos})`}>
    <line x1='0' x2='0' y1='0' y2='40' stroke='black'/>
    {children}
  </g>
}