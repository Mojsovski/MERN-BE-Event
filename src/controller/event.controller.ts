import { Response } from "express";
import { IReqUser, IPaginatinationQuery } from "../utils/interface";
import EventModel, { eventDAO, TEvent } from "../models/event.model";
import response from "../utils/response";
import { FilterQuery } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body, createdBy: req.user?.id } as TEvent;
      await eventDAO.validate(payload);
      const result = await EventModel.create(payload);

      response.success(res, result, "success create an event");
    } catch (error) {
      response.error(res, error, "failed create an event");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
      } = req.query as unknown as IPaginatinationQuery;

      const query: FilterQuery<TEvent> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await EventModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await EventModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: page,
        },
        "success find all event"
      );
    } catch (error) {
      response.error(res, error, "failed find all event");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findById(id);

      response.success(res, result, "success find one event");
    } catch (error) {
      response.error(res, error, "failed find one an event");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      response.success(res, result, "success update an event");
    } catch (error) {
      response.error(res, error, "failed update an event");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findByIdAndDelete(id, {
        new: true,
      });

      response.success(res, result, "success remove an event");
    } catch (error) {
      response.error(res, error, "failed remove an event");
    }
  },

  async findOnebySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await EventModel.findOne({ slug });

      response.success(res, result, "success fine one by slug an event");
    } catch (error) {
      response.error(res, error, "failed fine one by slug an event");
    }
  },
};
