import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import systemRoles from "../../utilis/systemRoles.js";
import { createWishList } from "./WishList.controller.js";
import { WishListValidation } from "./WishListValidation.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validation(WishListValidation),
  handle(auth(Object.values(systemRoles))),
  handle(createWishList)
);
export default router;
