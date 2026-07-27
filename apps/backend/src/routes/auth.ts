import { Router } from "express";

import { AuthController } from "../controllers";
import { authGuard } from "../middlewares";

const router = Router();

router.post("/v1/auth/sign-in", AuthController.signIn);
router.post("/v1/auth/sign-up", AuthController.signUp);

router.post("/v1/auth/send-otp", authGuard, AuthController.sendOtp);
router.post("/v1/auth/verify-otp", authGuard, AuthController.verifyOtp);

router.get("/v1/auth/whoami", authGuard, AuthController.whoami);
router.get("/v1/auth/me", authGuard, AuthController.me);

router.post("/v1/auth/sign-out", authGuard, AuthController.signOut);

export const authRouter = router;
