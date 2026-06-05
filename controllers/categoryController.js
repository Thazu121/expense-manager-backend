// import { categoryModel } from "../models/categoryModel.js";


// const createCategory = async (req, res, next) => {
//   try {
//     const { name, icon, color, type } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Category name is required",
//       });
//     }

//     const normalizedName = name.trim().toLowerCase();

//     const existingCategory = await categoryModel.findOne({
//       userId: req.user.id,
//       name: normalizedName,
//     });

//     if (existingCategory) {
//       return res.status(400).json({
//         success: false,
//         message: "Category already exists",
//       });
//     }

//     const category = await categoryModel.create({
//       userId: req.user.id,
//       name: normalizedName,
//       icon,
//       color,
//       type,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Category created successfully",
//       category,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getCategories = async (req, res, next) => {
//   try {
//     const categories = await categoryModel
//       .find({ userId: req.user.id })
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: categories.length,
//       categories,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// const getSingleCategory = async (req, res, next) => {
//   try {
//     const category = await categoryModel.findOne({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       category,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// const updateCategory = async (req, res, next) => {
//   try {
//     const { name, icon, color, type } = req.body;

//     const category = await categoryModel.findOne({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     if (name) {
//       const normalizedName = name.trim().toLowerCase();

//       const existingCategory = await categoryModel.findOne({
//         userId: req.user.id,
//         name: normalizedName,
//         _id: { $ne: req.params.id },
//       });

//       if (existingCategory) {
//         return res.status(400).json({
//           success: false,
//           message: "Category already exists",
//         });
//       }

//       category.name = normalizedName;
//     }

//     if (icon !== undefined) category.icon = icon;
//     if (color !== undefined) category.color = color;
//     if (type !== undefined) category.type = type;

//     await category.save();

//     return res.status(200).json({
//       success: true,
//       message: "Category updated successfully",
//       category,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteCategory = async (req, res, next) => {
//   try {
//     const category = await categoryModel.findOne({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     await category.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export {
//   createCategory,
//   getCategories,
//   getSingleCategory,
//   updateCategory,
//   deleteCategory,
// };