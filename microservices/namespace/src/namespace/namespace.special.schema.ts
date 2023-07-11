import { Schema } from 'mongoose';

export default new Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);
