import { Howl } from 'howler'
import React from 'react'
import PlaylistInterface from '../../../interfaces/playlist'
import SongInterface from '../../../interfaces/song'

import {
  PlayerContainer, PlayerControlsContainer, PlayerInfo,
  PlayerArtist, PlayerTrackName, PlayerPlaylist,
  PlayerControls
} from './styles'
import PlayerScrubber from './PlayerScrubber';

interface Props {
  streamUrl: string,
  playlist: PlaylistInterface,
  setCurrSong: (idx: number) => void
}

enum PlayerState {
  Loading,
  Ready,
  Playing,
  Paused
}

interface State {
  playerReady: boolean,
  status: PlayerState,
  duration: number,
  eTime: number,
  currSongIdx: number | null
}

export default class Player extends React.Component<Props, State> {
  howl: Howl | null;
  tickTimer: number | null;
  state: Readonly<State> = {
    playerReady: false,
    status: PlayerState.Loading,
    duration: 0,
    eTime: 0,
    currSongIdx: null
  }

  constructor(props: Readonly<Props>) {
    super(props)
    this.howl = null
    this.tickTimer = null
  }

  componentDidMount(): void {
    this.howl = new Howl({
      src: [this.props.streamUrl],
      format: ['mp3'],
      volume: 0.5,
      html5: true,
      preload: true
    })

    const _this = this

    this.howl.once('load', function() {
      _this.setState({
        playerReady: true,
        status: PlayerState.Ready,
        duration: _this.howl?.duration() ?? 0,
        currSongIdx: 0
      })
    })

    this.howl.on('play', function() {
      _this.setState({ status: PlayerState.Playing })
      if (_this.howl?.playing()) {
        _this.tickTimer = setInterval(() => {
          _this.setState({ eTime: _this.state.eTime + 1000 })
          // TODO make this better, performance check here
          // Use currIdx for this
          const playlist = _this.props.playlist
          playlist.songs.forEach((song, i) => {
            if (_this.state.eTime >= (song.timestamp ?? 0) * 1000) {
              if (_this.state.eTime < (playlist.songs[i + 1]?.timestamp ?? 0) * 1000) {
                _this.setState({ currSongIdx: i })
                _this.props.setCurrSong(i)
              }
            }
          })
        }, 1000)
      }
    })

    this.howl.on('pause', function() {
      _this.setState({ status: PlayerState.Paused })
      clearInterval(_this.tickTimer)
    })
  }

  toggleMedia() {
    switch (this.state.status) {
      case PlayerState.Ready:
      case PlayerState.Paused:
        this.howl?.play()
        this.setState({ status: PlayerState.Playing })
        break

      case PlayerState.Playing:
        this.howl?.pause()
        this.setState({ status: PlayerState.Paused })
        break
    }
  }

  skip(dir: number): void {
    // TODO: On back, play current track from beginning, double click, skip to prev
    const newIdx = (this.state.currSongIdx ?? 0) + dir
    const nextSong = this.props.playlist.songs[newIdx]
    if (nextSong?.timestamp) {
      this.howl?.seek(nextSong?.timestamp)
      this.setState({ currSongIdx: newIdx, eTime: nextSong?.timestamp })
      this.props.setCurrSong(newIdx)
    }
  }

  renderPlayerInfo() {
    const song = this.props.playlist?.songs[this.state.currSongIdx ?? 0]
    return (
      <PlayerInfo>
        <PlayerTrackName>{song?.title ?? '--'}</PlayerTrackName>
        <PlayerArtist>{song?.artist ?? '--'}</PlayerArtist>
        <PlayerPlaylist>{this.props.playlist?.showName ?? '--'}</PlayerPlaylist>
      </PlayerInfo>
    )

    return null
  }

  render() {
    return (
      <PlayerContainer className={this.state.playerReady ? 'ready' : ''}>
        { this.renderPlayerInfo() }
        <PlayerControlsContainer>
          <PlayerControls>
            <a
              href='#'
              onClick={this.skip.bind(this, -1)}
              className="oi" data-glyph="media-step-backward">
            </a>
            <a
              onClick={this.toggleMedia.bind(this)}
              href="#" className="oi"
              data-glyph={`media-${this.state.status === PlayerState.Playing ? 'pause' : 'play'}`}
            />
            <a
              href='#'
              onClick={this.skip.bind(this, 1)}
              className="oi" data-glyph="media-step-forward">
            </a>
          </PlayerControls>
          <PlayerScrubber duration={this.state.duration} eTime={this.state.eTime} />
        </PlayerControlsContainer>
      </PlayerContainer>
    )
  }
}
