import express from "express";

import authMiddleware
from "../middlewares/authMiddleware.js";

import {
  getCategories,
  getSingleCategory,
} from "../controllers/categoryController.js";


const categoryRoute =
  express.Router()






categoryRoute.get(
  "/",
  authMiddleware,
  getCategories
)



categoryRoute.get(
  "/:id",
  authMiddleware,
  getSingleCategory
)










export default categoryRoute