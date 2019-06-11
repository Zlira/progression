import React from 'react'

import Rectangle from './CustomPixiComponents/Rectangle'
import FoodItem from './FoodItem'
import { Sprite, Container, Text } from 'react-pixi-fiber';
import {loader} from 'pixi.js'
import {SCALE, GET_Y, CHAR_WIDTH, GROUND_HEIGHT, INIT_ENERGY} from '../GameData/Options'


export default class Character extends React.Component {
  constructor(props) {
    super(props)
    this.runningTextures = [3, 5]
    this.state = {
      textureIndex: 0,
      intervalIndex: null,
    }
  }

  componentDidUpdate() {
    if (this.props.direction === 0 && this.state.intervalIndex) {
      clearInterval(this.state.intervalIndex)
      this.setState({textureIndex: 0, intervalIndex: null})
    } else if (this.props.direction !== 0 && !this.state.intervalIndex) {
      const intervalIndex = setInterval(
        () => this.setState(prevState => ({
          textureIndex: (prevState.textureIndex ===4? 5 : 4)
        })), 350
      )
      this.setState({
        textureIndex: 4,
        intervalIndex: intervalIndex,
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalIndex)
  }

  render() {
    const sheet = loader.resources["sprites/spritesheet.json"].spritesheet
    const textures = Object.values(sheet.textures)
    const texture = textures[this.state.textureIndex]
    const {direction} = this.props
    const characterY = GET_Y(texture, GROUND_HEIGHT) + 3
    return <Container x={this.props.xPosition}><Sprite
      texture={texture}
      anchor={{x: .5, y: 0}}
      scale={{x: direction? SCALE * direction : SCALE, y: SCALE}}
      y={characterY}
      />
      <EnergyIndicator energy={this.props.energy} x={-CHAR_WIDTH/2 + 10} y={characterY - 10}/>
      {this.props.food
        ? <FoodItem yPos={characterY + 10} xPos={this.props.direction === -1? -35 : 0}
           name={this.props.food.name} />
        : null}
      </Container>
  }
}


function EnergyIndicator({x, y, energy}) {
  const energyBarWidth = Math.round((CHAR_WIDTH - 20) * energy / INIT_ENERGY)
  const color = 0xffe859
  const textStyle = {
    fill: color,
    fontFamily: 'Press Start 2P',
    fontSize: '12px',
  }
  return <Container y={y} x={x} >
    <Text text={energy} style={textStyle} y={-16}/>
    <Rectangle width={energyBarWidth} height={4} fill={color} />
  </Container>
}