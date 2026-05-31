import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import expenseRoute from "./routes/expenseRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import receiptRoute from "./routes/receiptRoute.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

import "./workers/ocrWorker.js";
import notificationRoute from "./routes/notificationRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoute);
app.use("/expenses", expenseRoute);
app.use("/categories", categoryRoute);
app.use("/receipts", receiptRoute)
app.use("/notification",notificationRoute)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API Running",
  });
});

app.use(errorMiddleware);


const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});