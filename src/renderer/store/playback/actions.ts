import { PlaybackActionTypes, PlayerState, SET_PLAYBACK_ETIME, SET_PLAYBACK_STATE, SET_PLAYBACK_TRACK } from './types'

export function updatePlaybackState(state: PlayerState, duration: number | null): PlaybackActionTypes {
  return {
    type: SET_PLAYBACK_STATE,
    state,
    duration
  }
}

export function setPlaybackTrackIdx(trackIdx: number): PlaybackActionTypes {
  return {
    type: SET_PLAYBACK_TRACK,
    trackIdx
  }
}

export function setPlaybackEtime(eTime: number): PlaybackActionTypes {
  return {
    type: SET_PLAYBACK_ETIME,
    eTime
  }
}
