import { Schema } from 'mongoose';

export default new Schema(
  {
    name: { type: String, required: true },
    operator: { type: String, required: true },
    primaryColor: { type: String, required: true },
    secoundColor: { type: String, required: true },
    founder: { type: String, required: true },
    authors: { type: Array, required: true },
    state: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);
