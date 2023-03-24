import { Schema } from 'mongoose';

export const AdminSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String },
  },
  {
    versionKey: false,
  },
);
