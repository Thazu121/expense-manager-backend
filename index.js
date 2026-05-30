import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import expenseRoute from "./routes/expenseRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
// import notificationRoute from "./routes/notificationRoute.js"
import receiptRoute from "./routes/receiptRoute.js"
// import reportRoute from "./routes/reportRoute.js"
import errorMiddleware from "./middlewares/errorMiddleware.js"
dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);


app.use("/uploads",express.static("uploads"))
app.use("/auth",authRoute)
app.use("/expenses",expenseRoute)
app.use("/categories",categoryRoute)
app.use("/receipts",receiptRoute)
// app.use("/report",reportRoute)
// app.use("/notification",notificationRoute)




app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Expense Tracker API Running",
  })
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})