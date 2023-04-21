import { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import BaseImage01 from "./Resources/baseImage01.png";
import BaseImage02 from "./Resources/baseImage02.png";
import "./App.css";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  type ImageIndex = "FIRST" | "SECOND";
  const baseImage01Ref = useRef<HTMLImageElement>(null);
  const baseImage02Ref = useRef<HTMLImageElement>(null);

  const imageInCanvasWidth = 720;
  const imageInCanvasHeight =
    Math.floor((imageInCanvasWidth / 16) * 9 * 100) / 100; // default: 540 (when width = 960)

  const sizes = {
    //* 16:9 비율로 맞춘, 캔버스에 들어갈 수 있도록 변환된 너비, 높이
    imageInCanvasWidth,
    imageInCanvasHeight,
    //* 텍스트 리셋을 위해 지우는 사각형 시작 좌표 및 너비, 높이
    clearRectStartX: Math.floor((imageInCanvasWidth / 960) * 54 * 100) / 100,
    clearRectStartY: Math.floor((imageInCanvasHeight / 540) * 412 * 100) / 100,
    clearRectWidth: Math.floor((imageInCanvasWidth / 960) * 780 * 100) / 100,
    clearRectHeight: Math.floor((imageInCanvasHeight / 540) * 56 * 100) / 100,
    //* 텍스트 폰트 크기 및 시작 좌표
    textSize: Math.floor((imageInCanvasWidth / 960) * 21 * 100) / 100,
    textStartX: Math.floor((imageInCanvasWidth / 960) * 70 * 100) / 100,
    textStartY: Math.floor((imageInCanvasHeight / 540) * 435 * 100) / 100,
  };

  const [firstImageText, setFirstImageText] =
    useState<string>("여기에 자막 내용을 입력하세요.");
  const [secondImageText, setSecondImageText] = useState<string>(
    "최대 두줄까지\n입력할 수 있습니다."
  );

  useEffect(() => {
    if (canvasRef.current && baseImage01Ref.current && baseImage02Ref.current) {
      baseImage01Ref.current.onload = () => {
        drawImage("FIRST");
        drawText("FIRST", firstImageText);
      };
      baseImage02Ref.current.onload = () => {
        drawImage("SECOND");
        drawText("SECOND", secondImageText);
      };
    }
  }, []);

  /**
   * 캔버스에 이미지를 그립니다.
   */
  const drawImage = (imageIndex: ImageIndex) => {
    const editFirstImage = imageIndex === "FIRST";

    const context = canvasRef.current!.getContext("2d")!;
    context.drawImage(
      editFirstImage ? baseImage01Ref.current! : baseImage02Ref.current!,
      0,
      0,
      1920,
      1080,
      0,
      editFirstImage ? 0 : sizes.imageInCanvasHeight,
      sizes.imageInCanvasWidth,
      sizes.imageInCanvasHeight
    );
  };

  /**
   * canvas 에 텍스트를 그립니다. 프로세스는 다음과 같습니다:
   *  1. 텍스트 입력값을 줄바꿈을 기준으로 나눕니다.
   *  2. 3줄 이상이면 상태값을 변경하지 않고 return 합니다.
   *  3. clearRect 를 이용해 텍스트가 그려지는 영역을 삭제합니다.
   *  4. 이미지를 다시 그립니다.
   *  5. 텍스트를 그립니다.
   */
  const drawText = (imageIndex: ImageIndex, text: string) => {
    const editFirstImage = imageIndex === "FIRST";

    //* 1., 2. 먼저 텍스트 입력값을 줄바꿈을 기준으로 나누고, 3줄 이상이면 상태값을 변경하지 않고 return 합니다.
    const textsPerLine = text.split("\n");
    if (textsPerLine.length > 2) return;

    editFirstImage ? setFirstImageText(text) : setSecondImageText(text);

    const context = canvasRef.current!.getContext("2d")!;
    //* 3. clearRect 를 이용해 텍스트가 그려지는 영역을 삭제합니다.
    context.clearRect(
      sizes.clearRectStartX,
      editFirstImage
        ? sizes.clearRectStartY
        : sizes.clearRectStartY + sizes.imageInCanvasHeight,
      sizes.clearRectWidth,
      sizes.clearRectHeight
    );
    //* 4. clearRect 를 쓰면 이미지까지 지워버리기 때문에, 이미지를 다시 그립니다.
    drawImage(imageIndex);
    //* 5. 텍스트의 스타일을 설정하고 텍스트를 그립니다.
    context.font = `bold ${sizes.textSize}px Arial`;
    canvasRef.current!.style.letterSpacing = "0px";
    context.fillStyle = "#100B56";
    textsPerLine.forEach((text, line) => {
      context.fillText(
        text,
        sizes.textStartX,
        sizes.textStartY + // 기본 위치
          line * ((sizes.textSize / 3) * 4) + // 행간 (canvas 가 line-break 를 지원하지 않기 때문에 수동으로 행간을 만들어줘야 합니다.)
          (editFirstImage ? 0 : sizes.imageInCanvasHeight)
      );
    });
  };

  /** canvas 에 그려진 이미지를 다운로드합니다. */
  const downloadImage = () => {
    const url = canvasRef.current!.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `문수 가라사대 '${
      firstImageText.length <= 15
        ? firstImageText
        : `${firstImageText.slice(0, 12)}...`
    }'.png`;
    downloadLink.href = url;
    downloadLink.click();
  };

  return (
    <div
      id="main_container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#E6F4FF",
        padding: "24px",
      }}
    >
      {/* 최상단 타이틀 섹션 */}
      <div id="title_container" style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>
          문수 가라사대..
        </h1>
      </div>
      <div
        id="canvas_container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "fit-content",
          height: "fit-content",
          backgroundColor: "#FFE4C2",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        {/* 텍스트 입력 필드*/}
        <div
          id="text_button_container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "16px",
          }}
        >
          <div
            id="inputs_container"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <TextField
              multiline
              value={firstImageText}
              helperText="첫번째 말씀"
              placeholder="첫번째 이미지에 들어갈 자막"
              rows={2}
              fullWidth
              onChange={(event) => {
                drawText("FIRST", event.target.value);
              }}
            />
            <TextField
              multiline
              value={secondImageText}
              helperText="두번째 말씀"
              placeholder="두번째 이미지에 들어갈 자막"
              rows={2}
              fullWidth
              onChange={(event) => {
                drawText("SECOND", event.target.value);
              }}
            />
          </div>
          <Button onClick={downloadImage} variant="contained">
            말씀 저장하기
          </Button>
        </div>

        {/* 이미지 미리보기. canvas */}
        <canvas
          ref={canvasRef}
          width={sizes.imageInCanvasWidth}
          height={sizes.imageInCanvasHeight * 2}
        />
      </div>
      {/* canvas 에 옮길 이미지 */}
      <img ref={baseImage01Ref} src={BaseImage01} style={{ display: "none" }} />
      <img ref={baseImage02Ref} src={BaseImage02} style={{ display: "none" }} />
    </div>
  );
};
