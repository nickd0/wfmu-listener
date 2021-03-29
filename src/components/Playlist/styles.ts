import styled, { keyframes } from 'styled-components'

export const TrackContainer = styled.div`
  padding: 10px 5px 10px 10px;
  border-radius: 5px;

  display: flex;
  flex-grow: 1;
  
  border: 1px solid transparent;

  cursor: pointer;

  &:hover {
    border: 1px solid;
  }
  
    background-color: ${props => (props.playing ? 'rgba(255,255,255,0.3)' : 'none')}
  }
`

export const SongTitleText = styled.p`
  font-weight: bolder
`

export const SongArtistText = styled.p`
`

export const TrackSubcontainer = styled.div`
  width: 80%;
  order: 0;
`

export const TrackTSContainer = styled.div`
  width: 20%;
  order: 1;
`
const rotate = keyframes`
  from {
    transform: rotate(-70deg);
  }
  to {
    transform: rotate(70deg);
  }
`

export const ImgLoader = styled.img`
  animation: ${rotate} 1s ease-in-out infinite;
  animation-direction: alternate;

  position: absolute; 
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  top: 200px;
  width: 200px;
`

export const BackButton = styled.div`
  position: fixed;
  padding: 7px 10px;
  background: mintcream;
  border-radius: 5px;
  left: 0;
  top: 80px;
  color: #191622 !important;
  cursor: pointer;
`
