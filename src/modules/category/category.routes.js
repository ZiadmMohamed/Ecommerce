import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
} from "./category.controller.js";
import { categoryValidation } from "./categoryValidation.js";
import onlineMulter, { validExtensions } from "../../services/multer.js";
import { getSpicificSubCategories } from "../subCategory/subCategory.controller.js";
import systemRoles from "../../utilis/systemRoles.js";

const router = Router({ mergeParams: true });

router.get(
  "/:categoryId/subCategory",
  handle(auth(Object.values(systemRoles))),
  handle(getSpicificSubCategories)
);

router.get(
  "/",
  handle(auth(Object.values(systemRoles))),
  handle(getCategories)
);

router.post(
  "/",
  onlineMulter(validExtensions.image).single("image"),
  validation(categoryValidation),
  handle(auth(["admin"])),
  handle(createCategory)
);
router.patch(
  "/:id",
  onlineMulter(validExtensions.image).single("image"),
  handle(auth(["admin"])),
  handle(updateCategory)
);
router.delete(
  "/:id",
  onlineMulter(validExtensions.image).single("image"),
  handle(auth(["admin"])),
  handle(deleteCategory)
);

// router.get("/test", handle(auth));
export default router;
