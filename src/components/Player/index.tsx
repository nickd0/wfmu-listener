import { Howl } from 'howler'
import { ipcRenderer } from 'electron'
import React from 'react'
import PlaylistInterface from '../../../interfaces/playlist'


// TODO: player has a Howl for each playlist

import {
  PlayerContainer, PlayerControlsContainer, PlayerInfo,
  PlayerArtist, PlayerTrackName, PlayerPlaylist,
  PlayerControls, PlayerInfoWrap, ScrollablePlayerInfo
} from './styles'
import PlayerScrubber from './PlayerScrubber';
import { Song } from '../../../electron/playlist';

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

// Integrate this state into redux
interface State {
  playerReady: boolean,
  status: PlayerState,
  duration: number,
  eTime: number,
  currSongIdx: number | null,
  trackNameLeft: number,
  trackNameDir: number
}

export default class Player extends React.Component<Props, State> {
  howl: Howl | null;
  tickTimer: number | null;
  trackScroller: HTMLDivElement | null;
  trackScrollPause: number;
  trackScrollWait: Boolean;

  state: Readonly<State> = {
    playerReady: false,
    status: PlayerState.Loading,
    duration: 0,
    eTime: 0,
    currSongIdx: null,
    trackNameLeft: 0,
    trackNameDir: -1
  }

  constructor(props: Readonly<Props>) {
    super(props)
    this.howl = null
    this.tickTimer = null
    this.trackScroller = null
    this.trackScrollPause = 0
    this.trackScrollWait = false
  }

  componentDidMount(): void {
    this.howl = new Howl({
      src: [this.props.streamUrl],
      format: ['mp3'],
      volume: 0.8,
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
          _this.setState({ eTime: _this.state.eTime + 1 })
          // TODO make this better, performance check here
          // Use currIdx for this
          const playlist = _this.props.playlist
          playlist.songs.forEach((song, i) => {
            if (_this.state.eTime >= (song.timestamp ?? 0)) {
              if (_this.state.eTime < ((playlist.songs[i + 1]?.timestamp ?? 0))) {
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

    setInterval(function() {
      const leftDiff = Math.max((this.trackScroller?.clientWidth ?? 0) - 435, 0)
      if (leftDiff === 0) return

      let { trackNameLeft, trackNameDir } = this.state

      // Switch direction
      if ((trackNameLeft <= -leftDiff || trackNameLeft >= 1)) {
        if (!this.trackScrollWait) {
          this.trackScrollPause += 25
          this.trackScrollWait = true
          trackNameDir *= -1
        }
      }

      if (this.trackScrollPause > 0) {
        this.trackScrollPause--
      } else {
        trackNameLeft += (1 * trackNameDir)
        this.trackScrollWait = false
      }

      this.setState({ trackNameLeft, trackNameDir })
    }.bind(this), 50)

    // Global media control
    ipcRenderer.on('playback:playpause', (e) => {
      console.log(e)
      _this.toggleMedia()
    })

    ipcRenderer.on('playback:next', (e) => {
      console.log(e)
      _this.skip(1)
    })

    ipcRenderer.on('playback:prev', (e) => {
      console.log(e)
      _this.skip(-1)
    })

    window.addEventListener('keypress', (e) => {
      if (e.key === ' ') {
        e.preventDefault()
        _this.toggleMedia()
      }
    })
  }

  // componentDidUpdate(prevProps: Readonly<Props>): void {
  //   if (this.props.playlist.id !== prevProps.)
  // }

  componentWillUnmount() {
    this.howl?.unload()
    this.howl = null
  }

  // TODO: stop howl and unload on playlist change

  // TODO: can't scrub to first or last track
  getTrackFromTs(): number {
    const playlist = this.props.playlist

    for (let i = 0; i < playlist.songs.length; i++) {
      const song = playlist.songs[i]
      if (this.state.eTime >= (song.timestamp ?? 0)) {
        if (this.state.eTime < ((playlist.songs[i + 1]?.timestamp ?? 0))) {
          return i
        } else if (i === playlist.songs.length - 1) {
          return i
        }
      }
    }
    return 0
  }

  setTrackInfoRef(el: HTMLDivElement): void {
    this.trackScroller = el
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
      this.setTrackDisplay(newIdx, nextSong?.timestamp)
      this.props.setCurrSong(newIdx)
    }
  }

  setTrackDisplay(idx: number, time: number): void {
    this.setState({
      currSongIdx: idx, eTime: time, trackNameLeft: 0, trackNameDir: -1
    })
  }

  setTrack(idx: number, fromETime = false): void {
    const nextSong = this.props.playlist.songs[idx]
    if (nextSong?.timestamp != null) {
      const time = fromETime ? this.state.eTime : nextSong?.timestamp
      this.howl?.seek(time)
      this.setTrackDisplay(idx, time)
      this.props.setCurrSong(idx)
    }
  }

  renderPlayerInfo() {
    const song = this.props.playlist?.songs[this.state.currSongIdx ?? 0]
    return (
      <PlayerInfo>
        <PlayerInfoWrap>
          <ScrollablePlayerInfo ref={this.setTrackInfoRef.bind(this)} style={{left: this.state.trackNameLeft}}>
            <PlayerTrackName>{song?.title ?? '--'}</PlayerTrackName>
            <PlayerArtist>{song?.artist ?? '--'}</PlayerArtist>
          </ScrollablePlayerInfo>
          <PlayerPlaylist>{this.props.playlist?.showName ?? '--'}</PlayerPlaylist>
        </PlayerInfoWrap>
      </PlayerInfo>
    )
  }

  moveScrubber(percent: number, end = false) {
    this.setState({ eTime: this.state.duration * percent }, () => {
      if (end) this.endScrubbing()
    })
  }

  endScrubbing() {
    this.setTrack(this.getTrackFromTs(), true)
  }

  killPlayer() {
    // stop media and clean
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
          <PlayerScrubber onScrubberEnd={this.endScrubbing.bind(this)} onScrubberMove={this.moveScrubber.bind(this)} duration={this.state.duration} eTime={this.state.eTime} />
        </PlayerControlsContainer>
      </PlayerContainer>
    )
  }
}
