import { Schema } from 'mongoose';

export const TicketSchema = new Schema(
  {
    namespace: { type: String, required: true },
    admin: { type: String, required: true },
    open: { type: Boolean, required: true },
    title: { type: String, required: true },
    messages: { type: Array, required: true },
  },
  { versionKey: false },
);
