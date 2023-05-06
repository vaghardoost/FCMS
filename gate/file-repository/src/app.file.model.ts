export interface FileModel {
  id?: string;
  demo?: string;
  postfix: string;
  mimetype: string;
  namespace: string;
  admin: string;
  type: 'photo' | 'video' | 'audio' | 'doc';
}
