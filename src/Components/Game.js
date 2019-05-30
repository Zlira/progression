import React, {useReducer, useState} from 'react'

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
const SPEED = 3
const CHAR_RADIUS = 30
const FOOD_RADIUS = 16

const LEFT_CODE = 37
const RIGHT_CODE = 39
const PICKUP_CODE = 16
const S_CODE = 83
const GO_CODE = 71

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

function autoHandler(event, gameState, automatState, dispatch, setAutomatState) {
  if (
    gameState.gameState !== GAME_STATES.playing ||
    automatState.running
  ) {return}
  // rewrite switch/case
  const which = event.which
  switch (which) {
    case S_CODE:
      dispatch({type: 'FALL_ASLEEP'})
      break
    case GO_CODE:
      setAutomatState({...automatState, running: true})
      break
    default:
      break
  }
}

// maybe different levels?
export function AutopilotGame({trajectoryGenerator, decisionMaker}) {
  const hasDecisionMaker = decisionMaker !== undefined
  const [gState, dispatch] = useReducer(gameReducer, getInitState())
  const [automationState, setAutomationState] = useState({
    running: false,
    targetItem: 0,
    direction: 1,
  })
  const [decisionMakerRunning, setDMRunning] = useState(false)
  const {targetItem, direction, running} = automationState
  const {gameState, characterPosition, foodItems, level, levelChanged} = gState
  if (levelChanged && targetItem !==0) {
    setAutomationState({
      ...automationState,
      running: false,
      targetItem: 0,
    })
  }
  if (hasDecisionMaker && decisionMakerRunning && !running) {
    if (decisionMaker(level)) {
      setAutomationState({
        ...automationState,
        running: true,
        targetItem: 0,
      })
    } else {
      dispatch({type: 'FALL_ASLEEP'})
    }
  }
  const runAutopilot = () => {
    if (gameState !== 'playing' || !running) {return}
    // if level changed
    //if (targetItem >= foodItems.length + (characterWithFood? 1 : 0)) {
    const movingForward = direction > 0
    const foodItem = foodItems.reduce(
      (acc, item) => item.index === targetItem? item : acc, undefined
    )
    if (!foodItem && movingForward) {return}
    const targetPos = movingForward
      ? foodItem.position - CHAR_RADIUS - FOOD_RADIUS + 2
      : CHAR_RADIUS * 2 - 2
    if (
      (characterPosition >= targetPos &&
       direction > 0) ||
      (characterPosition <= targetPos &&
       direction < 0)
    ) {
      setAutomationState({
        ...automationState,
        direction: direction * -1,
        targetItem: !movingForward? targetItem + 1 : targetItem
      })
      dispatch({type: movingForward? 'PICKUP_FOOD' : 'PUT_DOWN_FOOD'})
    }
    // this can miss the target point by 1px because speed is 2px,
    // todo account for that
    dispatch({type: 'MOVE', displacement: SPEED * direction})
  }
  useAnimationFrame(runAutopilot)
  let keyDownHandler
  if (!hasDecisionMaker) {
    keyDownHandler = (e) => autoHandler(
      e, gState, automationState, dispatch, setAutomationState
    )
  } else {
    keyDownHandler = (e) => {
      if (gState.gameState === GAME_STATES.playing &&
        !automationState.running &&
        e.which === GO_CODE) {
          setDMRunning(true)
      }
    }
  }
  return <Game state={gState} handleKeydown={keyDownHandler}/>
}