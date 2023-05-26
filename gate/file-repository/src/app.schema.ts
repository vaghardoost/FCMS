import { Schema } from 'mongoose';
export const FileSchema = new Schema({
  type: { type: String, required: true },
  postfix: { type: String, required: true },
  admin: { type: String, required: true },
  namespace: { type: String, required: true },
  mimetype: { type: String, required: true },
});
