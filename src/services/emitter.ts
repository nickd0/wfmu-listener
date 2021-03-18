import EventEmitter from 'eventemitter3'

const SystemEmitter = new EventEmitter()

export default SystemEmitter

export const EMITTER_PLAYBACK_TRACK_SELECT = 'renderer:playback:track-select'

export interface PlaybackTrackSelectAction {
  playlistId: number,
  trackIdx: number
}
