import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createRecurringExpense,
  getRecurringExpenses,
  getSingleRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  toggleRecurringExpense,
} from "../controllers/recurringController.js";

const recurringExpenseRoute = express.Router();

recurringExpenseRoute.post(
  "/",
  authMiddleware,
  createRecurringExpense
);

recurringExpenseRoute.get(
  "/",
  authMiddleware,
  getRecurringExpenses
);

recurringExpenseRoute.get(
  "/:id",
  authMiddleware,
  getSingleRecurringExpense
);

recurringExpenseRoute.put(
  "/:id",
  authMiddleware,
  updateRecurringExpense
);

recurringExpenseRoute.delete(
  "/:id",
  authMiddleware,
  deleteRecurringExpense
);

recurringExpenseRoute.patch(
  "/:id/toggle",
  authMiddleware,
  toggleRecurringExpense
);

export default recurringExpenseRoute;