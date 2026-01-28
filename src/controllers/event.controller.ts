import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel from "../models/event.model";
import { createEventSchema, updateEventSchema } from "../Schemas/event.schema";
import { serializeEvent } from "../Serializers/event.serializer";

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

      await updateEventSchema.validate(req.body, { abortEarly: false });

      const result = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
        lean: true,
      });

      response.success(res, serializeEvent(result), "success update event");
    } catch (error) {
      response.error(res, error, "failed to update event");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const result = await EventModel.find().sort({ createdAt: -1 }).lean();

      response.success(
        res,
        result.map(serializeEvent),
        "success fetch all events",
      );
    } catch (error) {
      response.error(res, error, "failed fetch events");
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
      await EventModel.findByIdAndDelete(id);
      response.success(res, null, "success delete event");
    } catch (error) {
      response.error(res, error, "failed delete event");
    }
  },
};
