import {
  SET_VIEWING_PLAYLIST, SHOW_CAMPAIGN, UiActionTypes, UiState
} from './types'

const initialState: UiState = {
  playlist: null
}

export function uiReducer(
  state = initialState, action: UiActionTypes
): UiState {
  switch (action.type) {
    case SET_VIEWING_PLAYLIST:
      return {
        ...state,
        playlist: action.playlist
      }

    case SHOW_CAMPAIGN:
      return {
        ...state,
        showCampaignDisplay: action.show
      }

    default:
      return state
  }
}
