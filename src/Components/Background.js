import React from 'react'
import {Container, Sprite, TilingSprite} from 'react-pixi-fiber'
import {
  GAME_WIDTH, GAME_HEIGHT, SCALE, GROUND_HEIGHT, PIXI_OPS, GET_Y
} from '../GameData/Options'

import * as PIXI from 'pixi.js'

const flower1Positions = [...Array(4).keys()].map(
  () => Math.round(Math.random() * GAME_WIDTH)
)
const flower2Positions = [...Array(6).keys()].map(
  () => Math.round(Math.random() * GAME_WIDTH)
)

function getRandomEnvObjects(texture, positions, y, scale) {
  return positions.map(
    (pos, i) => <Sprite texture={texture} scale={scale}
        x={pos} y={y} key={i}/>
  )
}

export default function Background({width}) {
  const y = GAME_HEIGHT - GROUND_HEIGHT
  const sheet = PIXI.loader.resources['sprites/background.json'].spritesheet
  const groundTexture = sheet.textures['ground.png']
  const flowerTexture1 = sheet.textures['flowers_1.png']
  const flowerTexture2 = sheet.textures['flowers_2.png']
  const flowersY = GET_Y(flowerTexture1, GROUND_HEIGHT) + 1
  const flowers1 = getRandomEnvObjects(
    flowerTexture1, flower1Positions, flowersY, SCALE
  )
  const flowers2 = getRandomEnvObjects(
    flowerTexture2, flower2Positions, flowersY, SCALE
  )
  return <Container>
      <TilingSprite
        texture={groundTexture}
        scale={SCALE} x={0} y={GAME_HEIGHT - GROUND_HEIGHT}
        height={groundTexture.orig.height}
        width={width}/>
      {flowers1}{flowers2}
    </Container>

}