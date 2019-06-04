import React from 'react'

import Rectangle from './CustomPixiComponents/Rectangle'
import FoodItem from './FoodItem'
import { Sprite, Container } from 'react-pixi-fiber';
import {loader} from 'pixi.js'


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
    const scale = this.props.radius * 2 / texture.orig.width
    const {direction} = this.props
    const energyBarWidth = Math.round(50 * this.props.energy / 100)
    return <Container x={this.props.xPosition}><Sprite
      texture={texture}
      anchor={{x: .5, y: 0}}
      scale={{x: direction? scale * direction : scale, y: scale}}
      y={10}
      />
      <Rectangle width={energyBarWidth} height={4} y={5} x={-20} fill={0xffdf0f} />
      {this.props.food
        ? <FoodItem yPos={20} name={this.props.food.name} xPos={this.props.direction === -1? -35 : 0}/>
        : null}
      </Container>
  }
}
//<g className='character-group' transform={`translate(${xPosition}, 0)`}>
//      <circle r={radius} cx={0} cy={radius} fill='red'/>
//      {children}
//      <text x={0} y={radius} fill="white">{energy}</text>
//    </g>
