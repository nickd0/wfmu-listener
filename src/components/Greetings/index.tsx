// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import PlaylistInterface, { PlaylistStyle } from "../../../interfaces/playlist";
import React from 'react'
import { PlaybackTrackSelectAction } from '../../services/emitter'

import {
  Container, TitleSection, Subtitle,
  LogoSection, ListSelectSection, Image,
  StreamSelect
} from './styles'

import Player from '../Player'

import TrayView from '../Tray'
import PlaylistView from '../Playlist'
import { ipcRenderer } from 'electron'

import imgSrc from '../../../assets/main-logo.png'
import Playlist from '../../../electron/playlist'
import SystemEmitter, { EMITTER_PLAYBACK_TRACK_SELECT } from "../../services/emitter";

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
      if (update.activePlaylist?.id === pl.id) {
        update.activePlaylist = pl
      }
      this.setState(update)
    })

    ipcRenderer.on('playlists:url-load', (_, data: { url: string }) => {
      const plId = (new URL(data.url)).searchParams.get('show')
      const link = `https://www.wfmu.org/playlists/shows/${plId}`
      const pl = new Playlist({ title: [''], link: [data.url] })
      this.selectPlaylist(pl)
    })

    ipcRenderer.send('playlists:ready')

    SystemEmitter.on(EMITTER_PLAYBACK_TRACK_SELECT, (data: PlaybackTrackSelectAction) => {
      const playlist = this.state.playlists.find(pl => pl.id == data.playlistId)
      if (playlist && playlist.id !== this.state.activePlaylist.id) {
        this.setState({ activePlaylist: playlist, currSongIdx: data.trackIdx })
        ipcRenderer.send('playlist:show', { playlist: playlist })
      }
    })
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
    return <PlaylistView
      currSongIdx={this.state.currSongIdx}
      playlist={this.state.viewingPlaylist!}
      backClick={this.clearPlaylist.bind(this)}
      isPlaying={this.state.viewingPlaylist?.id === this.state.activePlaylist?.id}
    />
  }

  setCurrSong(idx: number) {
    console.log(`TRACK ${idx}`)
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
      return <Player
        setCurrSong={this.setCurrSong.bind(this)}
        playlist={this.state.activePlaylist!}
        streamUrl={this.state.activePlaylist!.mp3Url!}
        defaultTrack={this.state.currSongIdx ?? 0}
      />
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
