import { Schema } from 'mongoose';

export const CategorySchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    admin: { type: Number, required: true },
    description: { type: String, required: true },
    parent: { type: String },
    color: { type: String },
    avatar: { type: String }
  },
  { versionKey: false },
);
