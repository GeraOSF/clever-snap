import { type PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req) => {
  const coordinates: BoxCoordinates = req.body.coordinates;
  chrome.tabs.captureVisibleTab(null, {}, (dataUri) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, {
        message: "show-snap",
        imgUri: dataUri,
        coordinates
      });
    });
  });
};

export default handler;
