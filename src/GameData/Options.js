export const GAME_WIDTH = 1000
export const GAME_HEIGHT = 90
export const BG_COLOR = 0x362B52
export const SPEED = 3
export const CHAR_RADIUS = 30
export const FOOD_RADIUS = 16

export const START_OFFSET = CHAR_RADIUS * 2
export const INIT_ENERY = 100
export const ENERGY_LOST_PER_TICK = .05 * SPEED
export const SLEEP_COST = 50

export const LEFT_CODE = 37
export const RIGHT_CODE = 39
export const PICKUP_CODE = 16
export const S_CODE = 83
export const GO_CODE = 71
export const GAME_STATUS = {
  playing: 'playing',
  won: 'won',
  lost: 'lost'
}

