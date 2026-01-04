import React, { useEffect, useRef } from "react";
import * as fabric from "fabric"
export default function BannerEditor() {
  const canvasRef = useRef(null);
  let canvas;

  useEffect(() => {
    // Create canvas ONLY if not exists
    if (!canvasRef.current) {
      const c = new fabric.Canvas("canvas", {
        width: 1080,
        height: 500,
        backgroundColor: "#f5f5f5",
      });
      canvasRef.current = c;
    }

    // Cleanup when component unmounts
    return () => {
      if (canvasRef.current) {
        canvasRef.current.dispose();
        canvasRef.current = null;
      }
    };
  }, []);

  const addText = () => {
    const text = new fabric.Textbox("New Offer!", {
      fontSize: 40,
      left: 50,
      top: 50,
      fill: "#000",
    });
    canvasRef.current.add(text);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToWidth(300);
        canvasRef.current.add(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const exportBanner = () => {
    const dataURL = canvasRef.current.toDataURL({
      format: "png",
      quality: 1.0,
    });
    const link = document.createElement("a");
    link.download = "banner.png";
    link.href = dataURL;
    link.click();
  };

  const saveDesign = async () => {
    const json = JSON.stringify(canvasRef.current.toJSON());
    // send to backend
    await fetch("/api/banner/save/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banner_json: json }),
    });
    alert("Design Saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Banner Editor</h2>

      <div style={{ marginBottom: 15 }}>
        <button onClick={addText}>Add Text</button>
        <input type="file" onChange={uploadImage} />
        <button onClick={exportBanner}>Export PNG</button>
        <button onClick={saveDesign}>Save Design</button>
      </div>

      <canvas id="canvas" style={{ border: "1px solid black" }}></canvas>
    </div>
  );
}
