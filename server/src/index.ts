import express from "express";
import { PORT } from "@/env-vars";
import answerRouter from "@/routes/answer";

const app = express();
app.use(express.json({ limit: "2mb" }));

// Routes
app.use("/answer", answerRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
