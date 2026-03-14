import { useEffect, useRef, useState } from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { analyzeStrokeImage } from '../api/flask'; // Import your API

interface StrokeResult {
  success: boolean;
  stroke_risk: number;
  detected: boolean;
  confidence: number;
}

export default function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [result, setResult] = useState<StrokeResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

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
          captureAndAnalyze();
          return 5; // reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const captureAndAnalyze = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Capture photo
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);

    // Convert base64 to file and analyze
    setIsAnalyzing(true);
    try {
      // Convert base64 to blob
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });

      // Send for analysis
      const formData = new FormData();
      formData.append('file', file);
      
      const analysisResult = await analyzeStrokeImage(formData);
      setResult(analysisResult);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
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
          {isAnalyzing && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
              Analyzing...
            </div>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          style={{ display: "none" }}
        />

        <CompareArrowsIcon className="text-white text-4xl" />

        {/* Latest photo with result overlay */}
        <div className="relative w-[320px] h-[240px] rounded-xl overflow-hidden border-2 border-neutral-700 shadow-lg bg-black">
          {photo && (
            <>
              <img
                src={photo}
                alt="Latest photo"
                className="w-full h-full object-cover bg-black"
              />
              {result && (
                <div className={`absolute bottom-0 left-0 right-0 p-2 text-center text-white ${
                  result.detected ? 'bg-red-500/90' : 'bg-green-500/90'
                }`}>
                  <span className="font-bold">
                    {result.detected ? '⚠️ STROKE' : '✅ NORMAL'}
                  </span>
                  <span className="ml-2 text-sm">
                    {result.confidence.toFixed(1)}%
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Result details */}
      {result && (
        <div className="text-white text-center mt-2">
          <p>Risk Score: {(result.stroke_risk * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
