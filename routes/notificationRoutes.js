import express from "express"

const notificationRoute = express.Router()

notificationRoute.get("/")
notificationRoute.put("/:id/read")