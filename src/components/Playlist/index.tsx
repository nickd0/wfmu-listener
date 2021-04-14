import React from 'react'
import PlaylistInterface from '../../../interfaces/playlist'
import { ShowName, ShowSub } from '../../styles/GlobalStyle'
import {
  TrackContainer, SongArtistText, SongTitleText,
  TrackSubcontainer, TrackTSContainer, ImgLoader, BackButton
} from './styles'
import { ipcRenderer, clipboard } from 'electron'
import imgSrc from '../../../assets/wfmu-loader.png'
import Player from '../Player'
import SystemEmitter, { EMITTER_PLAYBACK_TRACK_SELECT } from '../../services/emitter'

import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../renderer/store'
import { PlaybackActionTypes, PlayerState } from '../../renderer/store/playback/types'
import { setViewingPlaylist } from '../../renderer/store/ui/actions'
import { UiActionTypes } from '../../renderer/store/ui/types'

interface State {
  playlist: PlaylistInterface | null
}

// On load, send IPC to load tracks
// Pull playlist page background, color, and font
// background == body:background-image or color
// font == body:font-family and body:color
// const PlaylistView = ({ playlist, backClick }: Props) => (
class PlaylistView extends React.Component<PlaylistProps, State> {
  state: Readonly<State> = { playlist: null }

  componentDidMount(): void {
    ipcRenderer.send('playlist:show', { playlist: this.props.playlist })
  }

  isPlaying(): Boolean {
    return this.props.playerState == PlayerState.Playing
  }

  trackStyle(idx: number): React.CSSProperties {
    const plStyle = this.props.playlist?.style ?? {}
    if (idx === this.props.currTrackIdx && this.isPlaying()) {
      return {
        color: plStyle['background-color'] || 'inherit',
        backgroundColor: plStyle.color || 'inherit'
      }
    } else {
      return {}
    }
  }

  // FIXME redux
  trackSelect(playlistId: number, trackIdx: number) {
    if (this.isPlaying() || confirm('Play from this playlist?')) {
      if (playlistId === this.props.playlist?.id) {
        SystemEmitter.emit(EMITTER_PLAYBACK_TRACK_SELECT, { playlistId, trackIdx })
      }
    }
  }

  // TODO: curr song idx needs to also track which playlist, not just track idx
  render() {
    const playlist = this.props.playlist!
    return (
      <div>
        {playlist.loaded ? null : <ImgLoader src={imgSrc} />}
        <BackButton
          onClick={this.props.clearPlaylist}
          className="oi"
          data-glyph="arrow-circle-left"
        />
        <ShowName>{playlist.showName}</ShowName>
        <ShowSub>{playlist.dateStr}</ShowSub>
        <div style={{paddingBottom: '20px'}}>
          {
            playlist.songs.map((s, i) => (
              <TrackContainer
                key={`track-${i}`}
                playing={i === this.props.currTrackIdx && this.isPlaying()}
                style={this.trackStyle(i)}
                // FIXME redux
                onClick={this.trackSelect.bind(this, this.props.playlist?.id, i)}
              >
                <TrackSubcontainer>
                  <SongTitleText>{s.title}</SongTitleText>
                  <SongArtistText>{s.artist}</SongArtistText>
                </TrackSubcontainer>
                <TrackTSContainer><p>{s.timestampStr}</p></TrackTSContainer>
              </TrackContainer>
            ))
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  playlist: state.ui.playlist,
  currTrackIdx: state.playback.currSongIdx,
  playerState: state.playback.status
})

const mapDispatchToProps = (dispatch: Dispatch<UiActionTypes>) => ({
  clearPlaylist: () => dispatch(setViewingPlaylist(null))
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type PlaylistProps = ConnectedProps<typeof connector>

export default connector(PlaylistView)

