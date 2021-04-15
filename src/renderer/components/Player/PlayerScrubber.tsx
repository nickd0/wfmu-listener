import React from 'react'
import { ProgressPlugin } from 'webpack'
import { extends } from '../../../commitlint.config'
import { ScrubberContainer, ScrubberLine, ScrubberHandle, ScrubberTimestampElapsed } from './styles'

// TODO: drag scrub handle
// https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

interface Props {
  duration: number,
  eTime: number,
  onScrubberMove: (n: number) => void
  onScrubberEnd: () => void
}

interface State {
  scrubMove: boolean
}

class PlayerScrubber extends React.Component<Props, State> {
  state: Readonly<State> = { scrubMove: false }

  componentDidMount() {
    window.addEventListener('mouseup', function(this: PlayerScrubber) {
      this.onScrubberMouseUp()
    }.bind(this))
  }

  onScrubberMouseDown() {
    this.setState({scrubMove: true})
  }

  onScrubberMouseUp(e: React.MouseEvent | null = null) {
    e?.stopPropagation()
    this.setState({scrubMove: false})
    this.props.onScrubberEnd()
  }

  onScrubberDrag(e: React.MouseEvent) {
    if (this.state.scrubMove) {
      this.sendScrubberPosition(e.pageX)
      // const rect = this.refs.scrubLine.getBoundingClientRect()
      // const perc = Math.min(Math.max((e.pageX - rect.x) / (rect.width), 0), 1)
      // console.log(`pagex: ${e.pageX}, perc: ${perc}`)
      // this.props.onScrubberMove(perc)
    }
  }

  onScrubberLineClick(e: React.MouseEvent) {
    this.sendScrubberPosition(e.pageX, true)
  }

  sendScrubberPosition(pageX: number, end = false): void {
    const rect = this.refs.scrubLine.getBoundingClientRect()
    const perc = Math.min(Math.max((pageX - rect.x) / (rect.width), 0), 1)
    this.props.onScrubberMove(perc, end)
  }

  render() {
    const scrubberPos = (this.props.eTime * 100 / (this.props.duration))

    return (
      <ScrubberContainer onMouseMove={this.onScrubberDrag.bind(this)}>
        <ScrubberLine onClick={this.onScrubberLineClick.bind(this)} ref="scrubLine"/>
        <ScrubberHandle
          style={{ left: `${scrubberPos}%` }}
          onMouseDown={this.onScrubberMouseDown.bind(this)}
          onMouseUp={this.onScrubberMouseUp.bind(this)}
          onMouseMove={this.onScrubberDrag.bind(this)}
        />
      </ScrubberContainer>
    )
  }
}

export default PlayerScrubber
