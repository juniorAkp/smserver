import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { setDb } from "./config/db.js";
import { router as authRouter } from "./routes/auth.route.js";
import { router as productRouter } from "./routes/product.route.js";
import { router as categoryRouter } from "./routes/category.route.js";
import { router as cartRouter } from "./routes/cart.route.js";
import job from "./lib/cron.js";
import morgan from "morgan";
const app = express();
const PORT = process.env.PORT || 8080;

job.start();
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);

app.listen(PORT, () => {
  setDb();
  console.log(`server is running on localhost: ${PORT}`);
});
