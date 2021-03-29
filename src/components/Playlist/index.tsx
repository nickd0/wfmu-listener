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

interface State {
  playlist: PlaylistInterface | null
}

interface Props {
  playlist: PlaylistInterface,
  currSongIdx: number | null,
  isPlaying: Boolean,
  backClick: () => void
}

// On load, send IPC to load tracks
// Pull playlist page background, color, and font
// background == body:background-image or color
// font == body:font-family and body:color
// const PlaylistView = ({ playlist, backClick }: Props) => (
export default class PlaylistView extends React.Component<Props, State> {
  state: Readonly<State> = { playlist: null }

  componentDidMount(): void {
    ipcRenderer.send('playlist:show', { playlist: this.props.playlist })
  }

  trackStyle(idx: number): React.CSSProperties {
    const pl = this.props.playlist
    if (idx === this.props.currSongIdx && this.props.isPlaying) {
      return {
        color: pl.style['background-color'] || 'inherit',
        backgroundColor: pl.style.color || 'inherit'
      }
    } else {
      return {}
    }
  }

  trackSelect(playlistId: number, trackIdx: number) {
    if (this.props.isPlaying || confirm('Play from this playlist?')) {
      if (playlistId === this.props.playlist.id) {
        SystemEmitter.emit(EMITTER_PLAYBACK_TRACK_SELECT, { playlistId, trackIdx })
      }
    }
  }

  // TODO: curr song idx needs to also track which playlist, not just track idx
  render() {
    const playlist = this.props.playlist
    return (
      <div>
        {playlist.loaded ? null : <ImgLoader src={imgSrc} />}
        <BackButton
          onClick={this.props.backClick}
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
                playing={i === this.props.currSongIdx && this.props.isPlaying}
                style={this.trackStyle(i)}
                onClick={this.trackSelect.bind(this, this.props.playlist.id, i)}
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
