import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { createExpense, deleteExpense, getExpenses, getSingleExpense, toggleFavoriteExpense, updateExpense } from "../controllers/expenseController.js"

const expenseRoute = express.Router()

expenseRoute.post("/",authMiddleware,createExpense)

expenseRoute.get("/",authMiddleware,getExpenses)

expenseRoute.get("/recent",)

expenseRoute.get("/search",)

expenseRoute.get("/:id",authMiddleware,getSingleExpense)

expenseRoute.put("/:id",authMiddleware,updateExpense)

expenseRoute.delete("/:id",authMiddleware,deleteExpense)

expenseRoute.put("/:id/favourite",authMiddleware,toggleFavoriteExpense)

expenseRoute.post("/:id/duplicate",)
// expenseRoute.put("/:id/receipt")

export default expenseRoute