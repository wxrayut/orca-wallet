import { Router } from "express";

import { WalletController } from "../controllers";
import { authGuard } from "../middlewares";

const router = Router();

router.post("/v1/wallet/create", authGuard, WalletController.create);
router.post("/v1/wallet/import", authGuard, WalletController.import);
router.post("/v1/wallet/send", authGuard, WalletController.send);

router.get("/v1/wallets", authGuard, WalletController.getWallets);

router.post("/v1/wallet/balance", authGuard, WalletController.getBalance);
// router.post("/v1/wallet/address", authGuard, WalletController.getAddress);
router.post("/v1/wallet/private-key", authGuard, WalletController.getPrivateKey);
router.post("/v1/wallet/tokens", authGuard, WalletController.getTokens);
router.post("/v1/wallet/activity", authGuard, WalletController.getActivity);
router.post("/v1/wallet/token-price", authGuard, WalletController.getTokenPrices);

router.patch("/v1/wallet/update-label", authGuard, WalletController.updateLabel);
router.patch("/v1/wallet/update-default", authGuard, WalletController.updateDefault);

router.post("/v1/wallet/delete", authGuard, WalletController.delete);

export const walletRouter = router;
