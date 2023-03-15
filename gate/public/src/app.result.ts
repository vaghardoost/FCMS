// structure of microservices response
export interface MicroserviceRes<T> {
  header:Header;
  response?:Response<T>;
}

// the part of message received of services for gate
interface Header {
  code:HeaderCode;
  payload?:any;
}

// the part of message received of services for gate
export interface Response<T>{
    code:number;
    message:string;
    success:boolean;
    payload?:T;
}

export enum HeaderCode {
  SUCCESS,
  NOT_EXISTS,
  CONFLICT,
}