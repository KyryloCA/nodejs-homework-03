const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? "./environments/production.env"
      : "./environments/development.env",
});

const contactsRouter = require("./routes/api/contacts");
const mongoose = require("mongoose");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// insert sample
console.log("env", process.env.MONGO_URL);
// end of sample

// mongoose
//   .connect(
//     "mongodb+srv://3dprofix:hLRJU77AUHs66FiD@cluster0.cphysxt.mongodb.net",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("connected to db");
//   })
//   .catch((err) => console.log(err));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

// app.use((req, res) => {
//   res.status(404).json({ message: "Not found" });
// });

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });

// Much better error handling

/**
 * Not found request handler.
 */
app.all("*", (req, res) => {
  res.status(404).json({
    msg: "Not found",
  });
});

/**
 * Global error handler. Four arguments required!!
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    msg: err.message,
  });
});

module.exports = app;
