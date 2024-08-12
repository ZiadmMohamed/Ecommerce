import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import { createBrand, updateBrand } from "./brand.controller.js";
import { brandValidation } from "./brandValidation.js";
import onlineMulter, { validExtensions } from "../../services/multer.js";

const router = Router();

router.post(
  "/",
  onlineMulter(validExtensions.image).single("image"),
  validation(brandValidation),
  handle(auth(["admin"])),
  handle(createBrand)
);

router.patch(
  "/:id",
  onlineMulter(validExtensions.image).single("image"),
  handle(auth(["admin"])),
  handle(updateBrand)
);

// router.get("/test", handle(auth));
export default router;
