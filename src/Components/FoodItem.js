import React from 'react'

import {loader} from 'pixi.js'
import {Sprite} from 'react-pixi-fiber'


export default function FoodItem({xPos, yPos, radius}) {
  const texture = loader.resources['sprites/rock.png'].texture
  return <Sprite x={xPos} y={yPos} scale={2.4} texture={texture} />
}