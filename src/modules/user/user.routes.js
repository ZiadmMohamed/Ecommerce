import { Router } from "express";
import {
  forgetPass,
  refToken,
  resetPassword,
  signIn,
  signUp,
  verifyAcount,
} from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { signInValidation, signUpValidation } from "./userValidation.js";
import { handle } from "../../utilis/asyncHandler.js";
import auth from "../../middleware/auth.js";

const router = Router();
router.post("/logIn", validation(signInValidation), handle(signIn));

router.post("/", validation(signUpValidation), handle(signUp));
router.get("/verifyAcount/:token", handle(verifyAcount));
router.get("/resendLink/:refToken", handle(refToken));

router.get("/forgetPass", handle(forgetPass));
router.get("/resetPassword/:token", handle(resetPassword));

// router.get("/test", handle(auth));
export default router;
