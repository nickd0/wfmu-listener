import PlaylistInterface from '../../../../interfaces/playlist'
import {
  SET_VIEWING_PLAYLIST, UiActionTypes, UiState
} from './types'

export function setViewingPlaylist(playlist: PlaylistInterface | null): UiActionTypes {
  return {
    type: SET_VIEWING_PLAYLIST,
    playlist
  }
}
