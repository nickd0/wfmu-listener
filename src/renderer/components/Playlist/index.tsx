import React from 'react'
import PlaylistInterface from '../../../../interfaces/playlist'
import { ShowName, ShowSub } from '../../styles/GlobalStyle'
import {
  TrackContainer, SongArtistText, SongTitleText,
  TrackSubcontainer, TrackTSContainer, ImgLoader, BackButton
} from './styles'
import { ipcRenderer, clipboard } from 'electron'
import imgSrc from '../../../../assets/wfmu-loader.png'

import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../renderer/store'
import { PlaybackActionTypes, PlayerState } from '../../../renderer/store/playback/types'
import { setViewingPlaylist } from '../../../renderer/store/ui/actions'
import { UiActionTypes } from '../../../renderer/store/ui/types'
import { setPlaybackEtime, setPlaybackPlaylist, setPlaybackTrackIdx } from '../../../renderer/store/playback/actions'

interface State {
  playlist: PlaylistInterface | null
}

class PlaylistView extends React.Component<PlaylistProps, State> {
  state: Readonly<State> = { playlist: null }
  private containerRef: React.RefObject<HTMLDivElement>

  constructor(props: PlaylistProps) {
    super(props)
    this.containerRef = React.createRef()
  }

  componentDidMount(): void {
    let { playlist } = this.props
    if (!playlist?.loaded) ipcRenderer.send('playlist:show', { playlist: this.props.playlist })
  }

  isPlaying(): Boolean {
    let { playlist, playingPlaylist } = this.props
    return playlist?.id == playingPlaylist?.id
  }

  trackStyle(idx: number): React.CSSProperties {
    const plStyle = this.props.playlist?.style ?? {}
    let { playlist, playingPlaylist } = this.props
    if (idx === this.props.currTrackIdx && this.isPlaying()) {
      console.log(`selected track ${idx}`)
      return {
        color: plStyle['background-color'] || 'inherit',
        backgroundColor: plStyle.color || 'inherit'
      }
    } else {
      return {}
    }
  }

  trackSelect(timestamp: number) {
    const { setPlaybackEtime, setPlaybackPlaylist } = this.props
    if (this.isPlaying()) {
      setPlaybackEtime(timestamp)
    } else if (confirm('Play from this playlist?')) {
      setPlaybackEtime(timestamp)
      setPlaybackPlaylist(this.props.playlist!)
    }
  }

  // TODO: curr song idx needs to also track which playlist, not just track idx
  render() {
    const playlist = this.props.playlist!
    return (
      <div ref={this.containerRef}>
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
                style={this.trackStyle(i)}
                // FIXME redux
                onClick={function(this: PlaylistView) { this.trackSelect(s.timestamp ?? 0) }.bind(this) }
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
  playerState: state.playback.status,
  playingPlaylist: state.playback.playlist
})

const mapDispatchToProps = (dispatch: Dispatch<UiActionTypes | PlaybackActionTypes>) => ({
  clearPlaylist: () => dispatch(setViewingPlaylist(null)),
  setPlaybackEtime: (time: number) => dispatch(setPlaybackEtime(time)),
  setPlaybackPlaylist: (playlist: PlaylistInterface) => dispatch(setPlaybackPlaylist(playlist))
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type PlaylistProps = ConnectedProps<typeof connector>

export default connector(PlaylistView)

