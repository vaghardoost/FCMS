export interface Result<T> {
  code: Code;
  success: boolean;
  message?: string;
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
  CreateDatapack,
  GetDatapack,
  NamespaceDatapack,
  DatapackList,
  UpdateDatapack,
  DeleteDatapack
}

export const ServiceError = { code:0,success:false,message:'service internal error' };