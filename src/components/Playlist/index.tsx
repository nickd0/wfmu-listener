import React from 'react'
import PlaylistInterface from '../../../interfaces/playlist'
import { ShowName, ShowSub } from '../../styles/GlobalStyle'
import {
  TrackContainer, SongArtistText, SongTitleText,
  TrackSubcontainer, TrackTSContainer, ImgLoader
} from './styles'
import { ipcRenderer } from 'electron'
import imgSrc from '../../../assets/wfmu-loader.png'
import Player from '../Player'

interface State {
  playlist: PlaylistInterface | null
}

interface Props {
  playlist: PlaylistInterface,
  currSongIdx: number | null,
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
    ipcRenderer.send('PLAYLIST_SHOW', { playlist: this.props.playlist })
  }

  // TODO: curr song idx needs to also track which playlist, not just track idx
  render() {
    const playlist = this.props.playlist
    return (
      <div>
        {playlist.loaded ? null : <ImgLoader src={imgSrc} />}
        <a href="#" onClick={this.props.backClick}>Back</a>
        <ShowName>{playlist.showName}</ShowName>
        <ShowSub>{playlist.dateStr}</ShowSub>
        <div style={{paddingBottom: '20px'}}>
          {
            playlist.songs.map((s, i) => (
              <TrackContainer key={`track-${i}`} playing={i === this.props.currSongIdx}>
                <TrackSubcontainer>
                  <SongTitleText>{s.title === '' ? 'Your DJ speaks' : s.title}</SongTitleText>
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
