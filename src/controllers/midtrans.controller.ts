import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import OrderModel, { OrderStatus } from "../models/order.model";

export default {
  async midtransWebhook(req: IReqUser, res: Response) {
    try {
      const { order_id, transaction_status } = req.body;

      let newStatus = OrderStatus.PENDING;

      if (transaction_status === "settlement") {
        newStatus = OrderStatus.COMPLETED;
      }

      if (
        transaction_status === "cancel" ||
        transaction_status === "deny" ||
        transaction_status === "expire"
      ) {
        newStatus = OrderStatus.CANCELLED;
      }

      await OrderModel.findOneAndUpdate(
        { orderId: order_id },
        { status: newStatus },
        { new: true },
      );

      return res.status(200).send("OK");
    } catch (error) {
      return res.status(500).send("error");
    }
  },
};
