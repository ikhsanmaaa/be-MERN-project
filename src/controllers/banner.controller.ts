import { Response } from "express";
import { IPaginationQuerry, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import BannerModel, { bannerDAO, TypeBanner } from "../models/banner.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await bannerDAO.validate(req.body);

      const result = await BannerModel.create(req.body);

      response.success(res, result, "success create a banner");
    } catch (error) {
      response.error(res, error, "failed to create a banner");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuerry;
      const query: FilterQuery<TypeBanner> = {};
      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }
      const result = await BannerModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await BannerModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        "success find all banner",
      );
    } catch (error) {
      response.error(res, error, "failed to find all banner");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId) {
        return response.notFound(res, "banner not found!");
      }
      const result = await BannerModel.findById(id);

      if (!result) {
        return response.notFound(res, "banner not found!");
      }

      response.success(res, result, "success find banner by id");
    } catch (error) {
      response.error(res, error, "failed to find a banner");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId) {
        return response.notFound(res, "failed update banner");
      }
      const result = await BannerModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      response.success(res, result, "success update banner");
    } catch (error) {
      response.error(res, error, "failed to update banner");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId) {
        return response.notFound(res, "failed remove banner");
      }
      const result = await BannerModel.findByIdAndDelete(id);

      response.success(res, result, "success remove banner");
    } catch (error) {
      response.error(res, error, "failed to remove a banner");
    }
  },
};
