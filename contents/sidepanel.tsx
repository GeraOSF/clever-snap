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
  const [imgUri, setImgUri] = useState("");

  function beginSnap() {
    chrome.runtime.sendMessage({ message: "begin-snap" });
    setPanelOpen(false);
  }

  useEffect(() => {
    function handleMessages(request: {
      message: string;
      imgUri: string;
      coordinates: BoxCoordinates;
    }) {
      const { coordinates, imgUri: fullImgUri } = request;
      function openPanel() {
        setPanelOpen(true);
        setMounted(true);
      }
      if (request.message === "open-panel") openPanel();
      if (request.message === "show-snap") {
        const img = new Image();
        img.onload = () => {
          const cropWidth = coordinates.end.x - coordinates.start.x - 2;
          const cropHeight = coordinates.end.y - coordinates.start.y - 2;
          const canvas = document.createElement("canvas");
          canvas.width = cropWidth;
          canvas.height = cropHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            img,
            coordinates.start.x + 1,
            coordinates.start.y + 1, // Start clipping
            cropWidth,
            cropHeight, // Clipping size
            0,
            0, // Place the clipped part at the canvas origin
            cropWidth,
            cropHeight
          ); // Size of the clipped image on the canvas
          const croppedImgUri = canvas.toDataURL();
          setImgUri(croppedImgUri);
          // TODO: Send the croppedDataUri to the background script
        };
        img.src = fullImgUri;
        openPanel();
      }
    }
    chrome.runtime.onMessage.addListener(handleMessages);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessages);
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
        "bg-background fixed right-0 flex h-full w-96 flex-col gap-2 rounded-l-lg px-4 py-2",
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
      {imgUri && (
        <img src={imgUri} alt="Snapshot" className="w-full object-cover" />
      )}
    </div>
  );
}
