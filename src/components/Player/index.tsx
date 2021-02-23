import { Howl } from 'howler'
import React from 'react'
import {
  PlayerContainer, PlayerControlsContainer, PlayerInfo,
  PlayerArtist, PlayerTrackName, PlayerPlaylist,
  PlayerControls
} from './styles'

interface Props {
  streamUrl: string
}

enum PlayerState {
  Loading,
  Ready,
  Playing,
  Paused
}

interface State {
  playerReady: boolean,
  status: PlayerState
}

export default class Player extends React.Component<Props, State> {
  howl: Howl | null;
  state: Readonly<State> = {
    playerReady: false,
    status: PlayerState.Loading
  }

  constructor(props: Readonly<Props>) {
    super(props)
    this.howl = null
  }

  componentDidMount(): void {
    this.howl = new Howl({
      src: [this.props.streamUrl],
      format: ['mp3'],
      volume: 0.5,
      html5: true,
      preload: true
    })

    this.howl.once('load', function() {
      this.setState({ playerReady: true, status: PlayerState.Ready })
    }.bind(this))

    this.howl.on('play', function() {
      this.setState({ status: PlayerState.Playing })
    })

    this.howl.on('pause', function() {
      this.setState({ status: PlayerState.Paused })
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

  render() {
    return (
      <PlayerContainer className={this.state.playerReady ? 'ready' : ''}>
        <PlayerInfo>
          <PlayerTrackName>Track name</PlayerTrackName>
          <PlayerArtist>Artist</PlayerArtist>
          <PlayerPlaylist>The name of the show with DJ</PlayerPlaylist>
        </PlayerInfo>
        <PlayerControlsContainer>
          <PlayerControls>
            <span className="oi" data-glyph="media-step-backward"></span>
            <a
              onClick={this.toggleMedia.bind(this)}
              href="#" className="oi"
              data-glyph={`media-${this.state.status === PlayerState.Playing ? 'pause' : 'play'}`}
            />
            <span className="oi" data-glyph="media-step-forward"></span>
          </PlayerControls>
        </PlayerControlsContainer>
      </PlayerContainer>
    )
  }
}
