// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import React from 'react'

import { Container, Image, Text } from './styles'

const Greetings: React.FC = () => {
  return (
    <Container onFocus={() => alert("clicked")}>
      <Text>WFMU listener</Text>
    </Container>
  )
}

export default Greetings
