import React, {useReducer, useState, useEffect, useRef} from 'react'

import Character from './Character'
import FoodItem from './FoodItem'
import FoodItems from './FoodItems'
import Kitchen from './Kitchen'
import {Defeat, Victory} from './EndGame'
import {LEVELS} from '../GameData/Levels'
import {getInitState, gameReducer} from '../Reducer'
import {useAnimationFrame} from '../Hooks/useAnimationEffect'

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


function userHandler(event, state, dispatch) {
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


function Game({state, handleKeydown}) {
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
    onKeyDown={handleKeydown}
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

export default function UserControlledGame() {
  const [state, dispatch] = useReducer(gameReducer, getInitState())
  return <Game state={state}
           handleKeydown={(event) => userHandler(event, state, dispatch)}/>
}

function autoHandler(event, state, dispatch) {
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

// maybe different levels?
export function AutopilotGame({trajectoryGenerator}) {
  const [gState, dispatch] = useReducer(gameReducer, getInitState())
  const [automationState, setAutomationState] = useState({
    running: false,
    targetItem: 0,
    direction: 1,
  })
  const {targetItem, direction} = automationState
  const {gameState, characterPosition, foodItems, characterWithFood} = gState
  const runAutopilot = () => {
    if (gameState !== 'playing' ||
        targetItem >= foodItems.length + (characterWithFood? 1 : 0)) {
      return
    }
    const movingForward = direction > 0
    const foodItem = foodItems.reduce(
      (acc, item) => item.index === targetItem? item : acc, undefined
    )
    const targetPos = movingForward? foodItem.position : CHAR_RADIUS
    console.log(direction, targetPos)
    if (
      (characterPosition >= targetPos &&
       direction > 0) ||
      (characterPosition <= targetPos &&
       direction < 0)
    ) {
      console.log(characterPosition, movingForward)
      setAutomationState({
        ...automationState,
        direction: direction * -1,
        targetItem: !movingForward? targetItem + 1 : targetItem
      })
      dispatch({type: movingForward? 'PICKUP_FOOD' : 'PUT_DOWN_FOOD'})
    }
    dispatch({type: 'MOVE', displacement: SPEED * direction})
  }
  useAnimationFrame(runAutopilot)
  return <Game state={gState} handleKeydown={() => null}/>
  // first level - user pressed S (sleep) or G (go)
  // if go:
  //    generate trajectory for current level
  //    set state to running and (?) don't react to keys
  //    start move sequence:
  //      run to the first point
  //      pickup
  //      return to the next point
  //      putdown
  //      run to the next point etc
  // if everything was collected go the the next level
  // wait for next instrunctions
}