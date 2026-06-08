import { recurringExpenseModel } from "../models/recurringExpenseModel.js";
import { expenseModel } from "../models/expenseModel.js";
export const createRecurringExpense = async (req, res, next) => {
  try {
    const {
      title,
      amount,
      category,
      frequency,
      nextDueDate,
      note,
    } = req.body;

    if (!title || !amount || !nextDueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, amount and next due date are required",
      });
    }

    const recurring = await recurringExpenseModel.create({
      userId: req.user.id,
      title,
      amount,
      category,
      frequency,
      nextDueDate,
      note,
      isActive: true,
    });

    const dueDate = new Date(nextDueDate);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (dueDate <= today) {
      await expenseModel.create({
        userId: req.user.id,
        title,
        amount,
        category: category || "General",
        paymentMethod: "cash",
        notes: note || "Recurring expense generated",
        expenseDate: dueDate,

        isRecurring: true,
        recurringType: frequency,
        recurringExpenseId: recurring._id,
        source: "recurring",
      });
    }

    res.status(201).json({
      success: true,
      message: "Recurring expense created",
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};
export const getRecurringExpenses = async (req, res, next) => {
  try {
    const recurring = await recurringExpenseModel
      .find({ userId: req.user.id })
      .sort({ nextDueDate: 1 });

    res.status(200).json({
      success: true,
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleRecurringExpense = async (req, res, next) => {
  try {
    const recurring = await recurringExpenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!recurring) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecurringExpense = async (req, res, next) => {
  try {
    const recurring = await recurringExpenseModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!recurring) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recurring expense updated",
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecurringExpense = async (req, res, next) => {
  try {
    const recurring = await recurringExpenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!recurring) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    await expenseModel.deleteMany({
      userId: req.user.id,
      recurringExpenseId: recurring._id,
      source: "recurring",
    });

    await recurring.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Recurring expense and generated expenses deleted",
      deletedRecurringId: recurring._id,
    });
  } catch (error) {
    next(error);
  }
};
export const toggleRecurringExpense = async (req, res, next) => {
  try {
    const recurring = await recurringExpenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!recurring) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    recurring.isActive = !recurring.isActive;
    await recurring.save();

    res.status(200).json({
      success: true,
      message: "Recurring status updated",
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};