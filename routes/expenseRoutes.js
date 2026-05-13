import express from "express"

const expenseRouter = express.Router()

expenseRouter.post("/",)

expenseRouter.get("/",)

expenseRouter.get("/recent",)

expenseRouter.get("/search",)

expenseRouter.get("/:id",)

expenseRouter.put("/:id",)

expenseRouter.delete("/:id",)

expenseRouter.put("/:id/favourite",)

expenseRouter.post("/:id/duplicate",)

export default expenseRouter