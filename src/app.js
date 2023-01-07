const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const mongoConnect = require('./helpers/database') => mongoConnect(() => {app.listen(3000)})

const User = require("./models/user");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  User.findById("63b9dc2943e7898753a16b08")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);

app.use(userRoutes);
app.use(shopRoutes);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    if (!User.findOne()) {
      new User({
        username: "marks",
        email: "srecanmare9@gmail.com",
        cart: { items: [] },
      }).save();
    }

    app.listen(3000, () => {
      console.log("Listen on port 3000....");
    });
  })
  .catch((error) => {
    console.log(error);
  });
