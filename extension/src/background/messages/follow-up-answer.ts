import { type PlasmoMessaging } from "@plasmohq/messaging"

const PORT = process.env.PLASMO_PUBLIC_PORT || 3000

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { imgUri, answer, question } = req.body
  try {
    const { answer: followAnswer } = await fetch(
      `http://localhost:${PORT}/followup/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imgUri, answer, question })
      }
    ).then((r) => r.json())

    res.send(followAnswer)
  } catch (error) {
    console.error(error)
    res.send("Error fetching follow-up answer.")
  }
}

export default handler
