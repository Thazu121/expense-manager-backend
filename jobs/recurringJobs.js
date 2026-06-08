import cron from "node-cron";
import { recurringExpenseModel } from "../models/recurringExpenseModel.js";
import { expenseModel } from "../models/expenseModel.js";

const getNextDueDate = (date, frequency) => {
  const next = new Date(date);

  if (frequency === "daily") {
    next.setDate(next.getDate() + 1);
  }

  if (frequency === "weekly") {
    next.setDate(next.getDate() + 7);
  }

  if (frequency === "monthly") {
    next.setMonth(next.getMonth() + 1);
  }

  if (frequency === "yearly") {
    next.setFullYear(next.getFullYear() + 1);
  }

  return next;
};

export const startRecurringExpenseJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Recurring expense job running...");

      const today = new Date();

      const dueRecurring = await recurringExpenseModel.find({
        isActive: true,
        nextDueDate: { $lte: today },
      });

      for (const recurring of dueRecurring) {
        await expenseModel.create({
          userId: recurring.userId,
          title: recurring.title,
          amount: recurring.amount,
          category: recurring.category,
          date: recurring.nextDueDate,
          note: recurring.note || "Auto generated recurring expense",
          source: "recurring",
          recurringId: recurring._id,
        });

        recurring.lastGeneratedDate = recurring.nextDueDate;
        recurring.nextDueDate = getNextDueDate(
          recurring.nextDueDate,
          recurring.frequency
        );

        await recurring.save();
      }

      console.log("Recurring expense job completed");
    } catch (error) {
      console.error("Recurring expense job error:", error.message);
    }
  });
};