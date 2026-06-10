import cron from "node-cron";

import { recurringExpenseModel } from "../models/recurringExpenseModel.js";
import { expenseModel } from "../models/expenseModel.js";
import { sendNotification } from "../utils/sendNotification.js";

const getNextDueDate = (date, frequency) => {
  const next = new Date(date);

  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;

    case "weekly":
      next.setDate(next.getDate() + 7);
      break;

    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;

    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;

    default:
      next.setMonth(next.getMonth() + 1);
      break;
  }

  return next;
};

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const startRecurringExpenseJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Recurring expense job running...");

      const today = new Date();

      const dueRecurring =
        await recurringExpenseModel.find({
          isActive: true,
          autoGenerate: true,
          nextDueDate: {
            $lte: today,
          },
          $or: [
            { endDate: null },
            { endDate: { $exists: false } },
            { endDate: { $gte: today } },
          ],
        });

      for (const recurring of dueRecurring) {
        const dueDate =
          recurring.nextDueDate || today;

        const existingExpense =
          await expenseModel.findOne({
            userId: recurring.userId,
            recurringExpenseId:
              recurring._id,
            expenseDate: {
              $gte: startOfDay(dueDate),
              $lte: endOfDay(dueDate),
            },
          });

        if (!existingExpense) {
          await expenseModel.create({
            userId: recurring.userId,

            title: recurring.title,

            amount: Number(
              recurring.amount || 0
            ),

            category:
              recurring.category ||
              "General",

            merchant:
              recurring.merchant ||
              recurring.title,

            paymentMethod:
              recurring.paymentMethod ||
              "cash",

            notes:
              recurring.notes ||
              "Auto generated recurring expense",

            source: "recurring",

            expenseDate: dueDate,

            isRecurring: true,

            recurringType:
              recurring.frequency,

            recurringExpenseId:
              recurring._id,
          });

          await sendNotification({
            userId: recurring.userId,
            title:
              "Recurring Expense Generated",
            message: `${recurring.title} - ₹${recurring.amount}`,
            type: "recurring",
          });
        }

        recurring.lastGeneratedDate =
          dueDate;

        recurring.nextDueDate =
          getNextDueDate(
            dueDate,
            recurring.frequency
          );

        await recurring.save();
      }

      console.log(
        "Recurring expense job completed"
      );
    } catch (error) {
      console.error(
        "Recurring expense job error:",
        error.message
      );
    }
  });
};