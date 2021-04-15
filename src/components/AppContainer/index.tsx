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

interface State {
  // activePlaylist: PlaylistInterface | null,
  viewingPlaylist: PlaylistInterface | null,
  showPlaylist: boolean,
  currSongIdx: number | null,
  playlists: PlaylistInterface[]
}

class AppContainer extends React.Component<AppContainerProps> {
  state: Readonly<State> = {
    showPlaylist: false,
    currSongIdx: null,
    viewingPlaylist: null,
    playlists: []
  }
  // private containerRef: React.RefObject<HTMLDivElement>

  // constructor(props: AppContainerProps) {
  //   super(props)
  //   this.containerRef = React.createRef()
  // }

  componentDidMount() {
    ipcRenderer.on('playlists:loaded', (event, data) => {
      this.setState({ playlists: data.playlists })
    })

    ipcRenderer.on('playlist:load', (_, pl: PlaylistInterface) => {
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
  }

  selectPlaylist(pl: PlaylistInterface): void {
    this.props.setActivePlaylist(pl)
  }

  clearPlaylist() {
    this.setState({ viewingPlaylist: null })
  }

  setCurrSong(idx: number) {
    this.setState({ currSongIdx: idx })
  }

  renderPlaylistStyle(): React.CSSProperties {
    const styles = this.props.playlist?.style as { [key: string]: string }
    const cssProps: React.CSSProperties = {}
    if (styles) {
      cssProps.backgroundImage = styles!['background-image']
      cssProps.backgroundColor = styles!['background-color']
      cssProps.color = styles!.color
      cssProps.fontFamily = styles!['font-family']
    }

    return cssProps
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
        <Container style={this.renderPlaylistStyle()} full={this.props.playlist?.mp3Url === null}>
          {
            this.props.playlist == null
              ? <TrayView playlists={this.state.playlists} clickHandler={this.selectPlaylist.bind(this)} />
              : <PlaylistView />
          }
        </Container>
        {this.props.playbackPlaylist?.mp3Url ? <Player /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  playlist: state.ui.playlist,
  playbackPlaylist: state.playback.playlist,
  currSongIdx: state.playback.currSongIdx
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
