import React, {useReducer, useState} from 'react'

import {
  CHAR_WIDTH, FOOD_WIDTH, GO_CODE, SPEED, GAME_STATUS, S_CODE
} from '../GameData/Options'
import {getInitState, gameReducer} from '../Reducer'
import Game from './Game'
import {useAnimationFrame} from '../Hooks/useAnimationFrame'


function autoHandler(event, gameState, automatState, dispatch, setAutomatState) {
  if (
    gameState.gameStatus !== GAME_STATUS.playing ||
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
export default function AutopilotGame({trajectoryGenerator, decisionMaker}) {
  const hasDecisionMaker = decisionMaker !== undefined
  const [gState, dispatch] = useReducer(gameReducer, getInitState())
  const [automationState, setAutomationState] = useState({
    running: false,
    targetItem: 0,
    direction: 1,
  })
  const [decisionMakerRunning, setDMRunning] = useState(false)
  const {targetItem, direction, running} = automationState
  const {gameStatus, characterPosition, foodItems, level, levelChanged} = gState
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
    if (gameStatus !== 'playing' || !running) {return}
    // if level changed
    //if (targetItem >= foodItems.length + (characterWithFood? 1 : 0)) {
    const movingForward = direction > 0
    const foodItem = foodItems.reduce(
      (acc, item) => item.index === targetItem? item : acc, undefined
    )
    if (!foodItem && movingForward) {return}
    const targetPos = movingForward
      ? foodItem.position - CHAR_WIDTH / 2 - FOOD_WIDTH / 2 + 2
      : CHAR_WIDTH - 2
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
      if (gState.gameStatus === GAME_STATUS.playing &&
        !automationState.running &&
        e.which === GO_CODE) {
          setDMRunning(true)
      }
    }
  }
  return <Game state={gState}
           handleKeydown={keyDownHandler}
           handleKeyup={() => null}/>
}