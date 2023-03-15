export interface FileModel {
  id: string;
  path: string;
  demo: string;
  postfix: string;
  admin: number;
  type: 'photo' | 'video' | 'audio' | 'doc';
}
