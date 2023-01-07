const router = require("express").Router();

const adminController = require("../controllers/admin");

router.get("/products", adminController.getAllProducts);

router.get("/products/:productId", adminController.getProduct);

router.post("/product", adminController.addProduct);

router.put("/product", adminController.updateProduct);

router.delete("/product", adminController.deleteProduct);

module.exports = router;
