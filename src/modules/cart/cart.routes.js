import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import { cartValidation, removeProductValidation } from "./cartValidation.js";
import systemRoles from "../../utilis/systemRoles.js";
import {
  clearCart,
  createCart,
  deleteCart,
  removeProduct,
} from "./cart.controller.js";

const router = Router({ caseSensitive: true });

router.post(
  "/",
  validation(cartValidation),
  handle(auth(Object.values(systemRoles))),
  handle(createCart)
);
router.patch(
  "/:productId",
  validation(removeProductValidation),
  handle(auth(Object.values(systemRoles))),
  handle(removeProduct)
);
router.delete("/", auth(Object.values(systemRoles)), handle(deleteCart));
router.put("/", auth(Object.values(systemRoles)), handle(clearCart));

export default router;
