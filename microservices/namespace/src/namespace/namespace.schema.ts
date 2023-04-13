import { Schema } from 'mongoose';

export default new Schema(
  {
    state: { type: String, required: true },
    name: { type: String, required: true },
    operator: { type: String, required: true },
    authors: { type: Array, required: true },
    founder: { type: String, required: true },
    include: { type: Array, required: true },
    primaryColor: { type: String, required: true },
    secoundColor: { type: String, required: true },
    theme: { type: String },
  },
  {
    versionKey: false,
  },
);
