import mongoose, { Schema, Types } from "mongoose";

export interface EventDocument {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  banner: string;

  category: Types.ObjectId;
  slug?: string;

  isFeatured: boolean;
  isOnline: boolean;
  isPublish: boolean;

  createdBy: Types.ObjectId;

  location: {
    region: number;
    coordinates: number[];
    address?: string;
  };
}

export const EVENT_MODEL_NAME = "Event";

const EventSchema = new Schema<EventDocument>(
  {
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, required: true },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    isFeatured: { type: Boolean, required: true },
    isOnline: { type: Boolean, required: true },
    isPublish: { type: Boolean, default: false },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    location: {
      region: { type: Number, required: true },
      coordinates: { type: [Number], default: [0, 0] },
      address: String,
    },
  },
  { timestamps: true },
);

EventSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().split(" ").join("-");
  }
  next();
});

export default mongoose.model<EventDocument>(EVENT_MODEL_NAME, EventSchema);
