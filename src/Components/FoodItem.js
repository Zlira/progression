import React from 'react'


export default function FoodItem({xPos, yPos, radius}) {
  return <circle fill="black" cx={xPos + radius} cy={yPos + radius} r={radius} />
}