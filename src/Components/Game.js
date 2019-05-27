import React from 'react'

import Character from './Character'
import FoodItem from './FoodItem'
import FoodItems from './FoodItems'
import Kitchen from './Kitchen'
import {Defeat, Victory} from './EndGame'
import {LEVELS} from '../GameData/Levels'

const GAME_WIDTH = 1000
const GAME_HEIGHT = 60
const SPEED = 2
const CHAR_RADIUS = 30
const FOOD_RADIUS = 16
const START_OFFSET = CHAR_RADIUS * 2
const INIT_ENERY = 100
const ENERGY_LOST_PER_TICK = .1
const SLEEP_COST = 50

const LEFT_CODE = 37
const RIGHT_CODE = 39
const SPACE_CODE = 32
const S_CODE = 83
const GAME_STATES = {
  playing: 'playing',
  won: 'won',
  lost: 'lost'
}


function getFoodItmesFromLevel(level) {
  return [...Array(level.itemsCount).keys()].map(
        i => ({index: i,
               position: level.distanceToFirstItem
                         + level.distanceBetweenItems * i
                         + START_OFFSET
                         + FOOD_RADIUS})
  )
}


function getLevelCost(level) {
  const a_1 = level.distanceToFirstItem
  const d = level.distanceBetweenItems
  const n = level.itemsCount
  return (a_1 * 2 + d * (n - 1)) * n
}


export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      characterPosition: CHAR_RADIUS,
      characterWithFood: false,
      characterEnergy: INIT_ENERY,
      gameState: GAME_STATES.playing,
      foodItems: getFoodItmesFromLevel(LEVELS[0]),
      level: 0
    }

    this.moveCharacter = this.moveCharacter.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.toggleWithFood = this.toggleWithFood.bind(this)
    this.putDownFood = this.putDownFood.bind(this)
    this.pickUpFood = this.pickUpFood.bind(this)
    this.findNearbyFood = this.findNearbyFood.bind(this)
    this.rewardShouldBeGranted = this.rewardShouldBeGranted.bind(this)
    this.fallAsleep = this.fallAsleep.bind(this)
    this.checkEnergy = this.checkEnergy.bind(this)
  }

  handleKeydown(event) {
    if (this.state.gameState !== GAME_STATES.playing) {return}
    // rewrite switch/case
    const which = event.which
    if (which === LEFT_CODE) {
      this.moveCharacter(-SPEED)
    } else if (which === RIGHT_CODE) {
      this.moveCharacter(SPEED)
    } else if (which === SPACE_CODE) {
      this.toggleWithFood()
    } else if (which === S_CODE) {
      this.fallAsleep()
    }
  }

  checkEnergy(newEnergy) {
    if (newEnergy < 0) {
      this.setState({gameState: GAME_STATES.lost})
    }
  }


  fallAsleep() {
    const newEnergy = this.state.characterEnergy - SLEEP_COST
    const newLevel = this.state.level + 1
    if (newLevel >= LEVELS.length) {
      this.setState({
        characterEnergy: newEnergy,
        gameState: GAME_STATES.won,
      })
      return
    }
    this.checkEnergy(newEnergy)
    this.setState({
      characterEnergy: newEnergy,
      level: newLevel,
      foodItems: getFoodItmesFromLevel(LEVELS[newLevel]),
      characterWithFood: false,
    })
  }

  moveCharacter(velocity) {
    let newPosition = this.state.characterPosition + velocity
    newPosition = Math.max(newPosition, CHAR_RADIUS)
    newPosition = Math.min(newPosition, GAME_WIDTH - CHAR_RADIUS)
    if (newPosition !== this.state.characterPosition) {
      const newEnergy = this.state.characterEnergy - ENERGY_LOST_PER_TICK
      this.checkEnergy(newEnergy)
      this.setState({
        characterPosition: newPosition,
        // decrement energy
        characterEnergy: newEnergy
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
    const newLevel = this.state.level + 1
    const newEnergy = Math.min(
      this.state.characterEnergy + LEVELS[this.state.level].reward,
      INIT_ENERY
    )
    if (newLevel > LEVELS.length - 1) {
      this.setState({
        gameState: GAME_STATES.won,
        characterEnergy: newEnergy,
        foodItems: [],
      })
      return
    }
    this.setState({
      characterEnergy: newEnergy,
      level: newLevel,
      foodItems: getFoodItmesFromLevel(LEVELS[newLevel])
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
    let endscreen
    switch (this.state.gameState) {
      case GAME_STATES.lost:
        endscreen = <Defeat width={GAME_WIDTH} height={GAME_HEIGHT}/>
        break;
      case GAME_STATES.won:
        endscreen = <Victory width={GAME_WIDTH} height={GAME_HEIGHT}/>
        break;
      default:
        endscreen = null
        break;
    }
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
        <text x={GAME_WIDTH - 150} y={16}>{'Рівень ' + (this.state.level + 1)}</text>
        <text x={GAME_WIDTH - 150} y={31}>{'Винагорода ' + LEVELS[this.state.level].reward}</text>
        <text x={GAME_WIDTH - 150} y={46}>{
          'Ціна ' + getLevelCost(LEVELS[this.state.level])
        }</text>
        {endscreen}
      </svg>
  }
}