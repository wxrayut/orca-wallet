import { Router } from "express";

import { AdminController } from "../controllers";
import { adminGuard, authGuard } from "../middlewares";

const router = Router();

router.use(authGuard, adminGuard);

router.get("/v1/admin/stats", AdminController.getStats);
router.get("/v1/admin/recent-transactions", AdminController.getRecentTransactions);
router.get("/v1/admin/users", AdminController.getUsers);

router.post("/v1/admin/update-user", AdminController.updateUser);
router.post("/v1/admin/delete-user", AdminController.deleteUser);

export const adminRouter = router;
