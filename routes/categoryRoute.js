import express from "express";

import authMiddleware
from "../middlewares/authMiddleware.js";

import {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";


const categoryRoute =
  express.Router()



categoryRoute.post(
  "/",
  authMiddleware,
  createCategory
)



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



categoryRoute.put(
  "/:id",
  authMiddleware,
  updateCategory
)



categoryRoute.delete(
  "/:id",
  authMiddleware,
  deleteCategory
)



export default categoryRoute