import { Response } from "express";
import { IReqUser, IPaginatinationQuery } from "../utils/interface";
import OrderModel, {
  orderDAO,
  OrderStatus,
  TOrder,
  TVoucher,
} from "../models/order.model";
import response from "../utils/response";
import { FilterQuery, isValidObjectId } from "mongoose";
import TicketModel from "../models/ticket.model";
import { getId } from "../utils/id";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const payload = {
        ...req.body,
        createdBy: userId,
      } as TOrder;

      await orderDAO.validate(payload);

      const ticket = await TicketModel.findById(payload.ticket);

      if (!ticket) {
        return response.notFound(res, "ticket not found");
      }

      if (ticket.quantity < payload.quantity) {
        response.error(res, null, "ticket quantity is not enough");
        return;
      }

      const total: number = ticket?.price * payload.quantity;

      Object.assign(payload, { ...payload, total });

      const result = await OrderModel.create(payload);

      response.success(res, result, "success create a order");
    } catch (error) {
      response.error(res, error, "failed create a order");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TOrder> = {};

        if (filter.search) query.$text = { $search: filter.search };

        return query;
      };

      const { limit = 10, page = 1, search } = req.query;

      const query = buildQuery({
        search,
      });

      const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await OrderModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "success find all orders"
      );
    } catch (error) {
      response.error(res, error, "failed find all orders");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await OrderModel.findOne({
        orderId,
      });

      if (!result) {
        return response.notFound(res, "order not found");
      }

      response.success(res, result, "success find one a order");
    } catch (error) {
      response.error(res, error, "failed find one a order");
    }
  },

  async findAllByMember(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      const buildQuery = (filter: any) => {
        let query: FilterQuery<TOrder> = {
          createdBy: userId,
        };

        if (filter.search) query.$text = { $search: filter.search };

        return query;
      };

      const { limit = 10, page = 1, search } = req.query;

      const query = buildQuery({
        search,
      });

      const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await OrderModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "success find all orders"
      );
    } catch (error) {
      response.error(res, error, "failed find all orders");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await OrderModel.findByIdAndDelete(
        { orderId },
        { new: true }
      );

      if (!result) {
        response.notFound(res, "order not found");
      }
      response.success(res, result, "success to remove a order");
    } catch (error) {
      response.error(res, error, "failed to remove a order");
    }
  },

  async complete(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await OrderModel.findOne({
        orderId,
        createdBy: userId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === OrderStatus.COMPLETED) {
        response.error(res, null, "you have been completed this order");
        return;
      }

      const vouchers: TVoucher[] = Array.from(
        { length: order.quantity },
        () => {
          return {
            isPrint: false,
            voucherId: getId(),
          } as TVoucher;
        }
      );

      const result = await OrderModel.findOneAndUpdate(
        {
          orderId,
          createdBy: userId,
        },
        { vouchers, status: OrderStatus.COMPLETED },
        { new: true }
      );

      const ticket = await TicketModel.findById(order.ticket);
      if (!ticket) return response.notFound(res, "order not found");

      await TicketModel.updateOne(
        { _id: ticket._id },
        { quantity: ticket.quantity - order.quantity }
      );

      response.success(res, result, "success to complete an order");
    } catch (error) {
      response.error(res, error, "failed to complete an order");
    }
  },

  async pending(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await OrderModel.findOne({
        orderId,
        createdBy: userId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === OrderStatus.COMPLETED) {
        response.error(res, null, "this order has been completed");
        return;
      }

      if (order.status === OrderStatus.PENDING) {
        response.error(res, null, "this order in payment pending");
        return;
      }
      const result = await OrderModel.findByIdAndUpdate(
        {
          orderId,
          createdBy: userId,
        },
        { status: OrderStatus.PENDING },
        {
          new: true,
        }
      );
      response.success(res, result, "success to pending an order");
    } catch (error) {
      response.error(res, error, "failed to pending an order");
    }
  },

  async cancelled(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await OrderModel.findOne({
        orderId,
        createdBy: userId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === OrderStatus.COMPLETED) {
        response.error(res, null, "this order has been completed");
        return;
      }

      if (order.status === OrderStatus.CANCELLED) {
        response.error(res, null, "this order in payment cancelled");
        return;
      }
      const result = await OrderModel.findByIdAndUpdate(
        {
          orderId,
          createdBy: userId,
        },
        { status: OrderStatus.CANCELLED },
        {
          new: true,
        }
      );
      response.success(res, result, "success to cancelled an order");
    } catch (error) {
      response.error(res, error, "failed to cancelled an order");
    }
  },
};
