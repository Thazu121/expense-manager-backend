import { expenseModel } from "../models/expenseModel.js"




const createExpense = async (
  req,
  res,
  next
) => {
  try {

    const {
      title,
      amount,
      category,
      paymentMethod,
      notes,
      source,
      date,
    } = req.body

    if (
      !title ||
      !amount ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, amount and category are required",
      })
    }

    const expense =
      await expenseModel.create({
        userId: req.user.id,
        title,
        amount,
        category,
        paymentMethod,
        notes,
        source,
        date,
      })

    return res.status(201).json({
      success: true,
      message:
        "Expense created successfully",
      expense,
    })

  } catch (error) {
    next(error)
  }
}




const getExpenses = async (
  req,
  res,
  next
) => {
  try {

    const expenses =
      await expenseModel
        .find({
          userId: req.user.id,
        })
        .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    })

  } catch (error) {
    next(error)
  }
}




const getSingleExpense = async (
  req,
  res,
  next
) => {
  try {

    const expense =
      await expenseModel.findOne({
        _id: req.params.id,
        userId: req.user.id,
      })

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      })
    }

    return res.status(200).json({
      success: true,
      expense,
    })

  } catch (error) {
    next(error)
  }
}




const updateExpense = async (
  req,
  res,
  next
) => {
  try {

    const {
      title,
      amount,
      category,
      paymentMethod,
      notes,
      source,
      date,
    } = req.body

    const expense =
      await expenseModel.findOne({
        _id: req.params.id,
        userId: req.user.id,
      })

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      })
    }

    expense.title =
      title || expense.title

    expense.amount =
      amount || expense.amount

    expense.category =
      category || expense.category

    expense.paymentMethod =
      paymentMethod ||
      expense.paymentMethod

    expense.notes =
      notes || expense.notes

    expense.source =
      source || expense.source

    expense.date =
      date || expense.date

    await expense.save();

    return res.status(200).json({
      success: true,
      message:
        "Expense updated successfully",
      expense,
    })

  } catch (error) {
    next(error)
  }
}




const deleteExpense = async (
  req,
  res,
  next
) => {
  try {

    const expense =
      await expenseModel.findOne({
        _id: req.params.id,
        userId: req.user.id,
      })

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      })
    }

    await expense.deleteOne()

    return res.status(200).json({
      success: true,
      message:
        "Expense deleted successfully",
    })

  } catch (error) {
    next(error)
  }
}




const toggleFavoriteExpense =
  async (req, res, next) => {
    try {

      const expense =
        await expenseModel.findOne({
          _id: req.params.id,
          userId: req.user.id,
        })

      if (!expense) {
        return res.status(404).json({
          success: false,
          message:
            "Expense not found",
        })
      }

      expense.favorite =
        !expense.favorite

      await expense.save()

      return res.status(200).json({
        success: true,
        message:
          "Favorite updated successfully",
        expense,
      })

    } catch (error) {
      next(error);
    }
  }


export {
  createExpense,
  getExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  toggleFavoriteExpense,
}