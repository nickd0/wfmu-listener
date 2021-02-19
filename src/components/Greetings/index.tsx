// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import PlaylistInterface from "../../../interfaces/playlist";
import React from 'react'

import { Container, TitleSection, Subtitle, Image, Text } from './styles'
import TrayView from "../Tray";
import PlaylistView from "../Playlist";
import { extends } from "../../../commitlint.config";

import imgSrc from '../../../assets/main-logo.png'

interface State {
  activePlaylist: PlaylistInterface | null
}

class Greetings extends React.Component {
  state: Readonly<State> = { activePlaylist: null }

  selectPlaylist(pl: PlaylistInterface): void {
    this.setState({activePlaylist: pl})
  }

  clearPlaylist() {
    this.setState({activePlaylist: null})
  }

  renderPlaylist() {
    return <PlaylistView playlist={this.state.activePlaylist!} backClick={this.clearPlaylist.bind(this)} />
  }

  render() {
    return (
      <div>
        <TitleSection>
          {/* <img src={imgSrc} /> */}
          <Text>WFMU listener</Text>
          <Subtitle>Latest Archives</Subtitle>
        </TitleSection>
        <Container>
          {this.state.activePlaylist == null ? <TrayView clickHandler={this.selectPlaylist.bind(this)} /> : this.renderPlaylist()}
        </Container>
      </div>
    )
  }
}

export default Greetings
