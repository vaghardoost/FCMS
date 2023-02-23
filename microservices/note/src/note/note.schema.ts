import { Schema } from 'mongoose';

export const NoteSchema = new Schema(
  {
    id: { required: true, type: String },
    title: { required: true, type: String },
    content: { required: true, type: Array<any> },
    author: { required: true, type: Number },
    createAt: { required: true, type: String },
    tag: { required: true, type: Array<string> },
    photo: { type: String },
    category: { type: String },
  },
  { versionKey: false },
);
