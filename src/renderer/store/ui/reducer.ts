import {
  SET_VIEWING_PLAYLIST, UiActionTypes, UiState
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

    default:
      return state
  }
}
