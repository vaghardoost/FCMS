export interface FileModel {
  id?: string;
  postfix: string;
  mimetype: string;
  namespace: string;
  admin: string;
  type: 'photo' | 'video' | 'audio' | 'doc';
}
