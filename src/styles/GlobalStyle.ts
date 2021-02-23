import styled, { createGlobalStyle } from 'styled-components'
import OpenIconicFont from '../../assets/fonts/open-iconic.ttf'
import '../../assets/css/open-iconic.scss'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    color: #E1E1E6;
    height: 100%;
  }

  html {
    height: 100%;
  }

  #root {
    height: 100%
  }

  // @font-face {
  //   font-family: OpenIconic;
  //   font-style: normal;
  //   font-weight: 400;
  //   src: url(${OpenIconicFont});
  //   src: url('../fonts/open-iconic.eot');
  //   src: url('../fonts/open-iconic.eot?#iconic-sm') format('embedded-opentype'), url('../fonts/open-iconic.woff') format('woff'), url('../fonts/open-iconic.ttf') format('truetype'), url('../fonts/open-iconic.otf') format('opentype'), url('../fonts/open-iconic.svg#iconic-sm') format('svg');
  // }
`

export const ShowName = styled.p`
  font-size: 19px;
`

export const ShowSub = styled.p`
  font-size: 16px;
`

