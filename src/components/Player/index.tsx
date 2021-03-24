import { Howl } from 'howler'
import { ipcRenderer } from 'electron'
import React from 'react'
import PlaylistInterface from '../../../interfaces/playlist'


// TODO: player has a Howl for each playlist

import {
  PlayerContainer, PlayerControlsContainer, PlayerInfo,
  PlayerArtist, PlayerTrackName, PlayerPlaylist,
  PlayerControls, PlayerInfoWrap, ScrollablePlayerInfo,
  ScrubberTimestampElapsed, ScrubberTimestampTotal
} from './styles'
import PlayerScrubber from './PlayerScrubber';
import SystemEmitter, { PlaybackTrackSelectAction, EMITTER_PLAYBACK_TRACK_SELECT } from '../../services/emitter'

interface Props {
  streamUrl: string,
  playlist: PlaylistInterface,
  setCurrSong: (idx: number) => void,
  defaultTrack: number
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
    // TODO: use SystemEmitter to track when a playlist is selected for playing
    // and manage state from here
    this.setupHowl()

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
      _this.skip(1)
    })

    ipcRenderer.on('playback:prev', (e) => {
      _this.skip(-1)
    })

    window.addEventListener('keypress', (e) => {
      if (e.key === ' ') {
        _this.toggleMedia()
      }
    })

    // Render-side events
    SystemEmitter.on(EMITTER_PLAYBACK_TRACK_SELECT, (trackAction: PlaybackTrackSelectAction) => {
      this.setTrack(trackAction.trackIdx)
    })

    if (this.props.defaultTrack) {
      this.setTrack(this.props.defaultTrack)
    }
  }
  

  // componentDidUpdate(prevProps: Readonly<Props>): void {
  //   if (this.props.playlist.id !== prevProps.playlist.id) {
  //     console.log("=== NEW PLAYLIST ===")
  //   }
  // }

  componentWillUnmount() {
    this.unloadHowl()
  }

  setupHowl() {
    this.howl = new Howl({
      src: [this.props.streamUrl],
      format: ['mp3'],
      volume: 1,
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
          if (_this.state.status === PlayerState.Paused) return

          _this.setState({ eTime: _this.state.eTime + 1 })
          // TODO: make this better, performance check here
          // Use currIdx for this
          const playlist = _this.props.playlist
          playlist.songs.forEach((song, i) => {
            if (_this.state.eTime >= (song.timestamp ?? 0)) {
              if (_this.state.eTime < ((playlist.songs[i + 1]?.timestamp ?? 0))) {
                _this.setTrackDisplay(i)
                _this.props.setCurrSong(i)
              }
            }
          })
        }, 1000)
      }
    })

    this.howl.on('pause', function() {
      _this.setState({ status: PlayerState.Paused })
      // clearInterval(_this.tickTimer)
    })

    this.howl?.on('stop', this.resetHowl.bind(this))
    this.howl?.on('end', this.resetHowl.bind(this))
  }

  unloadHowl() {
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

  resetHowl() {
    this.toggleMedia()
    this.moveScrubber(0)
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
    // if (this.props.playlist.songs.length === 0) {
    //   // TODO handle at beginning or end
    //   let newETime = this.state.eTime + dir * 10
    //   this.setState({eTime: newETime}, (() => {this.howl?.seek(newETime)}).bind(this))
    // } else if (nextSong?.timestamp) {
    if (nextSong?.timestamp) {
      this.howl?.seek(nextSong?.timestamp)
      this.setTrackDisplay(newIdx, nextSong?.timestamp)
      this.props.setCurrSong(newIdx)
    }
  }

  setTrackDisplay(idx: number, time: number | null = null): void {
    const update: State = {
      ...this.state,
      currSongIdx: idx
    }

    if (update.currSongIdx !== this.state.currSongIdx) {
      update.trackNameLeft = 0
      update.trackNameDir = -1
    }

    if (time) update.eTime = time

    this.setState(update)
  }

  setTrack(idx: number, fromETime = false): void {
    const nextSong = this.props.playlist.songs[idx]
    if (nextSong?.timestamp != null) {
      const time = fromETime ? this.state.eTime : nextSong?.timestamp
      this.howl?.seek(time)
      this.setTrackDisplay(idx, time)
      this.props.setCurrSong(idx)

    } else if (this.props.playlist.songs.length == 0) {
      // Trackless playlist, just seek to the ts
      this.howl?.seek(this.state.eTime)
    }
  }

  renderPlayerInfo() {
    const song = this.props.playlist?.songs[this.state.currSongIdx ?? 0]
    return (
      <PlayerInfo>
        <PlayerInfoWrap>
          {
            this.props.playlist.songs.length
            ? (
              <ScrollablePlayerInfo ref={this.setTrackInfoRef.bind(this)} style={{left: this.state.trackNameLeft}}>
                <PlayerTrackName>{song?.title ?? '--'}</PlayerTrackName>
                <PlayerArtist>{song?.artist ?? '--'}</PlayerArtist>
              </ScrollablePlayerInfo>
            )
            : null
          }
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

  timestampString(ts: number): string {
    var tsDiv = ts
    
    let hours = ~~(ts / 3600)
    let minMod = ts % 3600
    let mins = ~~(minMod / 60)
    let secs = ~~(minMod % 60)

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  render() {
    const continuousPlaylist = this.props.playlist.songs.length === 0
    return (
      <PlayerContainer className={this.state.playerReady ? 'ready' : ''}>
        { this.renderPlayerInfo() }
        <PlayerControlsContainer>
          <PlayerControls>
            <a
              href='#'
              onClick={this.skip.bind(this, -1)}
              className="oi"
              data-glyph={continuousPlaylist ? 'arrow-left' : 'media-step-backward'}
              title={continuousPlaylist ? 'Skip 10 seconds back' : 'Previous track'}
            />
            <a
              onClick={this.toggleMedia.bind(this)}
              href="#"
              className="oi"
              data-glyph={`media-${this.state.status === PlayerState.Playing ? 'pause' : 'play'}`}
              title={this.state.status === PlayerState.Playing ? 'Pause' : 'Play'}
            />
            <a
              href='#'
              onClick={this.skip.bind(this, 1)}
              className="oi"
              data-glyph={continuousPlaylist ? 'arrow-right' : 'media-step-forward'}
              title={continuousPlaylist ? 'Skip 10 seconds' : 'Next track'}
            />
          </PlayerControls>
          <ScrubberTimestampElapsed>{this.timestampString(this.state.eTime)}</ScrubberTimestampElapsed>
          <PlayerScrubber onScrubberEnd={this.endScrubbing.bind(this)} onScrubberMove={this.moveScrubber.bind(this)} duration={this.state.duration} eTime={this.state.eTime} />
        </PlayerControlsContainer>
      </PlayerContainer>
    )
  }
}
