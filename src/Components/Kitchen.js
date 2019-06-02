import React from 'react'
import {Sprite} from 'react-pixi-fiber'

import {loader} from 'pixi.js'


export default function Kitchen({width}) {
  const sheet = loader.resources['sprites/background.json']
  const kitchenSprite = sheet.textures['something_like_fire.png']
  // tood replace with normal sprite
  return <Sprite texture={kitchenSprite} scale={2.4} y={30} x={8}/>
}