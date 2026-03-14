import { useEffect, useRef, useState } from "react";

export default function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const interval = setInterval(capturePhoto, 5000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error(error);
      }
    };

    startWebcam();
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    console.log(dataUrl);
    setPhoto(dataUrl);
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        style={{ width: 320, height: 240 }}
      />

      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        style={{ display: "none" }}
      />

      {photo && (
        <img
          src={photo}
          alt="Latest photo"
          style={{
            display: "block",
            marginTop: 10,
            width: 320,
            height: 240,
            border: "1px solid #ccc"
          }}
        />
      )}
    </div>
  );
}