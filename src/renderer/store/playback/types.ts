import PlaylistInterface from '../../../../interfaces/playlist'

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
  playlist: PlaylistInterface | null
}

export const SET_PLAYBACK_STATE = 'SET_PLAYBACK_STATE'
export const SET_PLAYBACK_TRACK = 'SET_PLAYBACK_TRACK'
export const SET_PLAYBACK_ETIME = 'SET_PLAYBACK_ETIME'
export const PLAYBACK_ETIME_TICK = 'PLAYBACK_ETIME_TICK'
export const TOGGLE_PLAYBACK = 'TOGGLE_PLAYBACK'
export const SET_PLAYBACK_PLAYLIST = 'SET_PLAYBACK_PLAYLIST'

interface UpdatePlaybackStateAction {
  type: typeof SET_PLAYBACK_STATE,
  state: PlayerState,
  duration: number | null
}

interface SetPlaybackPlaylist {
  type: typeof SET_PLAYBACK_PLAYLIST,
  playlist: PlaylistInterface
}

interface SetTrackIdxAction {
  type: typeof SET_PLAYBACK_TRACK,
  trackIdx: number
}

interface SetETimeAction {
  type: typeof SET_PLAYBACK_ETIME,
  eTime: number
}

interface TogglePlayback {
  type: typeof TOGGLE_PLAYBACK
}

interface PlaybackETimeTick {
  type: typeof PLAYBACK_ETIME_TICK
}

export type PlaybackActionTypes = UpdatePlaybackStateAction | SetPlaybackPlaylist | SetTrackIdxAction | SetETimeAction | TogglePlayback | PlaybackETimeTick
