import express from "express";
import { executeRouter } from "./routes/execute";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/execute", executeRouter);

app.listen(PORT, () => {
  console.log(`Runner service running on port ${PORT}`);
});

