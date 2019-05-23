import React from 'react'

import Character from './Character'
import FoodItem from './FoodItem'
import FoodItems from './FoodItems'

const GAME_WIDTH = 1000
const GAME_HEIGHT = 200
const SPEED = 2
const CHAR_RADIUS = 30
const FOOD_RADIUS = 16

const LEFT_CODE = 37
const RIGHT_CODE = 39


const LEVEL = {
  itemsCount: 3,
  distanceBetweenItems: 200,
  distanceToFirstItem: 100
}


export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      characterPosition: 0,
    }
    this.moveCharacter = this.moveCharacter.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
  }

  handleKeydown(event) {
    const which = event.which
    if (which === LEFT_CODE) {
      this.moveCharacter(-SPEED)
    } else if (which === RIGHT_CODE) {
      this.moveCharacter(SPEED)
    }
  }

  moveCharacter(velocity) {
    let newPosition = this.state.characterPosition + velocity
    newPosition = Math.max(newPosition, 0)
    newPosition = Math.min(newPosition, GAME_WIDTH - CHAR_RADIUS * 2)
    if (newPosition !== this.state.characterPosition) {
      this.setState({characterPosition: newPosition})
    }
  }

  render() {
    const foodItems = [...Array(LEVEL.itemsCount).keys()].map(
      i => <FoodItem radius={FOOD_RADIUS}
              xPos={LEVEL.distanceToFirstItem
                    + LEVEL.distanceBetweenItems * i
                    + FOOD_RADIUS}
              yPos={0}
              key={i}/>
    )
    return <svg
      focusable={true} xmlns="http://www.w3.org/2000/svg"
      width={GAME_WIDTH} height={GAME_HEIGHT} tabIndex={0}
      onKeyDown={this.handleKeydown}
      >
        <FoodItems xPos={CHAR_RADIUS * 2} yPos={2 * CHAR_RADIUS - FOOD_RADIUS}>
          {foodItems}
        </FoodItems>
        <Character xPosition={this.state.characterPosition}
          radius={CHAR_RADIUS}
        />
      </svg>
  }
}

