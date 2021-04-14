import SongInterface from "./song"

export interface PlaylistStyle {
  backgroundColor: string | undefined;
  background: string | undefined;
  color: string | undefined;
  fontFamily: string | undefined;
}

export default interface PlaylistInterface {
  id: number;
  showName: string;
  dateStr: string;
  playlistUrl: string;
  streamUrl: string;
  mp3Url: string | null;
  songs: SongInterface[];
  loaded: boolean;

  // TODO use a react
  style: unknown;

  fetchInfo(): Promise<PlaylistInterface>;
}
