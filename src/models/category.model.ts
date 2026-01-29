import mongoose from "mongoose";
import * as yup from "yup";

const Schema = mongoose.Schema;

export const categoryDAO = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  icon: yup.string().required(),
});

export type Category = yup.InferType<typeof categoryDAO>;

export const CATEGORY_MODEL_NAME = "Category";

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    icon: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
).index({
  name: "text",
});

const CategoryModel = mongoose.model(CATEGORY_MODEL_NAME, CategorySchema);
export default CategoryModel;
