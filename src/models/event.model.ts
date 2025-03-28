import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

export const eventDAO = Yup.object({
  name: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  description: Yup.string().required(),
  banner: Yup.string().required(),
  isFeatured: Yup.boolean().required(),
  isOnline: Yup.boolean().required(),
  isPublish: Yup.boolean(),
  category: Yup.string().required(),
  slug: Yup.string(),
  createdBy: Yup.string().required(),
  createdAt: Yup.string(),
  updatedAt: Yup.string(),
  location: Yup.object().shape({
    region: Yup.number(),
    coordinates: Yup.array(),
    address: Yup.string(),
  }),
});

export type TEvent = Yup.InferType<typeof eventDAO>;

export interface IEvent extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    startDate: {
      type: Schema.Types.String,
      required: true,
    },
    endDate: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    banner: {
      type: Schema.Types.String,
      required: true,
    },
    isFeatured: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isOnline: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isPublish: {
      type: Schema.Types.Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },

    slug: {
      type: Schema.Types.String,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    location: {
      type: {
        region: {
          type: Schema.Types.Number,
        },
        coordinates: {
          type: [Schema.Types.Number],
          default: [0, 0],
        },
        address: {
          type: Schema.Types.String,
        },
      },
    },
  },
  { timestamps: true }
);

EventSchema.pre("save", function () {
  if (!this.slug) {
    const slug = this.name.split(" ").join("-").toLowerCase();

    this.slug = `${slug}`;
  }
});

const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;
