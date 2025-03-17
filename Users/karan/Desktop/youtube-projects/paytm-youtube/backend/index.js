const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mainRouter = require("./routes/index");
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1", mainRouter);

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});
