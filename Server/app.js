import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
import configRoutes from "./routes/index.js";

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've got an express server");
  console.log("Your routes will be running on http://localhost:3000\n");
});
