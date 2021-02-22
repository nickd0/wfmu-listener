import { Howl } from 'howler'
import React from 'react'

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
      <div>Player</div>
    )
  }
}
