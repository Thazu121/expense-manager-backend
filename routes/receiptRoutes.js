import express from "express"

const receiptRoute=express.Router()

receiptRoute.post("/upload")
receiptRoute.get("/")
receiptRoute.get("/gallery")
receiptRoute.get("/:id")
receiptRoute.delete("/:id")
