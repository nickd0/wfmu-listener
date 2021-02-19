// https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import React, { State } from 'react'
import { FeedGroup, FeedList } from "./styles";
import { ShowName, ShowSub } from '../../styles/GlobalStyle'
import PlaylistInterface from "../../../interfaces/playlist";

import { ipcRenderer } from "electron";

// TODO: consolidate this with the actual ts classes
interface PlaylistFeed {
  showName: string;
  dateStr: string;
}

interface State {
  playlists: PlaylistInterface[]
}

interface Props {
  clickHandler: (pl: PlaylistInterface) => void
}

export default class TrayView extends React.Component<Props, State> {
  state: Readonly<State> = { playlists: [] }

  componentDidMount(): void {
    ipcRenderer.on('PLAYLISTS_LOADED', (event, data) => {
      this.setState({ playlists: data.playlists })
    })
  }

  render() {
    return (
      <FeedList>
        {
          this.state.playlists.map((pl: PlaylistInterface) => (
            <FeedGroup key={pl.id} onClick={this.props.clickHandler.bind(this, pl)}>
              <ShowName>{pl.showName}</ShowName>
              <ShowSub>{pl.dateStr}</ShowSub>
            </FeedGroup>
          ))
        }
      </FeedList>
    )
  }
}
