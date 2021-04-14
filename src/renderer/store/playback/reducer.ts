// https://redux.js.org/recipes/usage-with-typescript/#type-checking-actions--action-creators

import {
  PlaybackActionTypes, PlayBackState, PLAYBACK_ETIME_TICK, PlayerState,
  SET_PLAYBACK_ETIME, SET_PLAYBACK_PLAYLIST,
  SET_PLAYBACK_STATE, SET_PLAYBACK_TRACK, TOGGLE_PLAYBACK
} from './types'

const initialState: PlayBackState = {
  playerReady: false,
  status: PlayerState.Loading,
  duration: 0,
  eTime: 0,
  currSongIdx: null,
  playlist: null
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

    case SET_PLAYBACK_PLAYLIST:
      return {
        ...state,
        playlist: action.playlist
      }

    case SET_PLAYBACK_ETIME:
      return {
        ...state,
        eTime: action.eTime
      }

    case PLAYBACK_ETIME_TICK:
      return {
        ...state,
        eTime: state.eTime + 1
      }

    case SET_PLAYBACK_TRACK:
      return {
        ...state,
        currSongIdx: action.trackIdx
      }

    case TOGGLE_PLAYBACK:
      if (state.status == PlayerState.Paused) {
        return {
          ...state,
          status: PlayerState.Playing
        }
      } else {
        return {
          ...state,
          status: PlayerState.Paused
        }
      }

    default:
      return state
  }
}
