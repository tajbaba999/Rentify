import express from "express";
import dotenv, { config } from "dotenv";
const cors = require("cors");

config();

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode.");
  dotenv.config({ path: ".prod.env" });
} else {
  console.log("Running in development mode.");
  dotenv.config({ path: ".dev.env" });
}

const  PORT  = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

// import shopRouter from "./shop";
import shoproute from './shop/index';
app.use(shoproute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
