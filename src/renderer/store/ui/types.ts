import PlaylistInterface from '../../../../interfaces/playlist'

export interface UiState {
  playlist: PlaylistInterface | null,
  showCampaignDisplay: boolean
}

export const SET_VIEWING_PLAYLIST = 'SET_VIEWING_PLAYLIST'
export const SHOW_CAMPAIGN = 'SHOW_CAMPAIGN'

interface SetViewingPlaylist {
  type: typeof SET_VIEWING_PLAYLIST,
  playlist: PlaylistInterface | null
}

interface ShowCampaign {
  type: typeof SHOW_CAMPAIGN,
  show: boolean
}

export type UiActionTypes = SetViewingPlaylist | ShowCampaign
