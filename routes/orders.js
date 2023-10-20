import express from "express";
const router = express.Router();
import Order from "../models/orders.js";

const findAllorders = async (req, res) => {
  try {
    const orders = await Order.find().select("_id name products clientId status");
    return res.status(200).send({ message: "All orders", orders });
  } catch (error) {
    return res.status(501).send({ message: "error", error });
  }
};
const findOneOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ _id: id }).select("_id name products clientId status");
    return res.status(200).send({ message: "Order info", order });
  } catch (error) {
    return res.status(501).send({ message: "Error", error });
  }
};
const addOrder = async (req, res) => {
  try {
    const { name, products, clientId, status } = req.body;
    const order = new Order({ name, products, clientId, status });
    await order.save();
    //Agregar magia para crear el ordero en la base de datos!!
    return res
      .status(200)
      .send({ message: `Order Created ${name}`, order });
  } catch (error) {
    return res.status(501).send({ message: "Error", error });
  }
};


const updateOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, products, clientId, status } = req.body;
  
      const orderToUpdate = await Order.findOne({ _id: id });
  
      if (!orderToUpdate) {
        return res.status(501).send({ message: 'Error order not found' });
      }
  
      if(name) orderToUpdate.name = name;
      if(products) orderToUpdate.products = products;
      if(clientId) orderToUpdate.clientId = clientId;
      if(status) orderToUpdate.status = status;
      await orderToUpdate.save();
  
      return res
        .status(200)
        .send({ message: 'order Updated', order: orderToUpdate });
    } catch (error) {
      return res.status(501).send({ message: 'Error', error });
    }
  };



const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderToDelete = await Order.findOne({ _id: id });

    if (!orderToDelete) {
      return res.status(501).send({ message: "Error order not found" });
    }
    await Order.deleteOne({ _id: id });
    return res.status(200).send({ message: "Order deleted", order: orderToDelete });

  } catch (error) {
    return res.status(501).send({ message: "Error", error });
  }
};

//CRUD (Create, Read, Update, Delete)
router.get("/", findAllorders);
router.get("/:id", findOneOrder);
router.post("/", addOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
