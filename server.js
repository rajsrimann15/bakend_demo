const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
require('./controllers/authController');

connectDb();
const app = express();

const port = 5001;

app.use(express.json());
app.use("/orders/packingAndMoving", require("./routes/routes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use(errorHandler);
app.use('/', require("./routes/authRoutes"));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
