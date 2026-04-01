import { Router } from "express";
import {
  createTransaction,
  getTransactions,
} from "../controllers/transactionController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";

const router = Router();

router.use(authenticateJWT);

router.post("/", roleGuard(["ADMIN", "ANALYST"]), createTransaction);

router.get("/", roleGuard(["ADMIN", "ANALYST", "VIEWER"]), getTransactions);

export default router;
