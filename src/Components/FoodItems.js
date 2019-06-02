import React from 'react'

import { Container } from 'react-pixi-fiber'


export default function FoodItems({xPos, yPos, children}) {
  return <Container>
    {children}
  </Container>
}