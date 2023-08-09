import { Schema } from 'mongoose';

export const DatapackSchema = new Schema(
  {
    namespace: { required: true, type: String },
    author: { required: true, type: String },
    content: { required: true, type: Array<any> },
    title: { required: true, type: String },
    env: {},
  },
  { versionKey: false },
);
