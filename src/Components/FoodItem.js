import React from 'react'


export default function FoodItem({xPos, yPos, radius}) {
  return <circle fill="black" stroke="green" cx={xPos} cy={yPos} r={radius} />
}