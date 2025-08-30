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

  if (!imgUri) return res.status(400).send("imgUri is required");
  if (!originalAnswer)
    return res.status(400).send("Original answer is required");
  if (!question) return res.status(400).send("Follow-up question is required");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5-nano",
      stream: true,
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
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        res.write(`data: ${token}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error(error);
    res.write("data: [ERROR]\n\n");
    res.end();
  }
});

export default followUpRouter;
