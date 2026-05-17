import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoute from "./routes/authRoute.js"
import expenseRoute from "./routes/expenseRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import notificationRoute from "./routes/notificationRoute.js"
import receiptRoute from "./routes/receiptRoute.js"
import reportRoute from "./routes/reportRoute.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads",express.static("uploads"))
app.use("/auth",authRoute)
app.use("/expenses",expenseRoute)
app.use("/categories",categoryRoute)
app.use("/receipts",receiptRoute)
app.use("/report",reportRoute)
app.use("/notification",notificationRoute)


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})