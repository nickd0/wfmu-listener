import React from 'react'
import PropTypes from "prop-types";
// import { Text } from "./styles";

import { ipcRenderer } from "electron";

// interface State {
//   playlists: []
// }

export default class PlaylistView extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.title}</p>
        <p>{this.props.desc}</p>
      </div>
    )
  }
}
