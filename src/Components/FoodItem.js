import React from 'react'

import {loader} from 'pixi.js'
import {Sprite} from 'react-pixi-fiber'


export default function FoodItem({xPos, yPos, name}) {
  const sheet = loader.resources['sprites/food.json'].spritesheet
  const texture = sheet.textures[name + '.png']
  return <Sprite x={xPos} y={yPos} scale={2.4} texture={texture} />
}