// structure of microservices response
export interface MicroserviceRes<T> {
  header: Header;
  response?: Result<T>;
}

// the part of message received of services for gate
interface Header {
  code: HeaderCode;
  payload?: any;
}

// the part of message received of services for gate
export interface Result<T> {
  code: Code;
  success: boolean;
  payload?: T;
}

export enum HeaderCode {
  SUCCESS,
  NOT_EXISTS,
  CONFLICT,
}

// microservice code = 1000
export enum Code {
  Reload = 101,
  Create,
  SignIn,
  Upload,
  GetList,
}
