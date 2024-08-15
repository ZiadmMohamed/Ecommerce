import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import systemRoles from "../../utilis/systemRoles.js";
import { cancelOrder, createOrder, webhook } from "./order.controller.js";
import { cancleOrderValidation, orderValidation } from "./orderValidation.js";
import express from "express";

const router = Router();

router.post(
  "/",
  validation(orderValidation),
  handle(auth(Object.values(systemRoles))),
  handle(createOrder)
);
router.delete(
  "/:id",
  validation(cancleOrderValidation),
  handle(auth(Object.values(systemRoles))),
  handle(cancelOrder)
);

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

export default router;
