const router = require("express").Router();
const { Orders, validate } = require("../models/order");
const { Product, validate1 } = require("../models/product");
const { User, validate2 } = require("../models/user");
const SendMail = require("../middlewares/sendmail");

router.post("/add", async (req, resp) => {
  try {
    let ref = Date.now() + new Date().getTime();

    JSON.parse(req.body.cart).forEach(async function (ele) {
      console.log({
        quantity: ele.quantity - ele.cart_qty,
      });
      await Product.find({ _id: ele._id }).updateOne({
        quantity: ele.quantity - ele.cart_qty,
      });
    });

    await new Orders({
      total: req.body.total,
      ref: ref,
      user: req.body.user,
      products: req.body.cart,
      address: req.body.address,
      status: 2,
    }).save();

    console.log({
      total: req.body.total,
      ref: ref,
      user: req.body.user,
      products: req.body.cart,
      status: 2,
    });

    const data = await User.findOne({ _id: req.body.user });

    if (data) {
      SendMail(
        data.email,
        "Order Confirmation",
        `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Your order has recieved.</h2>
      <p>Thank you for using EasyAgro web application to shop online.
      <br>
      
      </p>
      
      <a href=# style="background: green; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Your (order ${ref}) of total (LKR ${req.body.total}) has been recieved and deliever with in 7 days</a>
  
      <p>if you have a question regarding the order, please let us know at easyagroagrarian@gmail.com</p>
  
      
      </div>`
      );
    }

    //"Your order (" + ref + ") of total (LKR " + req.body.total + ") has been recieved and deliever with in 7 days "

    return resp.status(200).send({ message: "Order Recieved" });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/list", async (req, resp) => {
  try {
    let data = [];
    if (req.body.isadmin == 2) {
      data = await Orders.find({ user: req.body.user });
    } else {
      data = await Orders.find();
    }
    return resp.status(200).send(data);
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

module.exports = router;
