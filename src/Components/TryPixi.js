import React, {useEffect, useState} from 'react'
import { Stage, Sprite } from "react-pixi-fiber"
import * as PIXI from 'pixi.js'


export default function TryPixi() {
  const [textures, setTextures] = useState([])
  const [textureNum, setTextureNum] = useState(2)
  const [position , setPosition] = useState(0)
  useEffect(() => {
    PIXI.loader.add("sprites/spritesheet.json").load(setup);

    function setup() {
      let sheet = PIXI.loader.resources["sprites/spritesheet.json"].spritesheet;
      //const animatedSprite = new PIXI.extras.AnimatedSprite(
      //  Object.values(sheet.textures)
      //)
      setTextures(Object.values(sheet.textures).slice(3, 5))
    }
  }, [])
  useEffect(() => {
    if (!textures) {return}
    const intervalId = setTimeout(() => setTextureNum((textureNum + 1) % 2) , 200 )
  }, [textureNum])
  useEffect(() => {
    if (position >= 450) { return }
    setTimeout(() => setPosition(position + 2), 20)
  }, [position])
  return <Stage options={{backgroundColor: 0x362B52, antialias: true}} height={50} width={500}>
    {textures
      ? <Sprite texture={textures[textureNum]} height={40} width={40} x={position} y={5}/>
      : null
    }
  </Stage>
}


