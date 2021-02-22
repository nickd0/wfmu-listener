import styled from 'styled-components'

export const PlayerControlsContainer = styled.div`
  background-color: white;
  height: 45px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
  z-index: 1;
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
  bottom: 0;

  &:hover ${PlayerInfo} {
    top: 0
  }
`
