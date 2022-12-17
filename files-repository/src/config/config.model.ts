export interface ConfigModel {
  name: string;
  port: number;
  redis: {
    port: number;
    host: string;
  };
  token: {
    secret: string;
    ttl: number;
  };
  kafka:{
    brokers:string[];
  };
  mongo: {
    connection: string;
  };
  photo: {
    maxSize: number;
    rate: 'B' | 'KB' | 'MB' | 'GB';
    path: string;
  };
  video: {
    maxSize: number;
    rate: 'B' | 'KB' | 'MB' | 'GB';
    path: string;
  };
  audio: {
    maxSize: number;
    rate: 'B' | 'KB' | 'MB' | 'GB';
    path: string;
  };
  doc: {
    maxSize: number;
    rate: 'B' | 'KB' | 'MB' | 'GB';
    path: string;
  };
}
