import { OPENAI_API_KEY } from "@/lib/config";
import { Router } from "express";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const followUpRouter = Router();

followUpRouter.post("/answer", async (req, res) => {
  const {
    imgUri,
    answer: originalAnswer,
    question,
  }: { imgUri: string; answer: string; question: string } = req.body;
  if (!imgUri) {
    return res.status(400).send("imgUri is required");
  }
  if (!originalAnswer) {
    return res.status(400).send("Original answer is required");
  }

  if (!question) {
    return res.status(400).send("Follow-up question is required");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "You are answering a follow-up question. You have the original answer to a screenshot question. Use it along with the follow-up question to provide a concise but accurate answer of follow-up question, and follow-up answer has to be inshort.",
        },
        {
          role: "user",
          content: `Original Answer: ${originalAnswer}\nFollow-up Question: ${question}`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imgUri },
            },
          ],
        },
      ],
      max_completion_tokens: 2000,
    });
    const followUpAnswer = response.choices[0].message.content;
    res.json({ answer: followUpAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while generating follow up answer.");
  }
});

export default followUpRouter;
