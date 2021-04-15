import { Howl } from 'howler'
import { ipcRenderer, clipboard } from 'electron'
import React from 'react'
import PlaylistInterface from '../../../interfaces/playlist'

import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../renderer/store'
import { PlaybackActionTypes, PlayBackState, PlayerState } from '../../renderer/store/playback/types'
import { updatePlaybackState, setPlaybackEtime, playbackEtimeTick } from '../../renderer/store/playback/actions'


// TODO: player has a Howl for each playlist

import {
  PlayerContainer, PlayerControlsContainer, PlayerInfo,
  PlayerArtist, PlayerTrackName, PlayerPlaylist,
  PlayerControls, PlayerInfoWrap, ScrollablePlayerInfo,
  ScrubberTimestampElapsed, ScrubberTimestampTotal
} from './styles'
import PlayerScrubber from './PlayerScrubber';
import { setViewingPlaylist } from '../../renderer/store/ui/actions'
import { UiActionTypes } from '../../renderer/store/ui/types'
interface State {
  trackNameLeft: number,
  trackNameDir: number
}

class Player extends React.Component<PlayerProps, State> {
  howl: Howl | null;
  tickTimer: number | null;
  scrollTimer: number | null;
  trackScroller: HTMLDivElement | null;
  trackScrollPause: number;
  trackScrollWait: Boolean;

  state: Readonly<State> = {
    trackNameLeft: 0,
    trackNameDir: -1
  }

  constructor(props: Readonly<PlayerProps>) {
    super(props)
    this.howl = null
    this.tickTimer = null
    this.scrollTimer = null
    this.trackScroller = null
    this.trackScrollPause = 0
    this.trackScrollWait = false
  }

  componentDidMount(): void {
    // TODO: use SystemEmitter to track when a playlist is selected for playing
    // and manage state from here
    this.setupHowl()

    this.scrollTimer = setInterval(function(this: Player) {
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
      this.toggleMedia()
    })

    ipcRenderer.on('playback:next', (e) => {
      this.skip(1)
    })

    ipcRenderer.on('playback:prev', (e) => {
      this.skip(-1)
    })

    window.addEventListener('keypress', (e) => {
      e.preventDefault()
      if (e.key === ' ') {
        this.toggleMedia()
      }
    })
  }

  componentDidUpdate(prevProps: Readonly<PlayerProps>) {
    const didUpdateScrubbing = prevProps.playback.isScrubbing != this.props.playback.isScrubbing && !this.props.playback.isScrubbing
    if ((Math.abs(this.props.playback.eTime - prevProps.playback.eTime) > 1 && !this.props.playback.isScrubbing) || didUpdateScrubbing) {
      this.howl?.seek(this.props.playback.eTime)
    }
    if (prevProps.playback.playlist?.id !== this.props.playback.playlist?.id) {
      this.unloadHowl()
      this.setupHowl(true)
    }
  }

  componentWillUnmount() {
    this.unloadHowl()
  }

  setupHowl(shouldSeek: boolean = false) {
    this.howl = new Howl({
      src: [this.props.playback.playlist!.mp3Url!],
      format: ['mp3'],
      volume: 1,
      html5: true,
      preload: true
    })

    const _this = this

    this.howl.on('loaderror', function() {
      _this.unloadHowl()
      _this.setupHowl(true)
    })

    this.howl.once('load', function() {
      _this.props.updatePlaybackState(PlayerState.Ready, _this.howl?.duration() ?? 0)
      let seektime = 0
      if (shouldSeek) {
        seektime = _this.props.playback.eTime
      }
      _this.props.setPlaybackETime(seektime)
      _this.howl?.seek(seektime)
    })

    this.howl.on('play', function() {
      if (_this.howl?.playing()) {
        _this.tickTimer = setInterval(() => {
          if (_this.props.playback.status === PlayerState.Paused) return
          console.log(`TICK playlist ${_this.props.playback.playlist?.id}, playing: ${_this.howl?.playing()}`)

          _this.props.etimeTick()
        }, 1000)
      }
    })

    this.howl.on('pause', function() {
      _this.props.updatePlaybackState(PlayerState.Paused)
    })

    this.howl?.on('stop', this.resetHowl.bind(this))
    this.howl?.on('end', this.resetHowl.bind(this))
  }

  unloadHowl() {
    clearInterval(this.tickTimer!)
    clearInterval(this.scrollTimer!)
    this.howl?.unload()
    this.howl = null
  }

  resetHowl() {
    this.toggleMedia()
    this.moveScrubber(0)
  }

  setTrackInfoRef(el: HTMLDivElement): void {
    this.trackScroller = el
  }

  toggleMedia() {
    switch (this.props.playback.status) {
      case PlayerState.Ready:
      case PlayerState.Paused:
        this.howl?.play()
        this.props.updatePlaybackState(PlayerState.Playing)
        break

      case PlayerState.Playing:
        this.howl?.pause()
        this.props.updatePlaybackState(PlayerState.Paused)
        break
    }
  }

  skip(dir: number): void {
    let { currSongIdx, playlist } = this.props.playback
    const newIdx = (currSongIdx ?? 0) + dir
    const nextSong = playlist?.songs[newIdx]
    if (nextSong?.timestamp) {
      this.setTrackETime(nextSong!.timestamp)
    }
  }

  setTrackETime(time: number) {
    this.props.setPlaybackETime(time)
  }

  onClickPlaylistName(e: React.MouseEvent) {
    this.props.showPlaylist(this.props.playback.playlist!)
  }

  renderPlayerInfo() {
    const playlist = this.props.playback.playlist!
    const song = playlist.songs[this.props.playback.currSongIdx ?? 0]
    return (
      <PlayerInfo>
        <PlayerInfoWrap>
          {
            playlist.songs.length
            ? (
              <ScrollablePlayerInfo title="Click to copy to clipboard" ref={this.setTrackInfoRef.bind(this)} style={{left: this.state.trackNameLeft}}>
                <PlayerTrackName>{song?.title ?? '--'}</PlayerTrackName>
                <PlayerArtist>{song?.artist ?? '--'}</PlayerArtist>
              </ScrollablePlayerInfo>
            )
            : null
          }
          <PlayerPlaylist onClick={this.onClickPlaylistName.bind(this)}>{playlist.showName}</PlayerPlaylist>
        </PlayerInfoWrap>
      </PlayerInfo>
    )
  }

  moveScrubber(percent: number, end = false) {
    let time = this.props.playback.duration * percent
    this.props.updatePlaybackState(this.props.playback.status, null, true)
    this.props.setPlaybackETime(time)
    if (end) this.endScrubbing(time)
  }

  endScrubbing(time: number | null = null) {
    this.props.updatePlaybackState(this.props.playback.status, null, false)
  }

  timestampString(ts: number): string {
    let hours = ~~(ts / 3600)
    let minMod = ts % 3600
    let mins = ~~(minMod / 60)
    let secs = ~~(minMod % 60)

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  render() {
    const continuousPlaylist = this.props.playback.playlist!.songs.length === 0
    const playbackState = this.props.playback.status
    const { duration, eTime } = this.props.playback
    return (
      <PlayerContainer className={playbackState != PlayerState.Loading ? 'ready' : ''}>
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
              data-glyph={`media-${playbackState === PlayerState.Playing ? 'pause' : 'play'}`}
              title={playbackState === PlayerState.Playing ? 'Pause' : 'Play'}
            />
            <a
              href='#'
              onClick={this.skip.bind(this, 1)}
              className="oi"
              data-glyph={continuousPlaylist ? 'arrow-right' : 'media-step-forward'}
              title={continuousPlaylist ? 'Skip 10 seconds' : 'Next track'}
            />
          </PlayerControls>
          <ScrubberTimestampElapsed>{this.timestampString(eTime)}</ScrubberTimestampElapsed>
          <PlayerScrubber
            onScrubberEnd={this.endScrubbing.bind(this)}
            onScrubberMove={this.moveScrubber.bind(this)}
            duration={duration}
            eTime={eTime}
          />
        </PlayerControlsContainer>
      </PlayerContainer>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  playback: state.playback
})

const mapDispatchToProps = (dispatch: Dispatch<PlaybackActionTypes | UiActionTypes>) => ({
  showPlaylist: (playlist: PlaylistInterface) => dispatch(setViewingPlaylist(playlist)),
  updatePlaybackState: (state: PlayerState, dur: number | null = null, isScrubbing: boolean | null = null) => dispatch(updatePlaybackState(state, dur, isScrubbing)),
  setPlaybackETime: (eTime: number) => dispatch(setPlaybackEtime(eTime)),
  etimeTick: () => dispatch(playbackEtimeTick())
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type PlayerProps = ConnectedProps<typeof connector>

export default connector(Player)
