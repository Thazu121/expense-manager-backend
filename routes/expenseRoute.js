import express from "express";

import authMiddleware
from "../middlewares/authMiddleware.js";

import {
  createExpense,
  getExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  toggleFavoriteExpense,
  getRecentExpenses,
  searchExpenses,
  duplicateExpense,
} from "../controllers/expenseController.js";

const expenseRoute =
  express.Router()



expenseRoute.post(
  "/",
  authMiddleware,
  createExpense
)

expenseRoute.get(
  "/",
  authMiddleware,
  getExpenses
)

expenseRoute.get(
  "/recent",
  authMiddleware,
  getRecentExpenses
)

expenseRoute.get(
  "/search",
  authMiddleware,
  searchExpenses
)



expenseRoute.get(
  "/:id",
  authMiddleware,
  getSingleExpense
)
expenseRoute.put(
  "/:id",
  authMiddleware,
  updateExpense
)


expenseRoute.delete(
  "/:id",
  authMiddleware,
  deleteExpense
)


expenseRoute.put(
  "/:id/favorite",
  authMiddleware,
  toggleFavoriteExpense
)



expenseRoute.post(
  "/:id/duplicate",
  authMiddleware,
  duplicateExpense
)



export default expenseRoute