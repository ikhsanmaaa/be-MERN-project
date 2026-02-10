import { Response } from "express";
import { IPaginationQuerry, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel, { IEvent } from "../models/event.model";
import { createEventSchema, updateEventSchema } from "../Schemas/event.schema";
import {
  serializeEvent,
  serializeEventArray,
} from "../Serializers/event.serializer";
import { FilterQuery, isValidObjectId } from "mongoose";
import uploader from "../utils/uploader";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = {
        ...req.body,
      };
      await createEventSchema.validate(req.body, { abortEarly: false });

      const result = await EventModel.create(payload);

      response.success(res, serializeEvent(result), "success create an event");
    } catch (error) {
      response.error(res, error, "failed to create event");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "banner is not found!");
      }
      await updateEventSchema.validate(req.body, { abortEarly: false });

      const result = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
        lean: true,
      });

      if (!result) return response.notFound(res, "event not found");

      response.success(res, serializeEvent(result), "success update event");
    } catch (error) {
      response.error(res, error, "failed to update event");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<IEvent> = {};

        if (filter.search) query.$text = { $search: filter.search };
        if (filter.category) query.category = filter.category;
        if (filter.isOnline) query.isOnline = filter.isOnline;
        if (filter.isPublish) query.isPublish = filter.isPublish;
        if (filter.isFeatured) query.isFeatured = filter.isFeatured;
        return query;
      };

      const {
        limit = 10,
        page = 1,
        search,
        category,
        isOnline,
        isFeatured,
        isPublish,
      } = req.query;

      const query = buildQuery({
        search,
        category,
        isPublish,
        isFeatured,
        isOnline,
      });
      const result = await EventModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await EventModel.countDocuments(query);

      response.pagination(
        res,
        serializeEventArray(result),
        {
          total: count,
          current: +page,
          totalPages: Math.ceil(count / +limit),
        },
        "success find all tickets",
      );
    } catch (error) {
      response.error(res, error, "failed find events");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    const { id } = req.params;
    const result = await EventModel.findById(id).lean();

    if (!result) {
      return response.notFound(res, "event not found!");
    }

    response.success(res, serializeEvent(result), "success find one event");
  },

  async findOneBySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await EventModel.findOne({ slug });
      response.success(
        res,
        serializeEvent(result),
        "success find event by slug",
      );
      response.success(
        res,
        serializeEvent(result),
        "success find event by slug",
      );
    } catch (error) {
      response.error(res, error, "failed find event by slug");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed remove event");
      }

      const result = await EventModel.findByIdAndDelete(id, {
        new: true,
      });

      if (!result) return response.notFound(res, "event not found");

      await uploader.remove(result?.banner);

      response.success(res, null, "success delete event");
    } catch (error) {
      response.error(res, error, "failed delete event");
    }
  },
};
