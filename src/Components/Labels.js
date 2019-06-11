import React from 'react'

import './Labels.css'


export default function Labels({levelEnergy}) {
  return <div>
    <p className='game-label game-label__reward'>
      винагорода за рівень: <span className='game-label__reward-amount'>
        {levelEnergy}
      </span>
    </p>
    <div className="game-label game-label__controls">
      <ControlsLabel keys={['s']} action='проспати день' />
      <ControlsLabel keys={["<-", "->"]} action="йти" />
      <ControlsLabel keys={['space']} action="підняти/покласти"/>
      <ControlsLabel keys={["r"]} action="почати спочатку"/>
    </div>
  </div>
}


function ControlsLabel({keys, action}) {
  const keysComps = keys.map(
    k => <span key={k} className="game-label__control-key">{k}</span>
  )
  return <p className="game-label__control">
    {action} {keysComps}
  </p>
}