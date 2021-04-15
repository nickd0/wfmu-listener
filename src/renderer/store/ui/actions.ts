import PlaylistInterface from '../../../../interfaces/playlist'
import {
  SET_VIEWING_PLAYLIST, SHOW_CAMPAIGN, UiActionTypes, UiState
} from './types'

export function setViewingPlaylist(playlist: PlaylistInterface | null): UiActionTypes {
  return {
    type: SET_VIEWING_PLAYLIST,
    playlist
  }
}

export function showCampaign(show: boolean): UiActionTypes {
  return {
    type: SHOW_CAMPAIGN,
    show
  }
}

