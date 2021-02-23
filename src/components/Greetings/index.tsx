// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import PlaylistInterface, { PlaylistStyle } from "../../../interfaces/playlist";
import React from 'react'

import {
  Container, TitleSection, Subtitle,
  LogoSection, ListSelectSection, Image,
  StreamSelect
} from './styles'

import Player from '../Player'

import TrayView from "../Tray";
import PlaylistView from "../Playlist";
import { extends } from "../../../commitlint.config";
import { ipcRenderer } from 'electron'

import imgSrc from '../../../assets/main-logo.png'

interface State {
  activePlaylist: PlaylistInterface | null,
  showPlaylist: boolean,
  playlists: PlaylistInterface[]
}

class Greetings extends React.Component {
  state: Readonly<State> = {
    activePlaylist: null,
    showPlaylist: false,
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

  renderPlayer() {
    if (this.state.activePlaylist?.mp3Url != null) {
      return <Player streamUrl={this.state.activePlaylist!.mp3Url!} />
    }
    return null
  }

  render() {
    return (
      <div style={{height: "100%"}}>
        <TitleSection>
          <LogoSection>
            <Image src={imgSrc} />
          </LogoSection>
          <ListSelectSection>
            {/* <Subtitle>Latest Archives</Subtitle> */}
            <StreamSelect defaultValue={"latest"}>
              <option value="latest">Latest archives</option>
            </StreamSelect>
          </ListSelectSection>
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
        {this.renderPlayer()}
      </div>
    )
  }
}

export default Greetings
