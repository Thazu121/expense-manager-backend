import express from "express"


const categoryRouter = express.Router()

categoryRouter.post("/categories")
categoryRouter.get("/categories")
categoryRouter.get("/categories/:id",)
categoryRouter.put("/categories/:id",)
categoryRouter.delete("/categories/:id")


export default categoryRouter