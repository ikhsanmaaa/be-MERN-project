import mongoose, { Schema, Types } from "mongoose";

export interface IEvent {
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

const EventSchema = new Schema<IEvent>(
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

    location: {
      region: { type: Number, required: true },
      coordinates: { type: [Number], default: [0, 0] },
      address: String,
    },
  },
  { timestamps: true },
).index({
  name: "text",
});

EventSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().split(" ").join("-");
  }
  next();
});

const EventModel = mongoose.model<IEvent>(EVENT_MODEL_NAME, EventSchema);

export default EventModel;
