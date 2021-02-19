import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Container = styled.div`
    padding: 25px;
    padding-bottom: 0;
`

export const Image = styled.img`
    width: 300px;
    animation: ${rotate} 15s linear infinite;
    opacity: 0.1;
`
export const Text = styled.p`
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
`

export const Subtitle = styled.p`
  border-bottom: 1px solid white;
  margin-bottom: 10px;
  padding-bottom: 5px;
`

export const TitleSection = styled.div`
  background: mintcream;
  color: #191622;
  margin: 0;
  padding-top: 1px;
  padding: 1px 20px 3px 20px;
`
