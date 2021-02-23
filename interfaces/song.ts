export default interface SongInterface {
  title: string;
  artist: string;
  album: string | null;
  label: string | null;
  timestampStr: string | null;
  timestamp: number | null;
}
