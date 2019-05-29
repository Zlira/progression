import React, {useReducer} from 'react'

import Character from './Character'
import FoodItem from './FoodItem'
import FoodItems from './FoodItems'
import Kitchen from './Kitchen'
import {Defeat, Victory} from './EndGame'
import {LEVELS} from '../GameData/Levels'
import {getInitState, gameReducer} from '../Reducer'

const GAME_WIDTH = 1000
const GAME_HEIGHT = 60
const SPEED = 2
const CHAR_RADIUS = 30
const FOOD_RADIUS = 16

const LEFT_CODE = 37
const RIGHT_CODE = 39
const PICKUP_CODE = 16
const S_CODE = 83
const GAME_STATES = {
  playing: 'playing',
  won: 'won',
  lost: 'lost'
}


function getLevelCost(level) {
  const a_1 = level.distanceToFirstItem
  const d = level.distanceBetweenItems
  const n = level.itemsCount
  return (a_1 * 2 + d * (n - 1)) * n
}


function handleKeydown(event, state, dispatch) {
  if (state.gameState !== GAME_STATES.playing) {return}
  // rewrite switch/case
  const which = event.which
  if (which === LEFT_CODE) {
    dispatch({type: 'MOVE', displacement: -SPEED})
  } else if (which === RIGHT_CODE) {
    dispatch({type: 'MOVE', displacement: SPEED})
  } else if (which === PICKUP_CODE) {
    if (state.characterWithFood) {
      dispatch({type: 'PUT_DOWN_FOOD'})
    } else {
      dispatch({type: 'PICKUP_FOOD'})
    }
  } else if (which === S_CODE) {
    dispatch({type: 'FALL_ASLEEP'})
  }
}

function getEndscreen(gameState) {
  switch (gameState) {
    case GAME_STATES.lost:
      return <Defeat width={GAME_WIDTH} height={GAME_HEIGHT}/>
    case GAME_STATES.won:
      return <Victory width={GAME_WIDTH} height={GAME_HEIGHT}/>
    default:
      return null
  }
}


export default function Game() {
  const [state, dispatch] = useReducer(gameReducer, getInitState())
  const {
    foodItems, gameState, level, characterPosition,
    characterWithFood, characterEnergy
  } = state
  const foodItemElems = foodItems.map(
    i => <FoodItem radius={FOOD_RADIUS}
            xPos={i.position}
            yPos={0}
            key={i.index}/>
  )
  const endscreen = getEndscreen(gameState)
  return <svg
    focusable={true} xmlns="http://www.w3.org/2000/svg"
    width={GAME_WIDTH} height={GAME_HEIGHT} tabIndex={0}
    onKeyDown={event => handleKeydown(event, state, dispatch)}
    >
      <Kitchen width={CHAR_RADIUS * 2}/>
      <FoodItems xPos={0} yPos={2 * CHAR_RADIUS - 2*FOOD_RADIUS}>
        {foodItemElems}
      </FoodItems>
      <Character xPosition={characterPosition}
        radius={CHAR_RADIUS} energy={Math.ceil(characterEnergy)}
      >
        {characterWithFood
          ? <FoodItem radius={FOOD_RADIUS} xPos={0} yPos={CHAR_RADIUS}/>
          : null}
      </Character>
      <text x={GAME_WIDTH - 150} y={16}>{'Рівень ' + (level + 1)}</text>
      <text x={GAME_WIDTH - 150} y={31}>{'Винагорода ' + LEVELS[level].reward}</text>
      <text x={GAME_WIDTH - 150} y={46}>{
        'Ціна ' + getLevelCost(LEVELS[level])
      }</text>
      {endscreen}
    </svg>
}