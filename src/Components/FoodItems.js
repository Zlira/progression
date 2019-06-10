import React from 'react'

import { Container } from 'react-pixi-fiber'


// todo this seems like a stupid component to have
export default function FoodItems({xPos, yPos, children}) {
  return <Container>
    {children}
  </Container>
}