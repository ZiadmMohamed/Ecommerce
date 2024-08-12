import { Router } from "express";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import systemRoles from "../../utilis/systemRoles.js";
import { createCoupon, updateCoupon } from "./coupon.controller.js";

const router = Router();

router.post("/", handle(auth([systemRoles.admin])), handle(createCoupon));

// router.get(
//   "/",
//   handle(auth(Object.values(systemRoles))),
//   handle(getAllCoupons)
// );

router.patch(
  "/:id",
  handle(auth([systemRoles.admin])),
  handle(updateCoupon)
);

export default router;
