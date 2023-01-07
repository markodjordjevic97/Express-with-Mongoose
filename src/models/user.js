const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cart: {
      items: [
        // Embedded document
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    methods: {
      async deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter((item) => {
          return item.productId._id.toString() !== productId.toString();
        });
        this.cart.items = updatedCartItems;
        return this.save();
      },
      async clearCart() {
        this.cart = { items: [] };
        return this.save();
      },
      async addToCart(product) {
        let cartProductIndex = -1;
        let updatedCardItems = [];

        if (this.cart && product) {
          cartProductIndex = this.cart.items.findIndex(
            (cp) => cp.productId.toString() === product._id.toString()
          );
          updatedCardItems = [...this.cart.items];
        }

        if (cartProductIndex > -1) {
          updatedCardItems[cartProductIndex].quantity =
            this.cart.items[cartProductIndex].quantity + 1;
        } else {
          updatedCardItems.push({
            productId: new ObjectId(product._id),
            quantity: 1,
          });
        }

        const updatedCart = { items: updatedCardItems };

        this.cart = updatedCart;
        return await this.save();
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);

// const getDb = require("../helpers/database").getDb;
// const { ObjectId } = require("mongodb");
//
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//
//   async save() {
//     const db = getDb();
//
//     return db.collection("users").insertOne(this);
//   }
//
//   getCart() {
//     const db = getDb();
//
//     const productIds = this.cart.items.map((i) => i.productId);
//
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }
//
//   async addToCart(product) {
//     let cartProductIndex = -1;
//     let newQuantity = 1;
//     let updatedCardItems = [];
//
//     if (this.cart && product) {
//       cartProductIndex = this.cart.items.findIndex(
//         (cp) => cp.productId.toString() === product._id.toString()
//       );
//       updatedCardItems = [...this.cart.items];
//     }
//
//     if (cartProductIndex > -1) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCardItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCardItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//
//     const updatedCart = { items: updatedCardItems };
//
//     const db = getDb();
//
//     return db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }
//
//   async deleteItemFromCart(productId) {
//     const db = getDb();
//     try {
//       const updatedCartItems = this.cart.items.filter(
//         (item) => item.productId.toString() !== productId
//       );
//
//       return db
//         .collection("users")
//         .updateOne(
//           { _id: this._id },
//           { $set: { cart: { items: updatedCartItems } } }
//         );
//     } catch (err) {
//       console.log("Error from user: ", err);
//     }
//   }
//
//   async addOrder() {
//     const db = getDb();
//     this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       });
//   }
//
//   async getOrders() {
//     const db = getDb();
//
//     return db.collection("orders").find({}).toArray();
//   }
//
//   static async findById(id) {
//     const db = getDb();
//
//     return db.collection("users").findOne({ _id: new ObjectId(id) });
//   }
//
//   static async findAllUsers() {
//     const db = getDb();
//     return db.collection("users").find({}).toArray();
//   }
// }
//
// module.exports = User;
