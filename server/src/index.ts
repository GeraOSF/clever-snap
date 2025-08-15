import followUpRouter from "./routes/followup";
import { PORT } from "@/lib/config";
import answerRouter from "@/routes/answer";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";

const API_TOKEN = process.env.API_TOKEN || "my-secret-token";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "2mb" }));

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== API_TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

app.use("/answer", answerRouter);
app.use("/followup", authMiddleware, followUpRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
