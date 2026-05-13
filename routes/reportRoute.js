import express from "express"

const reportRoute =express.Router()

reportRoute.get("/summary")
reportRoute.get("/monthly-analysis")
reportRoute.get("/category-analysis")
reportRoute.get("/export/csv")
reportRoute.get("/export/pdf")

export default reportRoute