const Product = require("../models/product");
const Order = require("../models/order");

// Product
exports.getProducts = async (req, res, next) => {
  res.json(await Product.find({}));
};

exports.getProductById = async (req, res, next) => {
  res.json(await Product.findById(req.params.productId));
};

// Cart
exports.getCart = async (req, res, next) => {
  res.json(await req.user.populate("cart.items.productId"));
};

exports.postCart = async (req, res, next) => {
  const product = await Product.findById({ _id: req.body.productId });
  await req.user.addToCart(product);
  res.status(200).send();
};

exports.deleteCartProduct = async (req, res, next) => {
  try {
    await req.user.deleteItemFromCart(req.body.productId);

    res.status(204).send();
  } catch (err) {
    console.log("deleting product error: ", err);
  }
};

// Order
exports.createOrder = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");

  const newOrder = await new Order({
    user: {
      name: req.user.username,
      userId: req.user._id,
    },
    products: user.cart.items.map((i) => {
      return {
        quantity: i.quantity,
        product: i.productId,
      };
    }),
  }).save();
  await req.user.clearCart();
  res.json(newOrder);
};

exports.getOrders = async (req, res, next) => {
  res.json(await Order.find({ "user.userId": req.user._id }));
};
