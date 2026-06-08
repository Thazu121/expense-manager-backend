import { expenseModel } from "../models/expenseModel.js";
import { sendNotification } from "../utils/sendNotification.js";

const escapeRegex = (text = "") => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const createExpense = async (req, res, next) => {
  try {
    let {
      title,
      amount,
      category,
      merchant,
      paymentMethod,
      notes,
      tags,
      source,
      expenseDate,
      isRecurring,
      recurringType,
      recurringExpenseId,
    } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        success: false,
        message: "Title and amount are required",
      });
    }

    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const finalDate = expenseDate
      ? new Date(expenseDate)
      : new Date();

    if (isNaN(finalDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense date",
      });
    }

    const startOfDay = new Date(finalDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(finalDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingExpense = await expenseModel.findOne({
      userId: req.user.id,
      title: title.trim(),
      amount: parsedAmount,
      expenseDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingExpense) {
      return res.status(409).json({
        success: false,
        message: "Duplicate expense detected",
      });
    }

    const expense = await expenseModel.create({
      userId: req.user.id,
      title: title.trim(),
      amount: parsedAmount,
      category: category || "General",
      merchant,
      paymentMethod: paymentMethod || "cash",
      notes,
      tags,
      source: source || "manual",
      expenseDate: finalDate,
      isRecurring: isRecurring || false,
      recurringType,
      recurringExpenseId,
    });

    try {
      await sendNotification({
        userId: req.user.id,
        title: "Expense Added",
        message: `${title} - ₹${amount} added successfully`,
      });
    } catch (err) {
      console.log("Notification error:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const {
      category,
      paymentMethod,
      startDate,
      endDate,
      search,
      sort,
      page = 1,
      limit = 10,
      favorite,
      source,
      isRecurring,
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    let filter = {
      userId: req.user.id,
    };

    if (category) filter.category = category;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (favorite === "true") filter.favorite = true;
    if (source) filter.source = source;
    if (isRecurring === "true") filter.isRecurring = true;
    if (isRecurring === "false") filter.isRecurring = false;

    if (startDate && endDate) {
      filter.expenseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { notes: { $regex: safeSearch, $options: "i" } },
        { merchant: { $regex: safeSearch, $options: "i" } },
      ];
    }

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "highest") sortOption = { amount: -1 };
    if (sort === "lowest") sortOption = { amount: 1 };

    const expenses = await expenseModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalExpenses = await expenseModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      currentPage: pageNum,
      totalPages: Math.ceil(totalExpenses / limitNum),
      totalExpenses,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleExpense = async (req, res, next) => {
  try {
    const expense = await expenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const {
      title,
      amount,
      category,
      merchant,
      paymentMethod,
      notes,
      tags,
      source,
      expenseDate,
      isRecurring,
      recurringType,
      recurringExpenseId,
    } = req.body;

    const expense = await expenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const oldTitle = expense.title;

    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = Number(amount);
    if (category !== undefined) expense.category = category;
    if (merchant !== undefined) expense.merchant = merchant;
    if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
    if (notes !== undefined) expense.notes = notes;
    if (tags !== undefined) expense.tags = tags;
    if (source !== undefined) expense.source = source;
    if (expenseDate !== undefined) expense.expenseDate = expenseDate;
    if (isRecurring !== undefined) expense.isRecurring = isRecurring;
    if (recurringType !== undefined) expense.recurringType = recurringType;
    if (recurringExpenseId !== undefined) {
      expense.recurringExpenseId = recurringExpenseId;
    }

    await expense.save();

    try {
      await sendNotification({
        userId: req.user.id,
        title: "Expense Updated",
        message: `${oldTitle} updated successfully`,
      });
    } catch (err) {
      console.error("Notification error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await expenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const deletedTitle = expense.title;

    await expense.deleteOne();

    try {
      await sendNotification({
        userId: req.user.id,
        title: "Expense Deleted",
        message: `${deletedTitle} removed successfully`,
      });
    } catch (err) {
      console.error("Notification error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleFavoriteExpense = async (req, res, next) => {
  try {
    const expense = await expenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    expense.favorite = !expense.favorite;
    await expense.save();

    try {
      await sendNotification({
        userId: req.user.id,
        title: "Favorite Updated",
        message: `${expense.title} marked as ${
          expense.favorite ? "favorite ❤️" : "removed"
        }`,
      });
    } catch (err) {
      console.error("Notification error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Favorite updated successfully",
      expense,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseModel
      .find({
        userId: req.user.id,
      })
      .sort({
        createdAt: -1,
      })
      .limit(5);

    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

const searchExpenses = async (req, res, next) => {
  try {
    const { q } = req.query;

    const safeQ = escapeRegex(q || "");

    const expenses = await expenseModel.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: safeQ, $options: "i" } },
        { notes: { $regex: safeQ, $options: "i" } },
        { merchant: { $regex: safeQ, $options: "i" } },
      ],
    });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

const duplicateExpense = async (req, res, next) => {
  try {
    const expense = await expenseModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const duplicatedExpense = await expenseModel.create({
      userId: expense.userId,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      merchant: expense.merchant,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes,
      tags: expense.tags,
      source: expense.source,
      expenseDate: new Date(),
      favorite: false,
      isRecurring: expense.isRecurring,
      recurringType: expense.recurringType,
      recurringExpenseId: expense.recurringExpenseId,
    });

    return res.status(201).json({
      success: true,
      message: "Expense duplicated successfully",
      duplicatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createExpense,
  getExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  toggleFavoriteExpense,
  getRecentExpenses,
  searchExpenses,
  duplicateExpense,
};