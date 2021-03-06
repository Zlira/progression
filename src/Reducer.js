import {LEVELS} from './GameData/Levels'
import {
  FOOD_WIDTH, CHAR_WIDTH, START_OFFSET,
  INIT_ENERGY, GAME_STATUS, GAME_WIDTH,
  ENERGY_LOST_PER_TICK, SLEEP_COST,
} from './GameData/Options'


function keepWithingBrackets(min, max, num) {
  num = Math.min(num, max)
  return Math.max(num, min)
}


function decrementEnergy(state, amount) {
  const newEnergy = state.characterEnergy - amount
  let gameStatus = state.gameStatus
  if (newEnergy < 0) {
    gameStatus = GAME_STATUS.lost
  }
  return {...state, gameStatus: gameStatus, characterEnergy: newEnergy}
}


function findNearbyFood(foodItems, position) {
  let item
  for (let i=0; i < foodItems.length; i++) {
    item = foodItems[i]
    if (
      Math.abs(item.position - position) <
      (FOOD_WIDTH + CHAR_WIDTH) / 2
    ) {
      return [i, item]
    }
  }
}


function rewardShouldBeGranted(state) {
  return state.foodItems.reduce(
    (acc, item) => acc && item.position < CHAR_WIDTH,
    true
  )
}


function getFoodItemsFromLevel(level) {
  return [...Array(level.itemsCount).keys()].map(
        i => ({index: i,
               name: level.items[i],
               position: level.distanceToFirstItem
                         + level.distanceBetweenItems * i
                         + START_OFFSET
                         + FOOD_WIDTH / 2})
  )
}


function grantReward(state) {
  const newLevel = state.level + 1
  const newEnergy = Math.min(
    state.characterEnergy + LEVELS[state.level].reward,
    INIT_ENERGY
  )
  if (newLevel > LEVELS.length - 1) {
    return {
      ...state,
      gameStatus: GAME_STATUS.won,
      characterEnergy: newEnergy,
      foodItems: [],
    }
  }
  return {
    ...state,
    characterEnergy: newEnergy,
    level: newLevel,
    foodItems: getFoodItemsFromLevel(LEVELS[newLevel]),
    levelChanged: true,
  }
}


function move(state, displacement) {
  state = {...state, direction: displacement > 0? 1 : -1}
  let newPosition = state.characterPosition + displacement
  newPosition = keepWithingBrackets(CHAR_WIDTH / 2, GAME_WIDTH, newPosition)
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
  console.log(state.direction)
  if (state.direction < 0) {
    newItem.position = state.characterPosition - 35
  } else {
    newItem.position = state.characterPosition
  }
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
    newState = {...newState, gameStatus: GAME_STATUS.won}
  } else {
    newState = {...newState, level: newLevel}
  }
  newState = decrementEnergy(newState, SLEEP_COST)
  if (newState.gameStatus === GAME_STATUS.playing) {
    newState = {
      ...newState,
      foodItems: getFoodItemsFromLevel(LEVELS[newLevel])
    }
  }
  return {
    ...newState,
    characterWithFood: false,
    levelChanged: true,
  }
}


export function getInitState() {
  const initLevel = 0
  return {
    characterPosition: CHAR_WIDTH / 2,
    characterWithFood: false,
    characterEnergy: INIT_ENERGY,
    gameStatus: GAME_STATUS.playing,
    foodItems: getFoodItemsFromLevel(LEVELS[initLevel]),
    level: initLevel,
    levelChanged: false,
    direction: 0,
  }
}


export function gameReducer(state, action) {
  state = {
    ...state,
    levelChanged: false,
  }
  switch (action.type) {
    case 'MOVE':
      return move(state, action.displacement)
    case 'STOP':
      return {
        ...state, direction: 0
      }
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
