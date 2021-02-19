import styled, { keyframes } from 'styled-components'

export const FeedGroup = styled.div`
  padding: 10px 5px 10px 10px;
  border-radius: 5px;
  &:hover {
    background: #473e60
  }
  cursor: pointer;
`


export const Subtitle = styled.p`
  border-bottom: 1px solid white;
  margin-bottom: 10px;
  padding-bottom: 5px;
`

export const FeedList = styled.div`
  overflow-y: scroll;
  height: 490px;
`

