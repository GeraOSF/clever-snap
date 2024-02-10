import { clear, time } from "console";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import cssText from "data-text:@/style.css";
import { BoxSelectIcon, CameraIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function getStyle() {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
}

export default function Sidepanel() {
  const [mounted, setMounted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  function beginSnap() {
    chrome.runtime.sendMessage({ message: "begin-snap" });
    setPanelOpen(false);
  }

  useEffect(() => {
    function handleMessage(request: { message: string }) {
      if (request.message === "open-panel") {
        setPanelOpen(true);
        setMounted(true);
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!panelOpen) {
      timeout = setTimeout(() => {
        setMounted(false);
      }, 100);
    }
    return () => clearTimeout(timeout);
  }, [panelOpen]);

  if (!mounted) return null;
  return (
    <div
      className={cn(
        "bg-background fixed right-0 flex h-full flex-col gap-2 rounded-l-lg px-4 py-2",
        {
          "animate-out slide-out-to-right-full": !panelOpen,
          "animate-in slide-in-from-right-full": panelOpen
        }
      )}>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setPanelOpen(false)}
        title="Close panel"
        className="self-end rounded-full">
        <XIcon />
      </Button>
      <h1 className="text-center text-xl font-black">Clever Snap</h1>
      <Button onClick={beginSnap} size="lg" className="gap-1">
        <div className="relative">
          <BoxSelectIcon size={32} />
          <CameraIcon
            size={18}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        Draw a box
      </Button>
    </div>
  );
}
