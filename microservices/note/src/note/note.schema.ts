import { Schema } from 'mongoose';

export const NoteSchema = new Schema(
  {
    title: { required: true, type: String },
    content: { required: true, type: Array<any> },
    author: { required: true, type: Number },
    tag: { required: true, type: Array<string> },
    photo: { type: String },
    category: { type: String },
  },
  { versionKey: false },
);
