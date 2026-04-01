import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.registerUser(req.body);
      res
        .status(201)
        .json({ message: "User registered successfully", ...result });
    } catch (error: any) {
      const status = error.message === "User already exists" ? 400 : 500;
      res
        .status(status)
        .json({ error: error.message || "Server error during registration" });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.loginUser(req.body);
      res.status(200).json({ message: "Login successful", ...result });
    } catch (error: any) {
      const status = error.message === "Invalid credentials" ? 401 : 500;
      res
        .status(status)
        .json({ error: error.message || "Server error during login" });
    }
  }
}
