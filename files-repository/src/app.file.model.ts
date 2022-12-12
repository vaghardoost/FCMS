export interface FileModel {
  id: string;
  path: string;
  postfix: string;
  admin: number;
  type: 'photo' | 'video' | 'audio' | 'doc';
}
