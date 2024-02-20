import express from "express";
import dotenv from "dotenv";
import answerRouter from "../routes/answer";

dotenv.config();
const app = express();
app.use(express.json({ limit: "2mb" }));

// Routes
app.use("/answer", answerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
