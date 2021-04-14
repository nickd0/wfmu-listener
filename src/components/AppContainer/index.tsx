// use https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import PlaylistInterface from "../../../interfaces/playlist";
import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../renderer/store'
import { UiActionTypes } from '../../renderer/store/ui/types'
import { PlaybackActionTypes } from '../../renderer/store/playback/types'
import { setViewingPlaylist } from '../../renderer/store/ui/actions'
import { setPlaybackPlaylist } from '../../renderer/store/playback/actions'
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
  // activePlaylist: PlaylistInterface | null,
  viewingPlaylist: PlaylistInterface | null,
  showPlaylist: boolean,
  currSongIdx: number | null,
  playlists: PlaylistInterface[]
}

class AppContainer extends React.Component<AppContainerProps> {
  state: Readonly<State> = {
    // activePlaylist: null,
    showPlaylist: false,
    currSongIdx: null,
    viewingPlaylist: null,
    playlists: []
  }

  componentDidMount() {
    ipcRenderer.on('playlists:loaded', (event, data) => {
      // FIXME redux
      this.setState({ playlists: data.playlists })
    })

    ipcRenderer.on('playlist:load', (_, pl: PlaylistInterface) => {
      // const update: State = this.state
      // update.viewingPlaylist = pl
      // TODO only update this if not currently playing a playlist
      // if (update.activePlaylist?.id === pl.id) {
      //   update.activePlaylist = pl
      // }
      // this.setState(update)
      this.props.setActivePlaylist(pl)
      if (this.props.playbackPlaylist?.id == pl.id || this.props.playbackPlaylist == null) {
        this.props.setPlaybackPlaylist(pl)
      }
    })

    ipcRenderer.on('playlists:url-load', (_, data: { url: string }) => {
      const plId = (new URL(data.url)).searchParams.get('show')
      const link = `https://www.wfmu.org/playlists/shows/${plId}`
      const pl = new Playlist({ title: [''], link: [data.url] })
      this.selectPlaylist(pl)
    })

    ipcRenderer.send('playlists:ready')

    // SystemEmitter.on(EMITTER_PLAYBACK_TRACK_SELECT, (data: PlaybackTrackSelectAction) => {
    //   const playlist = this.state.playlists.find(pl => pl.id == data.playlistId)
    //   if (playlist && playlist.id !== this.props.playlist.id) {
    //     this.setState({ activePlaylist: playlist, currSongIdx: data.trackIdx })
    //     ipcRenderer.send('playlist:show', { playlist: playlist })
    //   }
    // })
  }

  selectPlaylist(pl: PlaylistInterface): void {
    // const update: State = this.state
    // update.viewingPlaylist = pl
    // update.activePlaylist = update.activePlaylist || pl
    // this.setState(update)
    this.props.setActivePlaylist(pl)
  }

  clearPlaylist() {
    this.setState({ viewingPlaylist: null })
  }

  renderPlaylist() {
    return <PlaylistView
      currSongIdx={this.state.currSongIdx}
      playlist={this.props.playlist!}
      backClick={this.clearPlaylist.bind(this)}
      isPlaying={this.props.playlist?.id === this.props.playlist?.id}
    />
  }

  setCurrSong(idx: number) {
    this.setState({ currSongIdx: idx })
  }

  renderPlaylistStyle(): React.CSSProperties {
    const styles = this.props.playlist?.style
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
    if (this.props.playbackPlaylist?.mp3Url != null) {
      // FIXME redux
      return <Player/>
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
        <Container style={this.renderPlaylistStyle()} full={!this.props.playlist?.mp3Url}>
          {
            this.props.playlist == null
              ? <TrayView playlists={this.state.playlists} clickHandler={this.selectPlaylist.bind(this)} />
              : <PlaylistView />
          }
        </Container>
        {this.renderPlayer()}
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  playlist: state.ui.playlist,
  playbackPlaylist: state.playback.playlist
})

const mapDispatchToProps = (dispatch: Dispatch<UiActionTypes | PlaybackActionTypes>) => ({
  setActivePlaylist: (playlist: PlaylistInterface) => dispatch(setViewingPlaylist(playlist)),
  setPlaybackPlaylist: (playlist: PlaylistInterface) => dispatch(setPlaybackPlaylist(playlist))
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type AppContainerProps = ConnectedProps<typeof connector>

export default connector(AppContainer)
