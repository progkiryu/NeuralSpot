
import { useEffect, useRef, useState } from "react";

export default function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          capturePhoto();
          return 5; // reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-xl overflow-hidden border-2 border-neutral-700 shadow-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          className="w-[320px] h-[240px] object-cover bg-black"
        />
      </div>
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
          className="mt-4 w-[160px] h-[120px] rounded border border-neutral-700 shadow"
        />
      )}
    </div>
  );
}