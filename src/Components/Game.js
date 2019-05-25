import React from 'react'

import Character from './Character'
import FoodItem from './FoodItem'
import FoodItems from './FoodItems'
import Kitchen from './Kitchen'

const GAME_WIDTH = 1000
const GAME_HEIGHT = 200
const SPEED = 2
const CHAR_RADIUS = 30
const FOOD_RADIUS = 16
const START_OFFSET = CHAR_RADIUS * 2
const INIT_ENERY = 100
const ENERGY_LOST_PER_TICK = .1

const LEFT_CODE = 37
const RIGHT_CODE = 39
const SPACE_CODE = 32


const LEVEL = {
  itemsCount: 3,
  distanceBetweenItems: 200,
  distanceToFirstItem: 100,
  reward: 70
}


export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      characterPosition: CHAR_RADIUS,
      characterWithFood: false,
      characterEnergy: INIT_ENERY,
      foodItems: [...Array(LEVEL.itemsCount).keys()].map(
        i => ({index: i,
               position: LEVEL.distanceToFirstItem
                         + LEVEL.distanceBetweenItems * i
                         + START_OFFSET
                         + FOOD_RADIUS})
      ),
    }

    this.moveCharacter = this.moveCharacter.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.toggleWithFood = this.toggleWithFood.bind(this)
    this.putDownFood = this.putDownFood.bind(this)
    this.pickUpFood = this.pickUpFood.bind(this)
    this.findNearbyFood = this.findNearbyFood.bind(this)
    this.rewardShouldBeGranted = this.rewardShouldBeGranted.bind(this)
  }

  handleKeydown(event) {
    const which = event.which
    if (which === LEFT_CODE) {
      this.moveCharacter(-SPEED)
    } else if (which === RIGHT_CODE) {
      this.moveCharacter(SPEED)
    } else if (which === SPACE_CODE) {
      this.toggleWithFood()
    }
  }

  moveCharacter(velocity) {
    let newPosition = this.state.characterPosition + velocity
    newPosition = Math.max(newPosition, 0)
    newPosition = Math.min(newPosition, GAME_WIDTH - CHAR_RADIUS * 2)
    if (newPosition !== this.state.characterPosition) {
      this.setState({
        characterPosition: newPosition,
        // decrement energy
        characterEnergy: this.state.characterEnergy - ENERGY_LOST_PER_TICK
      })
    }
  }

  rewardShouldBeGranted() {
    return this.state.foodItems.reduce(
      (acc, item) => acc && item.position < CHAR_RADIUS * 2,
      true
    )
  }

  grantReward() {
    this.setState({
      characterEnergy: this.state.characterEnergy + LEVEL.reward
    })
  }

  putDownFood() {
    const newItems = Array.from(this.state.foodItems)
    const newItem = this.state.characterWithFood
    newItem.position = this.state.characterPosition
    newItems.push(newItem)
    this.setState({
      characterWithFood: false,
      foodItems: newItems,
    })
    if (this.rewardShouldBeGranted()) {
      this.grantReward()
    }
  }

  findNearbyFood() {
    let item
    for (let i=0; i < this.state.foodItems.length; i++) {
      item = this.state.foodItems[i]
      if (
        Math.abs(item.position - this.state.characterPosition) <
        FOOD_RADIUS + CHAR_RADIUS
      ) {
        return [i, item]
      }
    }
  }

  pickUpFood() {
    const nearbyFood = this.findNearbyFood()
    if (!nearbyFood) {return}
    const [foodIndex, foodItem] = nearbyFood
    const newItems = Array.from(this.state.foodItems)
    newItems.splice(foodIndex, 1)
    this.setState({
      foodItems: newItems,
      characterWithFood: foodItem,
    })
  }

  toggleWithFood() {
    if (this.state.characterWithFood) {
      this.putDownFood()
    } else {
      this.pickUpFood()
    }
  }

  render() {
    const foodItems = this.state.foodItems.map(
      i => <FoodItem radius={FOOD_RADIUS}
              xPos={i.position}
              yPos={0}
              key={i.index}/>
    )
    return <svg
      focusable={true} xmlns="http://www.w3.org/2000/svg"
      width={GAME_WIDTH} height={GAME_HEIGHT} tabIndex={0}
      onKeyDown={this.handleKeydown}
      >
        <Kitchen width={CHAR_RADIUS * 2}/>
        <FoodItems xPos={0} yPos={2 * CHAR_RADIUS - 2*FOOD_RADIUS}>
          {foodItems}
        </FoodItems>
        <Character xPosition={this.state.characterPosition}
          radius={CHAR_RADIUS} energy={Math.ceil(this.state.characterEnergy)}
        >
          {this.state.characterWithFood
            ? <FoodItem radius={FOOD_RADIUS} xPos={0} yPos={CHAR_RADIUS}/>
            : null}
        </Character>
      </svg>
  }
}