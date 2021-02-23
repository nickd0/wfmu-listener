import React from 'react'
import { ProgressPlugin } from 'webpack'
import { extends } from '../../../commitlint.config'
import { ScrubberContainer, ScrubberLine, ScrubberHandle } from './styles'

// TODO: drag scrub handle
// https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

interface Props {
  duration: number,
  eTime: number
}

interface State {
  scrubMove: boolean
}

class PlayerScrubber extends React.Component<Props, State> {
  state: Readonly<State> = { scrubMove: false }

  onScrubberMouseDown() {
    this.setState({scrubMove: true})
  }

  onScrubberMouseUp() {
    this.setState({scrubMove: false})
  }

  onScrubberDrag(e) {
    if (this.state.scrubMove) {
      console.log(e)
    }
  }

  render() {
    const scrubberPos = (this.props.eTime * 100 / (this.props.duration * 1000))

    return (
      <ScrubberContainer>
        <ScrubberLine
          onMouseDown={this.onScrubberMouseDown.bind(this)}
          onMouseUp={this.onScrubberMouseUp.bind(this)}
          onMouseMove={this.onScrubberDrag.bind(this)}
        />
        <ScrubberHandle style={{ left: `${scrubberPos}%` }} />
      </ScrubberContainer>
    )
  }
}

export default PlayerScrubber
