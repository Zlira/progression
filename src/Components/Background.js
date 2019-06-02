import React from 'react'
import {Container, Sprite, TilingSprite} from 'react-pixi-fiber'
import {GAME_WIDTH} from '../GameData/Options'

import * as PIXI from 'pixi.js'

const flower1Posistions = [...Array(4).keys()].map(
  () => Math.round(Math.random() * GAME_WIDTH)
)
const flower2Posistions = [...Array(6).keys()].map(
  () => Math.round(Math.random() * GAME_WIDTH)
)

function getRandomEnvObjects(texture, positions, width, y, scale) {
  return positions.map(
    (pos, i) => <Sprite texture={texture} scale={scale}
        x={pos} y={y} key={i}/>
  )
}

export default function Background({width}) {
  const scale = 2.4
  const Y = 65
  const sheet = PIXI.loader.resources['sprites/background.json'].spritesheet
  const groundTexture = sheet.textures['ground.png']
  const flowerTexture1 = sheet.textures['flowers_1.png']
  const flowerTexture2 = sheet.textures['flowers_2.png']
  const flowers1 = getRandomEnvObjects(
    flowerTexture1, flower1Posistions, width, Y - 16 * scale + 1, scale
  )
  const flowers2 = getRandomEnvObjects(
    flowerTexture2, flower2Posistions, width, Y - 16 * scale + 1, scale
  )
  return <Container>
      <TilingSprite
        texture={groundTexture}
        scale={scale} x={0} y={Y}
        width={width}/>
      {flowers1}{flowers2}
    </Container>

}