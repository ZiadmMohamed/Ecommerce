import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import {
  createsubCategory,
  getAllSubCategories,
  updateSubCategory,
} from "./subCategory.controller.js";
import { subCategoryValidation } from "./subCategoryValidation.js";
import onlineMulter, { validExtensions } from "../../services/multer.js";
import systemRoles from "../../utilis/systemRoles.js";

const router = Router({ mergeParams: true });

router.get(
  "/",
  handle(auth(Object.values(systemRoles))),
  handle(getAllSubCategories)
);

router.post(
  "/:categoryId",
  onlineMulter(validExtensions.image).single("image"),
  validation(subCategoryValidation),
  handle(auth([systemRoles.admin])),
  handle(createsubCategory)
);

router.patch(
  "/:id",
  onlineMulter(validExtensions.image).single("image"),
  handle(auth([systemRoles.admin])),
  handle(updateSubCategory)
);

// router.get("/test", handle(auth));
export default router;
