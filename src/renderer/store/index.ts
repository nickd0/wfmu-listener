import { combineReducers, createStore } from 'redux'
import { playbackReducer } from './playback/reducer'
import { uiReducer } from './ui/reducer'

const rootReducer = combineReducers({
  playback: playbackReducer,
  ui: uiReducer
})

export type RootReducer = ReturnType<typeof rootReducer>

// TODO middleware?

const store = createStore(rootReducer, {})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
