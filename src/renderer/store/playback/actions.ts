import PlaylistInterface from '../../../../interfaces/playlist'
import {
  PlaybackActionTypes, PLAYBACK_ETIME_TICK, PlayerState, SET_PLAYBACK_ETIME,
  SET_PLAYBACK_PLAYLIST, SET_PLAYBACK_STATE, SET_PLAYBACK_TRACK,
  TOGGLE_PLAYBACK
} from './types'

export function updatePlaybackState(state: PlayerState, duration: number | null, isScrubbing: boolean | null): PlaybackActionTypes {
  return {
    type: SET_PLAYBACK_STATE,
    state,
    isScrubbing,
    duration
  }
}

export function togglePlayback(): PlaybackActionTypes {
  return {
    type: TOGGLE_PLAYBACK
  }
}

export function setPlaybackPlaylist(playlist: PlaylistInterface): PlaybackActionTypes {
  return {
    type: SET_PLAYBACK_PLAYLIST,
    playlist
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

export function playbackEtimeTick(): PlaybackActionTypes {
  return {
    type: PLAYBACK_ETIME_TICK
  }
}
