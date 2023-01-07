const Product = require("../models/product");

exports.getAllProducts = async (req, res, next) => {
  res.json(
    await Product.find().select("title price").populate("userId", "username")
  );
};

exports.getProduct = async (req, res, next) => {
  res.json(await Product.findById(req.params.productId));
};

exports.addProduct = async (req, res, next) => {
  const { title, price, imageUrl, description } = req.body;

  res.json(
    await new Product({
      title,
      price,
      description,
      imageUrl,
      userId: req.user,
    })
      .save()
      .catch((error) => console.log(error))
  );
};

exports.updateProduct = async (req, res, next) => {
  const { id, ...data } = req.body;

  res.json(await Product.updateOne({ _id: id }, { $set: data }));
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.body;

  res.json(await Product.deleteOne({ _id: productId }));
};
