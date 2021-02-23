import styled from 'styled-components'

export const PlayerControlsContainer = styled.div`
  background-color: white;
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

  top: 45px;

  transition: top 0.2s;
`

export const PlayerTrackName = styled.span`
  font-weight: bolder
`

export const PlayerArtist = styled.span`
  padding-left: 10px
`

export const PlayerPlaylist = styled.p`
`

export const PlayerContainer = styled.div`
  width: 100%;
  height: 95px;
  position: absolute;
  bottom: -50px;

  &:hover ${PlayerInfo} {
    top: 0
  }

  &.ready {
    bottom: 0;
  }

  transition: bottom 0.2s;
`

export const ScrubberContainer = styled.div`
  order: 1;
  width: 67%;
  position: relative;
`
export const ScrubberLine = styled.div`
  width: 100%;
  position: relative;
  border: 1px solid #191622;
`

export const ScrubberHandle = styled.div`
  position: absolute;
  width: 5px;
  height: 20px;
  background-color: #191622;
  border-radius: 5px;
  top: -8px;
  cursor: pointer;
`
