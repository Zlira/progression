import React  from 'react'

import {Stage} from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

import {
  GAME_STATUS, FOOD_RADIUS, CHAR_RADIUS,
  GAME_WIDTH, GAME_HEIGHT, BG_COLOR,
} from '../GameData/Options'
import Character from './Character'
import FoodItem from './FoodItem'
import FoodItems from './FoodItems'
import Kitchen from './Kitchen'
import {Defeat, Victory} from './EndGame'
import {LEVELS} from '../GameData/Levels'

// todo where's an appropriate place for this?
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;


function getLevelCost(level) {
  const a_1 = level.distanceToFirstItem
  const d = level.distanceBetweenItems
  const n = level.itemsCount
  return (a_1 * 2 + d * (n - 1)) * n
}


function getEndscreen(gameStatus) {
  switch (gameStatus) {
    case GAME_STATUS.lost:
      return <Defeat width={GAME_WIDTH} height={GAME_HEIGHT}/>
    case GAME_STATUS.won:
      return <Victory width={GAME_WIDTH} height={GAME_HEIGHT}/>
    default:
      return null
  }
}


export default function Game({state, handleKeydown, handleKeyup}) {
  const stageOptions = {
    backgroundColor: BG_COLOR,
  }
  const {characterPosition, characterEnergy, direction} = state
  console.log(direction)
  return (
    <div focusable={true} tabIndex={0}
      onKeyDown={handleKeydown} onKeyUp={handleKeyup}>
      <Stage options={stageOptions} width={GAME_WIDTH} height={GAME_HEIGHT}>
         <Character xPosition={characterPosition}
           radius={CHAR_RADIUS} energy={Math.ceil(characterEnergy)}
           direction={direction}
         />
      </Stage>
    </div>)
}


// export default function Game({state, handleKeydown}) {
//   const {
//     foodItems, gameStatus, level, characterPosition,
//     characterWithFood, characterEnergy
//   } = state
//   const foodItemElems = foodItems.map(
//     i => <FoodItem radius={FOOD_RADIUS}
//             xPos={i.position}
//             yPos={0}
//             key={i.index}/>
//   )
//   const endscreen = getEndscreen(gameStatus)
//   return <svg
//     focusable={true} xmlns="http://www.w3.org/2000/svg"
//     width={GAME_WIDTH} height={GAME_HEIGHT} tabIndex={0}
//     onKeyDown={handleKeydown}
//     >
//       <Kitchen width={CHAR_RADIUS * 2}/>
//       <FoodItems xPos={0} yPos={2 * CHAR_RADIUS - 2*FOOD_RADIUS}>
//         {foodItemElems}
//       </FoodItems>
//         {characterWithFood
//           ? <FoodItem radius={FOOD_RADIUS} xPos={0} yPos={CHAR_RADIUS}/>
//           : null}
//       </Character>
//       <text x={GAME_WIDTH - 150} y={16}>{'Рівень ' + (level + 1)}</text>
//       <text x={GAME_WIDTH - 150} y={31}>{'Винагорода ' + LEVELS[level].reward}</text>
//       <text x={GAME_WIDTH - 150} y={46}>{
//         'Ціна ' + getLevelCost(LEVELS[level])
//       }</text>
//       {endscreen}
//     </svg>
//
// }