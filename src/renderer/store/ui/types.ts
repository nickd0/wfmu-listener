import PlaylistInterface from '../../../../interfaces/playlist'

export interface UiState {
  playlist: PlaylistInterface | null
}

export const SET_VIEWING_PLAYLIST = 'SET_VIEWING_PLAYLIST'

interface SetViewingPlaylist {
  type: typeof SET_VIEWING_PLAYLIST,
  playlist: PlaylistInterface | null
}

export type UiActionTypes = SetViewingPlaylist
