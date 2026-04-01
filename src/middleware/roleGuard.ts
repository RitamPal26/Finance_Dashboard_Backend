import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const roleGuard = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized. User context missing." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res
        .status(403)
        .json({
          error:
            "Forbidden. You do not have permission to perform this action.",
        });
      return;
    }

    next();
  };
};
