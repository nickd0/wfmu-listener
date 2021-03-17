import styled from 'styled-components'

export const PlayerControlsContainer = styled.div`
  background-color: white;
  box-shadow: -1px 5px 20px 0px black;
  height: 45px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
  z-index: 1;
  display: flex;
  padding: 10px 15px;
  color: #191622;
  align-items: center;
`

export const PlayerControls = styled.div`
  order: 0;
  width: 33%;
  a {
    color: #191622;
  }

  text-align: center;

  .oi {
    margin-right: 20px;
  }
`

export const TimeControls = styled.div`
  order: 1;
  width: 67%;
`

export const PlayerInfo = styled.div`
  background-color: #909090;
  height: 50px;
  padding: 5px;
  padding-left: 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
  z-index: 0;

  top: 40px;

  transition: top 0.2s;
`

export const PlayerTrackName = styled.span`
  font-weight: bolder;
  white-space: nowrap;
`

export const PlayerArtist = styled.span`
  padding-left: 10px;
  white-space: nowrap;
`

export const PlayerPlaylist = styled.p`
`

export const PlayerInfoWrap = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
`

export const ScrollablePlayerInfo = styled.div`
  position: relative;
  display: inline-block;
  left: 0;
`

export const PlayerContainer = styled.div`
  width: 100%;
  height: 95px;
  position: absolute;
  bottom: -50px;

  &.ready {
    bottom: 0;
  }

  &:hover ${PlayerInfo} {
    top: 0
  }

  transition: bottom 0.2s;
`

export const ScrubberTimestamp = styled.span`
  font-size: 0.8em;

`

export const ScrubberTimestampElapsed = styled(ScrubberTimestamp)`
  order: 1;
`

export const ScrubberTimestampTotal = styled(ScrubberTimestamp)`
  order: 3;
`

export const ScrubberContainer = styled.div`
  order: 2;
  width: 67%;
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: 5px
`
export const ScrubberLine = styled.div`
  width: 100%;
  position: relative;
  border: 1px solid #b0afb1;
  height: 7px;
  background-color: #b0afb1;
`

export const ScrubberHandle = styled.div`
  position: absolute;
  width: 5px;
  height: 20px;
  background-color: #191622;
  border-radius: 5px;
  cursor: pointer;
`
