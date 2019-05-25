import React from 'react'


export default function FoodItems({xPos, yPos, children}) {
  return <g
    className="food-items"
    transform={`translate(${xPos}, ${yPos})`}>
    {children}
  </g>
}