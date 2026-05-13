import express from "express"

const receiptRouter=express.Router()

receiptRouter.post("/upload")
receiptRouter.get("/")
receiptRouter.get("/gallery")
receiptRouter.get("/:id")
receiptRouter.delete("/:id")
