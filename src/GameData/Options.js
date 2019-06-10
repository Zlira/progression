export const GAME_WIDTH = 840
export const GAME_HEIGHT = 120
export const BG_COLOR = 0x372c53
export const SPEED = 3
export const SCALE = 2
export const FOOD_WIDTH = 16 * SCALE
export const CHAR_WIDTH = 32 * SCALE

export const GROUND_HEIGHT = 26
export const GET_Y = (texture, bottomY) => GAME_HEIGHT - texture.orig.height * SCALE - bottomY
export const START_OFFSET = CHAR_WIDTH

export const INIT_ENERGY = 100
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

export const PIXI_OPS = {
  defaultAnchor: {x: 0, y: 1},
}
