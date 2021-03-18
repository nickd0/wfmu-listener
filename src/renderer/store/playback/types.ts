export enum PlayerState {
  Loading,
  Ready,
  Playing,
  Paused
}

export interface PlayBackState {
  playerReady: boolean,
  status: PlayerState,
  duration: number,
  eTime: number,
  currSongIdx: number | null,
}

export const SET_PLAYBACK_STATE = 'SET_PLAYBACK_STATE'
export const SET_PLAYBACK_TRACK = 'SET_PLAYBACK_TRACK'
export const SET_PLAYBACK_ETIME = 'SET_PLAYBACK_ETIME'

interface UpdatePlaybackStateAction {
  type: typeof SET_PLAYBACK_STATE,
  state: PlayerState,
  duration: number | null
}

interface SetTrackIdxAction {
  type: typeof SET_PLAYBACK_TRACK,
  trackIdx: number
}

interface SetETimeAction {
  type: typeof SET_PLAYBACK_ETIME,
  eTime: number
}

export type PlaybackActionTypes = UpdatePlaybackStateAction | SetTrackIdxAction | SetETimeAction
