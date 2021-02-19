// https://blog.logrocket.com/building-a-menu-bar-application-with-electron-and-react/
import React, { State } from 'react'
import { FeedGroup, FeedList, ShowName, ShowSub } from "./styles";

import { ipcRenderer } from "electron";

// TODO: consolidate this with the actual ts classes
interface PlaylistFeed {
  showName: string;
  djName: string;
  dateStr: string;
}

interface State {
  playlists: Array<PlaylistFeed>
}

export default class TrayView extends React.Component {
  state: Readonly<State> = { playlists: [] }

  componentDidMount() {
    ipcRenderer.on('PLAYLISTS_LOADED', (event, data) => {
      this.setState({ playlists: data.playlists })
    })
  }

  render() {
    return (
      <FeedList>
        {
          this.state.playlists.map((pl: PlaylistFeed) => (
            <FeedGroup key={pl.showName}>
              <ShowName>{pl.showName}</ShowName>
              <ShowSub>{pl.djName ? `${pl.djName} | ${pl.dateStr}` : pl.dateStr}</ShowSub>
            </FeedGroup>
          ))
        }
      </FeedList>
    )
  }
}
