import { type PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req) => {
  const imgUri: string = req.body.imgUri;
  // TODO: Send the image to the server and get the answer
};

export default handler;
