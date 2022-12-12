import { Schema } from 'mongoose';
export const FileSchema = new Schema({
  id: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true },
  postfix: { type: String, required: true },
  admin: { type: Number, required: true },
});
