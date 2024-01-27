import { Button } from "@/components/ui/button";

import "@/style.css";

function IndexPopup() {
  async function beginSnap() {
    console.log("begin snap");
    await chrome.tabs.query(
      { active: true, currentWindow: true },
      ([activeTab]) => {
        chrome.tabs.sendMessage(activeTab.id, { message: "begin-snap" });
      }
    );
  }

  return (
    <div className="p-4 text-center">
      <h2 className="whitespace-nowrap pb-2 text-lg">Clever Snap</h2>
      <Button onClick={beginSnap}>Snap!</Button>
    </div>
  );
}

export default IndexPopup;
