import express from "express"


const categoryRoute = express.Router()

categoryRoute.post("/")
categoryRoute.get("/categories")
categoryRoute.get("/:id",)
categoryRoute.put("/:id",)
categoryRoute.delete("/:id")


export default categoryRoute