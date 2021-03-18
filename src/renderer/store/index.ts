import { combineReducers } from 'redux'
import { playbackReducer } from './playback/reducer'

const rootReducer = combineReducers({
  playback: playbackReducer
})

export type RootReducer = ReturnType<typeof rootReducer>
