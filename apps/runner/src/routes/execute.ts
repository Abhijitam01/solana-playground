import { Router } from "express";
import { executeProgram } from "../services/executor";
import { ExecutionRequestSchema } from "@solana-playground/types";

export const executeRouter = Router();

executeRouter.post("/", async (req, res) => {
  try {
    const request = ExecutionRequestSchema.parse(req.body);
    const result = await executeProgram(request);
    res.json(result);
  } catch (error) {
    console.error("Execution error:", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Unknown execution error",
      });
    }
  }
});

