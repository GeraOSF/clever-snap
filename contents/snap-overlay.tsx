import cssText from "data-text:@/style.css";
import { useEffect, useRef, useState } from "react";

export function getStyle() {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
}

export default function SnapOverlay() {
  const [isSnapping, setIsSnapping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const positions = useRef<PositionInterval>({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  });

  useEffect(() => {
    function handleMessage(request: { message: string }) {
      if (request.message === "begin-snap") setIsSnapping(true);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsSnapping(false);
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    document.addEventListener("keydown", handleEscape);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isSnapping) return;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    function handleMouseDown(event: MouseEvent) {
      ctx.beginPath();
      ctx.moveTo(event.clientX, event.clientY);
      positions.current.start = { x: event.clientX, y: event.clientY };
      isDrawing.current = true;
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDrawing.current) return;
      const startPosition = positions.current.start;
      const rectWidth = event.clientX - startPosition.x;
      const rectHeight = event.clientY - startPosition.y;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.clearRect(startPosition.x, startPosition.y, rectWidth, rectHeight);
      ctx.strokeRect(startPosition.x, startPosition.y, rectWidth, rectHeight);
    }

    function handleMouseUp(event: MouseEvent) {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      positions.current.end = { x: event.clientX, y: event.clientY };
      setIsSnapping(false);
      // TODO: Send the positions to the background script
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef, isSnapping]);

  if (!isSnapping) return null;

  return (
    <div className="fixed h-screen w-screen">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
