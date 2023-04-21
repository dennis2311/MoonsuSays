import { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import BaseImage01 from "./Resources/baseImage01.png";
import BaseImage02 from "./Resources/baseImage02.png";
import "./App.css";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImage01Ref = useRef<HTMLImageElement>(null);
  const baseImage02Ref = useRef<HTMLImageElement>(null);

  const baseImageWidth = 720;
  const baseImageHeight = Math.floor((baseImageWidth / 16) * 9); // default: 540 (when width = 960)
  const sizes = {
    //* 16:9 비율로 맞춘 이미지 사이즈
    width: baseImageWidth,
    height: baseImageHeight,
    //* 텍스트 리셋을 위해 지우는 사각형 시작 좌표
    clearRectStartX: Math.floor((baseImageWidth / 960) * 54 * 100) / 100,
    clearRectStartY: Math.floor((baseImageHeight / 540) * 412 * 100) / 100,
    clearRectWidth: Math.floor((baseImageWidth / 960) * 780 * 100) / 100,
    clearRectHeight: Math.floor((baseImageHeight / 540) * 56 * 100) / 100,
    //* 텍스트 시작 좌표
    textSize: Math.floor((baseImageWidth / 960) * 21 * 100) / 100,
    textStartX: Math.floor((baseImageWidth / 960) * 70 * 100) / 100,
    textStartY: Math.floor((baseImageHeight / 540) * 435 * 100) / 100,
  };

  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (canvasRef.current && baseImage01Ref.current) {
      baseImage01Ref.current.onload = () => {
        drawImage();
      };
    }
  }, []);

  //* 캔버스에 이미지를 그립니다.
  const drawImage = () => {
    const context = canvasRef.current!.getContext("2d")!;
    context.drawImage(
      baseImage01Ref.current!,
      0,
      0,
      1920,
      1080,
      0,
      0,
      sizes.width,
      sizes.height
    );
  };

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //* 먼저 텍스트 입력값을 줄바꿈을 기준으로 나누고, 3줄 이상이면 상태값을 변경하지 않고 return 합니다.
    const textsPerLine = event.target.value.split("\n");
    if (textsPerLine.length > 2) return;

    setText(event.target.value);
    const context = canvasRef.current!.getContext("2d")!;
    context.clearRect(
      sizes.clearRectStartX,
      sizes.clearRectStartY,
      sizes.clearRectWidth,
      sizes.clearRectHeight
    );
    //* clearRect 를 쓰면 이미지까지 지워버리기 때문에, 이미지를 다시 그려줘야 합니다.
    drawImage();
    context.font = `bold ${sizes.textSize}px Arial`;
    canvasRef.current!.style.letterSpacing = "0px";
    context.fillStyle = "#100B56";
    textsPerLine.forEach((text, line) => {
      context.fillText(
        text,
        sizes.textStartX,
        sizes.textStartY + line * ((sizes.textSize / 3) * 4)
      );
    });
  };

  const downloadImage = () => {
    const url = canvasRef.current!.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `문수 가라사대 '${text.slice(0, 12)}${
      text.length > 12 ? "..." : ""
    }'.png`;
    downloadLink.href = url;
    downloadLink.click();
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        id="canvas_container"
        style={{ display: "flex", flexDirection: "row", width: "100%" }}
      >
        <canvas ref={canvasRef} width={sizes.width} height={sizes.height} />
        <div
          id="inputs_container"
          style={{ display: "flex", flexDirection: "column", width: 320 }}
        >
          <TextField multiline value={text} onChange={onTextChange} />
          <Button onClick={downloadImage} variant="contained">
            이미지 다운로드
          </Button>
        </div>
      </div>

      {/* canvas 에 옮길 이미지 */}
      <img ref={baseImage01Ref} src={BaseImage01} style={{ display: "none" }} />
      <img ref={baseImage02Ref} src={BaseImage02} style={{ display: "none" }} />
    </div>
  );
};
