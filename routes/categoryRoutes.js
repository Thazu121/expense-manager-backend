import express from "express"


const categoryRouter = express.Router()

categoryRouter.post("/")
categoryRouter.get("/categories")
categoryRouter.get("/:id",)
categoryRouter.put("/:id",)
categoryRouter.delete("/:id")


export default categoryRouter