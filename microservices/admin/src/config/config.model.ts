export interface ConfigModel {
  name: string;
  mongodb: {
    connection: string;
  };
  redis: {
    port: number;
    host: string;
  };
  kafka:{
    brokers:string[];
  }
}
