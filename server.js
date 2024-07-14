const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = 5000;

app.use(express.json());
app.use("/orders/packingAndMoving", require("./routes/routes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
