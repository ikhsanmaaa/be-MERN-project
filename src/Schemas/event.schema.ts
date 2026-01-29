import * as yup from "yup";

export const createEventSchema = yup.object({
  name: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  description: yup.string().required(),
  banner: yup.string().required(),

  category: yup.string().required(),

  isFeatured: yup.boolean().required(),
  isOnline: yup.boolean().required(),
  isPublish: yup.boolean(),

  location: yup
    .object({
      region: yup.number().required(),
      coordinates: yup.array().of(yup.number()).length(2).required(),
      address: yup.string(),
    })
    .required(),
});

export const updateEventSchema = yup.object({
  name: yup.string(),
  startDate: yup.string(),
  endDate: yup.string(),
  description: yup.string(),
  banner: yup.string(),

  category: yup.string(),

  isFeatured: yup.boolean(),
  isOnline: yup.boolean(),
  isPublish: yup.boolean(),

  location: yup
    .object({
      region: yup.number(),
      coordinates: yup.array().of(yup.number()).length(2),
      address: yup.string(),
    })
    .notRequired(),
});
