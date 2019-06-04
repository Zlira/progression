import React from 'react';

import * as PIXI from 'pixi.js'
import MainText from './MainText'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      texturesLoaded: false
    }
  }

  componentDidMount() {
    const setup = () => {
      this.setState({texturesLoaded: true})
    }
    PIXI.loader
      .add("sprites/spritesheet.json")
      .add("sprites/background.json")
      .add("sprites/food.json")
      .load(setup);
  }

  render() {
    return (
      <div className="progression-poc">
        {this.state.texturesLoaded
          ?<MainText/>
          : null
        }
      </div>
    );
  }
}

export default App;
