import React from 'react'

import Rectangle from './CustomPixiComponents/Rectangle'
import {Container, Text} from 'react-pixi-fiber'
import {GAME_WIDTH, GAME_HEIGHT, BG_COLOR} from '../GameData/Options'


function EndGame(text) {
  return () => {
    const textStyle = {
      fill: BG_COLOR,
      fontFamily: 'Press Start 2P',
      fontSize: '26px',
    }
    return <Container>
      <Rectangle width={GAME_WIDTH} height={GAME_HEIGHT} alpha={.5}
        fill={0xffffff}/>
      <Text style={textStyle} text={text} anchor={{x: .5, y: .5}}
        x={GAME_WIDTH/2} y={GAME_HEIGHT/2}/>
    </Container>
  }
}

export const Victory = EndGame('Перемога!!!')
export const Defeat = EndGame('Поразка!!!')