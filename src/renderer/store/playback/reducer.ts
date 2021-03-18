// https://redux.js.org/recipes/usage-with-typescript/#type-checking-actions--action-creators

import { PlaybackActionTypes, PlayBackState, PlayerState, SET_PLAYBACK_ETIME, SET_PLAYBACK_STATE, SET_PLAYBACK_TRACK } from './types'

const initialState: PlayBackState = {
  playerReady: false,
  status: PlayerState.Loading,
  duration: 0,
  eTime: 0,
  currSongIdx: null
}

export function playbackReducer(
  state = initialState, action: PlaybackActionTypes
): PlayBackState {
  switch (action.type) {
    case SET_PLAYBACK_STATE:
      return {
        ...state,
        status: action.state,
        duration: action.duration || state.duration
      }

    case SET_PLAYBACK_ETIME:
      return {
        ...state,
        eTime: action.eTime
      }

    case SET_PLAYBACK_TRACK:
      return {
        ...state,
        currSongIdx: action.trackIdx
      }

    default:
      return state
  }
}
