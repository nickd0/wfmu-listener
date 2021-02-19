// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import React from 'react'

import { Container, TitleSection, Subtitle, Text } from './styles'
import Tray from "../Tray";

const Greetings: React.FC = () => {
  return (
    <div>
      <TitleSection>
        <Text>WFMU listener</Text>
        <Subtitle>Latest Archives</Subtitle>
      </TitleSection>
      <Container>
        <Tray />
      </Container>
    </div>
  )
}

export default Greetings
