const express = require("express");
const dotenv = require("dotenv"); // ovo donosi process!
const connectDB = require("./config/db");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const path = require("path");
const cookieParser = require("cookie-parser");

//Load env vars
dotenv.config({ path: "./config/config.env" });
//Connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//File uploading
app.use(fileUpload());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount routers

//app.use("/api/v1/bootcamps", require("./routes/bootcamps"));
//app.use("/api/v1/courses", require("./routes/courses"));
app.use("/api/v1/auth", require("./routes/auth"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV}  mode on  port 1  ${PORT}`.yellow
      .bold
  )
);

//Handle unhandled promis rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
