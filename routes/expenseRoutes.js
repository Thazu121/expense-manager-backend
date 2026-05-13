import express from "express"

const expenseRoute = express.Router()

expenseRoute.post("/",)

expenseRoute.get("/",)

expenseRoute.get("/recent",)

expenseRoute.get("/search",)

expenseRoute.get("/:id",)

expenseRoute.put("/:id",)

expenseRoute.delete("/:id",)

expenseRoute.put("/:id/favourite",)

expenseRoute.post("/:id/duplicate",)

export default expenseRoute