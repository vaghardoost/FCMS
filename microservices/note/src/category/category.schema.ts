import { Schema } from 'mongoose';

export const CategorySchema = new Schema(
  {
    label: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    parent: { type: String },
    color: { type: String },
    avatar: { type: String }
  },
  { versionKey: false },
);
