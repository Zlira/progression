import React, {useReducer} from 'react'

import {
  GAME_STATUS, LEFT_CODE, RIGHT_CODE, SPEED, PICKUP_CODE,
  S_CODE
} from '../GameData/Options'
import {gameReducer, getInitState} from '../Reducer'
import Game from './Game'


function userHandler(event, state, dispatch) {
  if (state.gameStatus !== GAME_STATUS.playing) {return}
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

export default function UserControlledGame() {
  const [state, dispatch] = useReducer(gameReducer, getInitState())
  return <Game state={state}
           handleKeydown={(event) => userHandler(event, state, dispatch)}
           handleKeyup={() => dispatch({type: 'STOP'})}/>
}