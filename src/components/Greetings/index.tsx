// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import PlaylistInterface, { PlaylistStyle } from "../../../interfaces/playlist";
import React from 'react'

import {
  Container, TitleSection, Subtitle,
  LogoSection, ListSelectSection, Image,
  StreamSelect, DragHeader
} from './styles'

import Player from '../Player'

import TrayView from "../Tray";
import PlaylistView from "../Playlist";
import { ipcRenderer } from 'electron'

import imgSrc from '../../../assets/main-logo.png'
import Playlist, { PlaylistRawObject } from "../../../electron/playlist";

interface State {
  activePlaylist: PlaylistInterface | null,
  viewingPlaylist: PlaylistInterface | null,
  showPlaylist: boolean,
  currSongIdx: number | null,
  playlists: PlaylistInterface[]
}

class Greetings extends React.Component {
  state: Readonly<State> = {
    activePlaylist: null,
    showPlaylist: false,
    currSongIdx: null,
    viewingPlaylist: null,
    playlists: []
  }

  componentDidMount() {
    ipcRenderer.on('playlists:loaded', (event, data) => {
      this.setState({ playlists: data.playlists })
    })

    ipcRenderer.on('playlist:load', (_, pl: PlaylistInterface) => {
      const update: State = this.state
      update.viewingPlaylist = pl
      // TODO only update this if not currently playing a playlist
      update.activePlaylist = pl
      console.log(update)
      this.setState(update)
    })

    ipcRenderer.on('playlists:url-load', (_, data: { url: string}) => {
      const pl = new Playlist({ title: [''], link: [data.url] })
      this.setState({ activePlaylist: pl })
    })

    ipcRenderer.send('playlists:ready')
  }

  selectPlaylist(pl: PlaylistInterface): void {
    const update: State = this.state
    update.viewingPlaylist = pl
    update.activePlaylist = update.activePlaylist || pl
    this.setState(update)
  }

  clearPlaylist() {
    this.setState({ viewingPlaylist: null })
  }

  renderPlaylist() {
    return <PlaylistView currSongIdx={this.state.currSongIdx} playlist={this.state.viewingPlaylist!} backClick={this.clearPlaylist.bind(this)} />
  }

  setCurrSong(idx: number) {
    this.setState({ currSongIdx: idx })
  }

  renderPlaylistStyle(): React.CSSProperties {
    const styles = this.state.viewingPlaylist?.style
    const cssProps: React.CSSProperties = {}
    if (styles) {
      cssProps.backgroundImage = styles!['background-image']
      cssProps.backgroundColor = styles!['background-color']
      cssProps.color = styles!.color
      cssProps.fontFamily = styles!['font-family']
    }

    return cssProps
  }

  renderPlayer() {
    if (this.state.activePlaylist?.mp3Url != null) {
      return <Player setCurrSong={this.setCurrSong.bind(this)} playlist={this.state.activePlaylist!} streamUrl={this.state.activePlaylist!.mp3Url!} />
    }
    return null
  }

  render() {
    return (
      <div style={{height: "100%"}}>
        <TitleSection>
          <div />
          <LogoSection>
            <Image src={imgSrc} />
          </LogoSection>
          {/* Add donate link */}
        </TitleSection>
        <Container style={this.renderPlaylistStyle()} full={!this.state.activePlaylist?.mp3Url}>
          {
            this.state.viewingPlaylist == null
              ? <TrayView playlists={this.state.playlists} clickHandler={this.selectPlaylist.bind(this)} />
              : this.renderPlaylist()
          }
        </Container>
        {this.renderPlayer()}
      </div>
    )
  }
}

export default Greetings
