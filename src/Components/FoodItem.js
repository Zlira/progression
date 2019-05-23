import React from 'react'


export default function FoodItem({xPos, yPos, radius}) {
  return <circle fill="black" cx={xPos} cy={yPos} r={radius} />
}