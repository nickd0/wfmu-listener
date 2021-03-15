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
  trackNameLeft: number,
  trackNameDir: number
}

export const SET_PLAYBACK_STATUS = 'SET_PLAYBACK_STATUS'
