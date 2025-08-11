import { PORT } from "@/lib/config";
import answerRouter from "@/routes/answer";
import followUpRouter from "./routes/followup";
import express from "express";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.use("/answer", answerRouter);
app.use("/followup", followUpRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
