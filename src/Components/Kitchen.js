import React from 'react'
import {Sprite} from 'react-pixi-fiber'

import {loader} from 'pixi.js'

import {SCALE, GET_Y, GROUND_HEIGHT} from '../GameData/Options'


export default function Kitchen({width}) {
  const sheet = loader.resources['sprites/background.json']
  const kitchenSprite = sheet.textures['something_like_fire.png']
  // todo replace with new kitchen sprite
  return <Sprite texture={kitchenSprite}
            scale={SCALE} y={GET_Y(kitchenSprite, GROUND_HEIGHT)} x={8}/>
}