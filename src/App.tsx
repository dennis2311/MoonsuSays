import { useRef, useState, useEffect } from "react";
import BaseImage01 from "./Resources/baseImage01.png";
import BaseImage02 from "./Resources/baseImage02.png";
import "./App.css";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImage01Ref = useRef<HTMLImageElement>(null);
  const baseImage02Ref = useRef<HTMLImageElement>(null);

  const innerWidth = window.innerWidth;
  const [text, setText] = useState<string>("여기에 텍스트");

  useEffect(() => {
    if (canvasRef.current && baseImage01Ref.current) {
      baseImage01Ref.current.onload = () => {
        const context = canvasRef.current!.getContext("2d")!;
        context.drawImage(
          baseImage01Ref.current!,
          0,
          0,
          1920,
          1080,
          0,
          0,
          960,
          540
        );
      };
    }
  }, []);

  const drawHello = () => {
    const context = canvasRef.current!.getContext("2d")!;
    context.font = "30px Arial";
    context.fillText(text, 10, 50);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        id="canvas_container"
        style={{ display: "flex", flexDirection: "row", width: "100%" }}
      >
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          style={{
            backgroundColor: "white",
            border: "1px solid black",
          }}
        />
        <div
          id="inputs_container"
          style={{ display: "flex", flexDirection: "column", width: 320 }}
        >
          <button onClick={drawHello}>그리기</button>
        </div>
      </div>

      {/* canvas 에 옮길 이미지 */}
      <img ref={baseImage01Ref} src={BaseImage01} style={{ display: "none" }} />
      <img ref={baseImage02Ref} src={BaseImage02} style={{ display: "none" }} />
    </div>
  );
};
