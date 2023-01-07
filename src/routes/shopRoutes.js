const router = require("express").Router();

const shopController = require("../controllers/shop");

// Products
router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductById);

// Cart
router.post("/cart", shopController.postCart);

router.get("/cart", shopController.getCart);

router.delete("/cart", shopController.deleteCartProduct);

// Orders
router.post("/order", shopController.createOrder);

router.get("/orders", shopController.getOrders);

module.exports = router;
