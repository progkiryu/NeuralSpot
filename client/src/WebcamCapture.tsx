import { useEffect, useRef, useState } from "react";

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  // Start webcam
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
      }
    };
    startWebcam();
  }, []);

  // Countdown timer
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

    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-4 items-center justify-center">
      {/* Video container */}
      <div className="relative w-[320px] h-[240px] rounded-xl overflow-hidden border-2 border-neutral-700 shadow-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-full object-cover bg-black"
        />
        {/* Countdown overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white text-6xl font-bold drop-shadow-lg">
            {countdown}
          </span>
        </div>
      </div>

      {/* Hidden canvas for capture */}
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        style={{ display: "none" }}
      />

      <CompareArrowsIcon className="text-white text-4xl" />

      {/* Latest photo */}
      <div className="lg:mt-0 mt-4 w-[320px] h-[240px] rounded-xl overflow-hidden border-2 border-neutral-700 shadow-lg bg-black">
        {photo && (
          <img
            src={photo}
            alt="Latest photo"
            className="w-full h-full object-cover bg-black"
          />
        )}
      </div>
    </div>
  );
}