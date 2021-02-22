import { Howl } from 'howler'
import React from 'react'
import {
  PlayerContainer, PlayerControlsContainer, PlayerInfo,
  PlayerArtist, PlayerTrackName, PlayerPlaylist
} from './styles'

interface Props {
  streamUrl: string
}

export default class Player extends React.Component<Props> {
  howl: Howl | null;

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
      this.howl.play()
    }.bind(this))
  }

  render() {
    return (
      <PlayerContainer>
        <PlayerInfo>
          <PlayerTrackName>Track name</PlayerTrackName>
          <PlayerArtist>Artist</PlayerArtist>
          <PlayerPlaylist>The name of the show with DJ</PlayerPlaylist>
        </PlayerInfo>
        <PlayerControlsContainer>
        </PlayerControlsContainer>
      </PlayerContainer>
    )
  }
}
