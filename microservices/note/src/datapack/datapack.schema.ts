import { Schema } from 'mongoose';

export const DatapackSchema = new Schema(
  {
    content: { required: true, type: Array<any> },
    bottomsheet: { required: true, type: Array<any> },
    author: { required: true, type: String },
    namespace: { required: true, type: String },
  },
  { versionKey: false },
);
