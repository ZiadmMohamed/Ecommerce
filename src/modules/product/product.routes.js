import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";
import {
  productValidation,
  updateProductValidation,
} from "./productValidation.js";
import onlineMulter, { validExtensions } from "../../services/multer.js";
import systemRoles from "../../utilis/systemRoles.js";
import reviewRouter from "../reviews/review.routes.js";
import wishListrouter from "../WishList/WishList.routes.js";
import {
  createproduct,
  getAllproducts,
  returnProduct,
  updateProduct,
} from "./product.controller.js";

const router = Router();

router.use("/:productId/reviews", reviewRouter);
router.use("/:productId/WichList", wishListrouter);

router.post(
  "/",
  onlineMulter(validExtensions.image).fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),

  validation(productValidation),
  handle(auth([systemRoles.admin])),
  handle(createproduct)
);

router.get("/", handle(getAllproducts));

router.patch(
  "/:id",
  onlineMulter(validExtensions.image).fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),

  validation(updateProductValidation),
  handle(auth(systemRoles.admin)),
  handle(updateProduct)
);

router.delete("/id", handle(auth([systemRoles.user])), handle(returnProduct));
// router.get("/test", handle(auth));
export default router;
