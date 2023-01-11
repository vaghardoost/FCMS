export interface Result<T> {
  code: Code;
  message: string;
  success: boolean;
  payload?: T;
}

// microservice code = 10

export enum Code {
  RefreshRedis = 101,
  CreateNote,
  GetNote,
  NoteList,
  NoteUpdate,
  NoteDelete,
  CreateCategory,
  GetCategory,
  ListCategory,
  UpdateCategory,
  DeleteCategory,
}

export const ServiceError = { code:0,success:false,message:'service internal error' };