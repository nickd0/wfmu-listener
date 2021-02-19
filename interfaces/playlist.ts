import SongInterface from "./song";

export default interface PlaylistInterface {
  id: number;
  showName: string;
  dateStr: string;
  playlistUrl: URL;
  streamUrl: URL;
  songs: Song[];
}
