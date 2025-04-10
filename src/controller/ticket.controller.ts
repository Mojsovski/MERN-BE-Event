import { Response } from "express";
import { IPaginatinationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import TicketModel, { ticketDAO, TTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await ticketDAO.validate(req.body);
      const result = await TicketModel.create(req.body);

      response.success(res, result, "success create a ticket");
    } catch (error) {
      response.error(res, error, "failed create a ticket");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
      } = req.query as unknown as IPaginatinationQuery;

      const query: FilterQuery<TTicket> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await TicketModel.find(query)
        .populate("events")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await TicketModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: page,
        },
        "success find all ticket"
      );
    } catch (error) {
      response.error(res, error, "failed find all ticket");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findById(id);

      response.success(res, result, "success find a ticket");
    } catch (error) {
      response.error(res, error, "failed find a ticket");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      response.success(res, result, "success update a ticket");
    } catch (error) {
      response.error(res, error, "failed update a ticket");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndDelete(id, {
        new: true,
      });

      response.success(res, result, "success remove a ticket");
    } catch (error) {
      response.error(res, error, "failed remove a ticket");
    }
  },

  async findAllByEvent(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;

      if (!isValidObjectId(eventId)) {
        response.error(res, null, "ticket not found");
        return;
      }

      const result = await TicketModel.find({ events: eventId });
      response.success(res, result, "success find all by event at ticket");
    } catch (error) {
      response.error(res, error, "failed find all by event at ticket");
    }
  },
};
