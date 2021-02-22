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
    overflow-y: scroll;
    height: 510px;
`

export const Image = styled.img`
  width: 100%;
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
  height: 90px;
  display: flex;
  align-items: center;
`

export const LogoSection = styled.div`
  width: 40%;
  order 0;
`
export const ListSelectSection = styled.div`
  width: 60%;
  order 1;
  text-align: right;
`

export const StreamSelect = styled.select`
`
