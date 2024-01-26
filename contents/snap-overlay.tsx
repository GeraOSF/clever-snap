import { Button } from "@/components/ui/button";
import cssText from "data-text:@/style.css";
import { XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function getStyle() {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
}

export default function SnapOverlay() {
  const [isSnapping, setIsSnapping] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.message === "begin-snap") setIsSnapping(true);
    });

    return () => {
      chrome.runtime.onMessage.removeListener(() => {});
    };
  }, []);

  if (!isSnapping) return null;

  return (
    <div className="cursor-crosshair fixed inset-0 bg-black/50">
      <Button onClick={() => setIsSnapping(false)} size="icon">
        <XCircleIcon />
      </Button>
    </div>
  );
}
