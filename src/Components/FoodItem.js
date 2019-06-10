import React from 'react'

import {loader} from 'pixi.js'
import {Sprite} from 'react-pixi-fiber'

import {SCALE, GET_Y, GROUND_HEIGHT} from '../GameData/Options'


export default function FoodItem({xPos, yPos, name}) {
  const sheet = loader.resources['sprites/food.json'].spritesheet
  const texture = sheet.textures[name + '.png']
  yPos = yPos || GET_Y(texture, GROUND_HEIGHT)
  return <Sprite x={xPos} y={yPos}
          scale={SCALE} texture={texture} />
}