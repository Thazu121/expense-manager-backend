import { expenseModel } from "../models/expenseModel.js";
import { sendNotification } from "../utils/sendNotification.js";


const createExpense = async (
  req,
  res,
  next
) => {
  try {

    const {
      title,
      amount,
      categoryId,
      merchant,
      paymentMethod,
      notes,
      tags,
      source,
      expenseDate,
      isRecurring,
      recurringType,
    } = req.body

    if (
      !title ||
      !amount ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, amount and category are required",
      })
    }

const expense = await expenseModel.create({
  userId: req.user.id,
  title,
  amount,
  categoryId,
  merchant,
  paymentMethod,
  notes,
  tags,
  source,
  expenseDate,
  isRecurring,
  recurringType,
});

sendNotification({
  userId: req.user.id,
  title: "Expense Added",
  message: `${title} - ₹${amount} added successfully`,
});


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

    const {
      categoryId,
      paymentMethod,
      startDate,
      endDate,
      search,
      sort,
      page = 1,
      limit = 10,
      favorite,
    } = req.query;

    let filter = {
      userId: req.user.id,
    }


    if (categoryId) {
      filter.categoryId =
        categoryId
    }


    if (paymentMethod) {
      filter.paymentMethod =
        paymentMethod
    }


    if (favorite === "true") {
      filter.favorite = true;
    }


    if (startDate && endDate) {
      filter.expenseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }


    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          notes: {
            $regex: search,
            $options: "i",
          },
        },

        {
          merchant: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }



    let sortOption = {
      createdAt: -1,
    }

    if (sort === "latest") {
      sortOption = {
        createdAt: -1,
      }
    }

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      }
    }

    if (sort === "highest") {
      sortOption = {
        amount: -1,
      }
    }

    if (sort === "lowest") {
      sortOption = {
        amount: 1,
      }
    }



    const skip =
      (page - 1) * limit;



    const expenses =
      await expenseModel
        .find(filter)
        .populate(
          "categoryId",
          "name icon color"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));



    const totalExpenses =
      await expenseModel.countDocuments(
        filter
      )



    return res.status(200).json({
      success: true,

      currentPage: Number(page),

      totalPages: Math.ceil(
        totalExpenses / limit
      ),

      totalExpenses,

      count: expenses.length,

      expenses,
    })

  } catch (error) {
    next(error);
  }
}



const getSingleExpense = async (
  req,
  res,
  next
) => {
  try {

    const expense =
      await expenseModel
        .findOne({
          _id: req.params.id,
          userId: req.user.id,
        })
        .populate(
          "categoryId",
          "name icon color"
        )

    if (!expense) {
      return res.status(404).json({
        success: false,
        message:
          "Expense not found",
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
      categoryId,
      merchant,
      paymentMethod,
      notes,
      tags,
      source,
      expenseDate,
      isRecurring,
      recurringType,
    } = req.body

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
    const oldTitle = expense.title;

    expense.title =
      title || expense.title

    expense.amount =
      amount || expense.amount

    expense.categoryId =
      categoryId ||
      expense.categoryId

    expense.merchant =
      merchant || expense.merchant

    expense.paymentMethod =
      paymentMethod ||
      expense.paymentMethod

    expense.notes =
      notes || expense.notes

    expense.tags =
      tags || expense.tags

    expense.source =
      source || expense.source

    expense.expenseDate =
      expenseDate ||
      expense.expenseDate

    expense.isRecurring =
      isRecurring ??
      expense.isRecurring

    expense.recurringType =
      recurringType ||
      expense.recurringType
sendNotification({
  userId: req.user.id,
  title: "Expense Updated",
  message: `${oldTitle} updated successfully`,
});

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
        message:
          "Expense not found",
      })
    }

const deletedTitle = expense.title;

await expense.deleteOne();

sendNotification({
  userId: req.user.id,
  title: "Expense Deleted",
  message: `${deletedTitle} removed successfully`,
})

    return res.status(200).json({
      success: true,
      message:
        "Expense deleted successfully",
    });

  } catch (error) {
    next(error);
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

sendNotification({
  userId: req.user.id,
  title: "Favorite Updated",
  message: `${expense.title} marked as ${
    expense.favorite ? "favorite ❤️" : "removed"
  }`,
})
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



const getRecentExpenses =
  async (req, res, next) => {
    try {

      const expenses =
        await expenseModel
          .find({
            userId: req.user.id,
          })
          .populate(
            "categoryId",
            "name icon color"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5)

      return res.status(200).json({
        success: true,
        expenses,
      })

    } catch (error) {
      next(error);
    }
  }



const searchExpenses =
  async (req, res, next) => {
    try {

      const { q } = req.query

      const expenses =
        await expenseModel
          .find({
            userId: req.user.id,

            $or: [
              {
                title: {
                  $regex: q,
                  $options: "i",
                },
              },

              {
                notes: {
                  $regex: q,
                  $options: "i",
                },
              },

              {
                merchant: {
                  $regex: q,
                  $options: "i",
                },
              },
            ],
          })
          .populate(
            "categoryId",
            "name icon color"
          )

      return res.status(200).json({
        success: true,
        count: expenses.length,
        expenses,
      });

    } catch (error) {
      next(error)
    }
  }




const duplicateExpense =
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

      const duplicatedExpense =
        await expenseModel.create({
          userId: expense.userId,

          title: expense.title,

          amount: expense.amount,

          categoryId:
            expense.categoryId,

          merchant:
            expense.merchant,

          paymentMethod:
            expense.paymentMethod,

          notes: expense.notes,

          tags: expense.tags,

          source: expense.source,

          expenseDate:
            new Date(),

          favorite: false,
        })

      return res.status(201).json({
        success: true,
        message:
          "Expense duplicated successfully",

        duplicatedExpense,
      })

    } catch (error) {
      next(error)
    }
  }



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
}