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
  playlist: null,
  isScrubbing: false
}

export function playbackReducer(
  state = initialState, action: PlaybackActionTypes
): PlayBackState {
  switch (action.type) {
    case SET_PLAYBACK_STATE:
      return {
        ...state,
        status: action.state,
        isScrubbing: action.isScrubbing ?? state.isScrubbing,
        duration: action.duration || state.duration
      }

    case SET_PLAYBACK_PLAYLIST:
      return {
        ...state,
        playlist: action.playlist
      }

    case PLAYBACK_ETIME_TICK:
    case SET_PLAYBACK_ETIME:
      // return {
      //   ...state,
      //   eTime: action.eTime
      // }

      let updateEtime = state.eTime + 1
      if (action.type == SET_PLAYBACK_ETIME) {
        updateEtime = action.eTime
      }
      
      let updatedIdx = 0;
      if (state.currSongIdx != null) {
        state.playlist?.songs.forEach((song, i) => {
          if (updateEtime >= (song.timestamp ?? 0)) {
            if (updateEtime < ((state.playlist?.songs[i + 1]?.timestamp ?? 0))) {
              updatedIdx = i
            }
          }
        })
      }

      return {
        ...state,
        currSongIdx: updatedIdx,
        eTime: updateEtime
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
