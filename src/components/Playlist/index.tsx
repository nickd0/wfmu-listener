import React from 'react'
import PlaylistInterface from '../../../interfaces/playlist'
import { ShowName, ShowSub } from '../../styles/GlobalStyle'
// import { Text } from "./styles"

import { ipcRenderer } from "electron";

// interface State {
//   playlists: []
// }

interface Props {
  playlist: PlaylistInterface,
  backClick: () => void
}

// On load, send IPC to load tracks
// Pull playlist page background, color, and font
// background == body:background-image or color
// font == body:font-family and body:color
const PlaylistView = ({ playlist, backClick }: Props) => (
  <div>
    <ShowName>{playlist.showName}</ShowName>
    <ShowSub>{playlist.dateStr}</ShowSub>
  </div>
)

export default PlaylistView
// export default class PlaylistView extends React.Component {
//   render() {
//     return (
//       <div>
//         <p>{this.props.title}</p>
//         <p>{this.props.desc}</p>
//       </div>
//     )
//   }
// }
