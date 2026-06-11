import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import expenseRoute from "./routes/expenseRoute.js";
import receiptRoute from "./routes/receiptRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import scanRouter from "./routes/scanRoute.js";
import recurringExpenseRoute from "./routes/recurringRoute.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

import "./workers/ocrWorker.js";
import { startRecurringExpenseJob } from "./jobs/recurringJobs.js";

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL ,
    credentials: true,
  },
});

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoute);
app.use("/expenses", expenseRoute);
app.use("/receipts", receiptRoute);
app.use("/scan", scanRouter);
app.use("/notification", notificationRoute);
app.use("/recurring", recurringExpenseRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API Running 🚀",
  });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;

    socket.join(userId);

    console.log(`User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export const emitNotification = (userId, data) => {
  if (!userId) return;

  io.to(userId.toString()).emit("notification", {
    id: Date.now().toString(),
    title: data.title || "Notification",
    message: data.message,
    type: data.type || "info",
    read: false,
    createdAt: new Date(),
  });
};

app.use(errorMiddleware);

const PORT = process.env.PORT 

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  startRecurringExpenseJob();
})