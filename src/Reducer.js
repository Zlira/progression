import {LEVELS} from './GameData/Levels'

const GAME_WIDTH = 1000
const GAME_HEIGHT = 60
const SPEED = 2
const CHAR_RADIUS = 30
const FOOD_RADIUS = 16
const START_OFFSET = CHAR_RADIUS * 2
const INIT_ENERY = 100
const ENERGY_LOST_PER_TICK = .1
const SLEEP_COST = 50

const GAME_STATES = {
  playing: 'playing',
  won: 'won',
  lost: 'lost'
}


function keepWithingBrackets(min, max, num) {
  num = Math.min(num, max)
  return Math.max(num, min)
}


function decrementEnergy(state, amount) {
  const newEnergy = state.characterEnergy - amount
  let gameState = state.gameState
  if (newEnergy < 0) {
    gameState = GAME_STATES.lost
  }
  return {...state, gameState: gameState, characterEnergy: newEnergy}
}


function findNearbyFood(foodItems, position) {
  let item
  for (let i=0; i < foodItems.length; i++) {
    item = foodItems[i]
    if (
      Math.abs(item.position - position) <
      FOOD_RADIUS + CHAR_RADIUS
    ) {
      return [i, item]
    }
  }
}


function rewardShouldBeGranted(state) {
  return state.foodItems.reduce(
    (acc, item) => acc && item.position < CHAR_RADIUS * 2,
    true
  )
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


function grantReward(state) {
  const newLevel = state.level + 1
  const newEnergy = Math.min(
    state.characterEnergy + LEVELS[state.level].reward,
    INIT_ENERY
  )
  if (newLevel > LEVELS.length - 1) {
    return {
      ...state,
      gameState: GAME_STATES.won,
      characterEnergy: newEnergy,
      foodItems: [],
    }
  }
  return {
    ...state,
    characterEnergy: newEnergy,
    level: newLevel,
    foodItems: getFoodItmesFromLevel(LEVELS[newLevel])
  }
}


function move(state, displacement) {
  let newPosition = state.characterPosition + displacement
  newPosition = keepWithingBrackets(CHAR_RADIUS, GAME_WIDTH, newPosition)
  if (newPosition === state.characterPosition) {
    return state
  }
  let newState = decrementEnergy(state, ENERGY_LOST_PER_TICK)
  return {
    ...newState,
    characterPosition: newPosition
  }
}


function pickUpFood(state) {
  const nearbyFood = findNearbyFood(
    state.foodItems, state.characterPosition
  )
  if (!nearbyFood) {return state}
  const [foodIndex, foodItem] = nearbyFood
  const newItems = Array.from(state.foodItems)
  newItems.splice(foodIndex, 1)
  return {
    ...state,
    foodItems: newItems,
    characterWithFood: foodItem,
  }
}


function putDownFood(state) {
  const newItems = Array.from(state.foodItems)
  const newItem = state.characterWithFood
  newItem.position = state.characterPosition
  newItems.push(newItem)
  let newState = {
    ...state,
    foodItems: newItems
  }
  if (rewardShouldBeGranted(newState)) {
    newState = grantReward(newState)
  }
  return {
    ...newState,
    characterWithFood: false,
  }
}

function fallAsleep(state) {
  const newLevel = state.level + 1
  let newState = {...state}
  if (newLevel >= LEVELS.length) {
    newState = {...newState, gameState: GAME_STATES.won}
  } else {
    newState = {...newState, level: newLevel}
  }
  newState = decrementEnergy(newState, SLEEP_COST)
  if (newState.gameState === GAME_STATES.playing) {
    newState = {
      ...newState,
      foodItems: getFoodItmesFromLevel(LEVELS[newLevel])
    }
  }
  return {
    ...newState,
    characterWithFood: false,
  }
}


export function getInitState() {
  return {
    characterPosition: CHAR_RADIUS,
    characterWithFood: false,
    characterEnergy: INIT_ENERY,
    gameState: GAME_STATES.playing,
    foodItems: getFoodItmesFromLevel(LEVELS[0]),
    level: 0
  }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      return move(state, action.displacement)
    case 'PICKUP_FOOD':
      return pickUpFood(state)
    case 'PUT_DOWN_FOOD':
      return putDownFood(state)
    case 'FALL_ASLEEP':
      return fallAsleep(state)
    default:
      return state
  }
}
