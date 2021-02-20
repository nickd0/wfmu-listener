// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import PlaylistInterface, { PlaylistStyle } from "../../../interfaces/playlist";
import React from 'react'

import { Container, TitleSection, Subtitle, Image, Text } from './styles'
import TrayView from "../Tray";
import PlaylistView from "../Playlist";
import { extends } from "../../../commitlint.config";
import { ipcRenderer } from 'electron'

import imgSrc from '../../../assets/main-logo.png'

interface State {
  activePlaylist: PlaylistInterface | null,
  playlists: PlaylistInterface[]
}

class Greetings extends React.Component {
  state: Readonly<State> = {
    activePlaylist: null,
    playlists: []
  }

  componentDidMount() {
    ipcRenderer.on('PLAYLISTS_LOADED', (event, data) => {
      this.setState({ playlists: data.playlists })
    })

    ipcRenderer.on('PLAYLIST_LOAD', (_, pl: PlaylistInterface) => {
      this.setState({ activePlaylist: pl })
    })
  }

  selectPlaylist(pl: PlaylistInterface): void {
    this.setState({activePlaylist: pl})
  }

  clearPlaylist() {
    this.setState({activePlaylist: null})
  }

  renderPlaylist() {
    return <PlaylistView playlist={this.state.activePlaylist!} backClick={this.clearPlaylist.bind(this)} />
  }

  renderPlaylistStyle(): React.CSSProperties {
    const styles = this.state.activePlaylist?.style
    if (styles) {
      return {
        backgroundImage: styles!['background-image'],
        backgroundColor: styles!['background-color'],
        color: styles!.color,
        fontFamily: styles!['font-family']
      }
    }
    return {}
  }

  render() {
    return (
      <div style={{height: "100%"}}>
        <TitleSection>
          {/* <img src={imgSrc} /> */}
          <Text>WFMU listener</Text>
          <Subtitle>Latest Archives</Subtitle>
          {/* Add donate link */}
        </TitleSection>
        <Container style={this.renderPlaylistStyle()}>
          {
            this.state.activePlaylist == null ?
              <TrayView playlists={this.state.playlists} clickHandler={this.selectPlaylist.bind(this)} />
              :
              this.renderPlaylist()
          }
        </Container>
      </div>
    )
  }
}

export default Greetings
