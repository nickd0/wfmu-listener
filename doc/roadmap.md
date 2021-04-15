## v0.1.0
- [X] Display archives
- [X] Drill into playlist
- [ ] Link to donate page and playlist page
  - After a certain number of streams
  - Pull currently campaigns from server
- [x] Playlist URL capture
- [x] When on playlist page, user can choose to display the playlist's style or default
- [x] Stream archive file (using Howler?)
- [x] Player control; Playback continues while navigating back to feed page
- [ ] ~~Redux (especially for managing player state)~~
  - Use Emitter for now for simplicity
- [x] Click track to skip to it
- [ ] Play a different playlist while playing
- [x] Styling
- [ ] Tests
- [ ] Timeouts and error handling
- [ ] Cleanup, revamp electron, model, interface files
- [x] Integrate media controls
  - See https://github.com/electron/electron/issues/5268
  - https://github.com/MarshallOfSound/electron-media-service
  - https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-
- [x] Structure/organization
  - [x] src/main and src/renderer
- [ ] Copy song/artist to clipboard

## v0.2.0
- [ ] Sharable show recommendation files that include a playlist id and specific tracks
- [ ] Integrate media controls
  - https://github.com/ytmdesktop/ytmdesktop/blob/master/main.js
  - https://github.com/dbusjs/mpris-service for linux
  - @nodert-win10/windows.media for win10
  - See https://github.com/electron/electron/issues/5268
  - https://github.com/MarshallOfSound/electron-media-service
  - https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-
- [ ] Redux (especially for managing player state)
  - Clean up ipc and logic around track selection and new playlist
- [ ] Live listening
- [ ] Skip to next playlist when one finishes
- [ ] Drag and drop playlist links
- [ ] Persist currently playing playlist, timestamp, favorites, etc
- [ ] Filter recent archives by your favorite shows
- [ ] Mark playlists and shows as listened and favorited
- [ ] Load more playlists

## v1.0.0
- [ ] Spotify integration, save to playlists, etc
- [ ] MacOS touchbar integration: https://www.electronjs.org/docs/api/touch-bar
- [ ] Live listening with accuplaylist comments integration
