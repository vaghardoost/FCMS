export interface ConfigModel {
  name: string;
  redis: {
    host: string;
    port: number;
    expireTime: number;
  };
  mongo: {
    connection: string;
  };
  kafka: {
    brokers:string[]
  };
}