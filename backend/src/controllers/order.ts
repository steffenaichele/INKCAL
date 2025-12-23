import { Order } from "#models";
import type { OrderDTO, OrderInputDTO } from "#schemas";
import type { RequestHandler } from "express";

// GET /orders
const getAllOrders: RequestHandler<{}, OrderDTO[]> = async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
};

// Post /orders
const createOrder: RequestHandler<{}, OrderDTO, OrderInputDTO> = async (req, res) => {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
};

// GET /orders/:id
const getOrderById: RequestHandler<{ id: string }, OrderDTO> = async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found", { cause: 404 });
    res.json(order);
};

// PUT /orders/:id
const updateOrder: RequestHandler<{ id: string }, OrderDTO, OrderInputDTO > = async (req, res) => {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) throw new Error("Order not found", { cause: 404 });
    res.json(updatedOrder);
};

// DELETE /orders/:id
const deleteOrder: RequestHandler<{ id: string }, { message: string }, OrderInputDTO> = async (req, res) => {
    const { id } = req.params;
    const foundOrder = await Order.findByIdAndDelete(id);
    if (!foundOrder) throw new Error("Order not found", { cause: 404 });
    res.json({ message: "Order deleted" });
}

export {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
};