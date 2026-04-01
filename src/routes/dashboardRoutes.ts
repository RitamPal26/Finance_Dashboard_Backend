import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";

const router = Router();

router.get(
  "/summary",
  authenticateJWT,
  roleGuard(["ADMIN", "ANALYST", "VIEWER"]),
  getDashboardSummary,
);

export default router;
