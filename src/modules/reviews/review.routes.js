import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import systemRoles from "../../utilis/systemRoles.js";
import {
  addReviewValidation,
  delReviewValidation,
} from "./reviewValidation.js";
import { addReview, delReview } from "./reviews.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validation(addReviewValidation),
  handle(auth([systemRoles.admin])),
  handle(addReview)
);
router.delete(
  "/",
  validation(delReviewValidation),
  handle(auth([systemRoles.admin])),
  handle(delReview)
);

export default router;
