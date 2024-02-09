chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { message: "open-panel" });
});

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.runtime.onMessage.addListener((req) => {
    if (req.message === "begin-snap") {
      chrome.tabs.sendMessage(tab.id, { message: "begin-snap" });
    }
  });
});
