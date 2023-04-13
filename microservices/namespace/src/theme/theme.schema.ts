import { Schema } from 'mongoose';

export default new Schema(
  {
    name: { type: String, required: true },
    base: { type: String, required: true },
    include: { type: Array, required: true },
  },
  {
    versionKey: false,
  },
);
