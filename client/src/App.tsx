import { useEffect, useRef, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import WebcamCapture from './components/WebcamCapture';
import { fetchHello, analyzeStrokeImage } from './api/flask'; // Changed import

const STROKE_FACTS = [
  { icon: "🧑‍⚕️", text: "Sudden numbness or weakness in the face, arm, or leg, especially on one side of the body." },
  { icon: "💬", text: "Sudden confusion, trouble speaking, or understanding speech." },
  { icon: "👁️", text: "Sudden trouble seeing in one or both eyes." },
  { icon: "🦵", text: "Sudden trouble walking, dizziness, loss of balance or coordination." },
  { icon: "💢", text: "Sudden severe headache with no known cause." },
  { icon: "🙂", text: "Face drooping: Ask the person to smile. Does one side of the face droop?" },
  { icon: "🫱", text: "Arm weakness: Ask the person to raise both arms. Does one arm drift downward?" },
  { icon: "🗣️", text: "Speech difficulty: Ask the person to repeat a simple phrase. Is the speech slurred or strange?" },
  { icon: "⏰", text: "Time to call emergency services if any symptoms are present." },
  { icon: "⚡", text: "Acting quickly can save lives and reduce disability." }
];

interface StrokeResult {
  success: boolean;
  stroke_risk: number;
  detected: boolean;
  confidence: number;
}

function App() {
  const [summary, setSummary] = useState<string | null>(null);
  const [strokeResult, setStrokeResult] = useState<StrokeResult | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioRef = useRef(new Audio("/alarm.mp3"));
  const cameraAudioRef = useRef(new Audio("/camera.mp3"));

  const playSound = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }

  const stopSound = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // rewind
  };

  const playCameraSound = () => {
    cameraAudioRef.current.currentTime = 0;
    cameraAudioRef.current.play();
  }

  const startCameraAndCapture = async () => {
    playCameraSound();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();

          setTimeout(() => {
            if (!canvasRef.current || !videoRef.current) return;

            const canvas = canvasRef.current;
            const video = videoRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL("image/png");
            setSelected('add-photo');
            setPhotoURL(imageData);
            setStrokeResult(null);

            canvas.toBlob(async (blob) => {
              if (!blob) return;
              const file = new File([blob], "capture.png", { type: "image/png" });

              const formData = new FormData();
              formData.append("file", file);

              try {
                // Send to stroke detection API
                const result = await analyzeStrokeImage(formData);
                setStrokeResult(result);
                
                // Update summary based on result
                if (result.detected) {
                  setSummary(`⚠️ Stroke signs detected with ${result.confidence.toFixed(1)}% confidence. Please seek medical attention immediately.`);
                  playSound();
                } else {
                  setSummary(`✅ No stroke signs detected (${result.confidence.toFixed(1)}% confidence). If symptoms persist, consult a doctor.`);
                }
              } catch (error) {
                console.error("Error analyzing image:", error);
                setSummary("❌ Error analyzing image. Please try again.");
              } finally {
                setLoading(false);
              }
            });

            stream.getTracks().forEach(track => track.stop());
          }, 100);
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (imageUrl === photoURL) return;
      
      const formData = new FormData();
      formData.append("file", file);
      
      setSelected('photo-library');
      setPhotoURL(imageUrl);
      setLoading(true);
      setStrokeResult(null);

      try {
        // Send to stroke detection API
        const result = await analyzeStrokeImage(formData);
        setStrokeResult(result);
        
        // Update summary based on result
        if (result.detected) {
          setSummary(`⚠️ Stroke signs detected with ${result.confidence.toFixed(1)}% confidence. Please seek medical attention immediately.`);
          playSound();
        } else {
          setSummary(`✅ No stroke signs detected (${result.confidence.toFixed(1)}% confidence). If symptoms persist, consult a doctor.`);
        }
      } catch (error) {
        console.error("Error analyzing image:", error);
        setSummary("❌ Error analyzing image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    e.target.value = ""
  };

  const handleModeSelect = (mode: string) => {
    stopSound();
    if (mode === selected) return setSelected(null);
    setSelected(mode);
  }

  const handleRemovePhoto = () => {
    setSelected(null);
    setPhotoURL(null);
    setStrokeResult(null);
    setSummary(null);
  }

  useEffect(() => {
    const hello = async () => {
      console.log(await fetchHello());
    }
    hello();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start gap-10 px-5
        bg-[#545454]
        overflow-y-scroll">
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="flex items-center justify-center mt-50">
          <div className="flex flex-col gap-2">
            <h1 id="app-quote" className="text-6xl text-white text-center">neuralSpot.</h1>
            <p id="app-quote" className="text-xl text-white">seconds save lives.</p>
          </div>
          <img src="/logo.png" className="w-[200px] h-[200px]" />
        </div>

      <section className="bg-neutral-800/80 backdrop-blur p-4 rounded-lg shadow-lg
      w-full max-w-4xl gap-10 flex flex-col items-center justify-center">
        {(selected === 'add-photo' || selected === 'photo-library') && photoURL && (
          <> 
            <div className="w-[320px] h-[240px] rounded-xl border-2 border-neutral-700 shadow-lg bg-black overflow-hidden">
              <img src={photoURL} className="w-full h-full object-cover" />
            </div>
            
            {loading && (
              <div className="text-white text-center">
                <p>🔄 Analyzing image... Please wait.</p>
              </div>
            )}
            
            {strokeResult && (
              <div className={`w-full max-w-md p-4 rounded-lg ${
                strokeResult.detected 
                  ? 'bg-red-500/80 text-white' 
                  : 'bg-green-500/80 text-white'
              }`}>
                <h2 className="text-xl font-bold text-center mb-2">
                  {strokeResult.detected ? '⚠️ Stroke Detected' : '✅ No Stroke Detected'}
                </h2>
                <p className="text-center">
                  Confidence: {strokeResult.confidence.toFixed(1)}%
                </p>
                <p className="text-center text-sm mt-2">
                  Risk score: {(strokeResult.stroke_risk * 100).toFixed(1)}%
                </p>
              </div>
            )}
            
            <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full
              cursor-pointer text-white font-bold hover:scale-105 transition"
              onClick={handleRemovePhoto}>
                Remove Photo
            </button>
          </>
        )}
        
        {selected === 'linked-camera' && (
          <WebcamCapture playSound={playSound} stopSound={stopSound} playCameraSound={playCameraSound} />
        )}

        {selected !== null && <hr className="w-full text-white" />}

        <div className="w-full flex items-center justify-center gap-5">
          <button title="Take a photo"
            className="rounded-full p-2 flex items-center justify-center h-[80px] w-[80px] bg-white cursor-pointer
            shadow-xl shadow-black/50
            hover:bg-black duration-200 transition"
            onClick={() => startCameraAndCapture()}
            onMouseEnter={() => setHovered('add-photo')} 
            onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <AddPhotoAlternateIcon
                fontSize="large" 
                className={`duration-200 ${hovered === 'add-photo' ? 'text-green-500 scale-115' : 'text-black'} !transition`} />
            </span>
          </button>
          
          <button title="Upload from Library" 
            className="rounded-full p-2 flex items-center justify-center h-[80px] w-[80px] bg-white cursor-pointer
            shadow-lg shadow-black/50
            hover:bg-black duration-200 transition"
            onClick={() => openFileDialog()}
            onMouseEnter={() => setHovered('photo-library')} 
            onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <PhotoLibraryIcon
                fontSize="large"
                className={`duration-200 ${hovered === 'photo-library' ? 'text-green-500 scale-115' : 'text-black'} !transition`} />
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </button>
          
          <button title="Automatic Screenshots" 
            className="rounded-full p-2 flex items-center justify-center h-[80px] w-[80px] bg-white cursor-pointer
            shadow-lg shadow-black/50
            hover:bg-black duration-200 transition"
            onClick={() => handleModeSelect("linked-camera")}
            onMouseEnter={() => setHovered('linked-camera')} 
            onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <LinkedCameraIcon
                fontSize="large"
                className={`duration-200 ${hovered === 'linked-camera' ? 'text-green-500 scale-115' : 'text-black'} !transition`}
              />
            </span>
          </button>
        </div>
      </section>

      <h1 className="text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mt-12">
        Analysis Result:
      </h1>

      {summary ? (
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg mt-10 max-w-2xl">
          <p className="text-lg font-semibold text-gray-800">{summary}</p>
        </div>
      ) : (
        <h1 className="text-xl font-semibold italic underline 
          bg-gradient-to-r from-green-300 to-green-600 
          bg-clip-text text-transparent 
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] 
          tracking-wide">
            Add a photo to see results!
        </h1>
      )}

      <h1 className="text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mt-12">
        Common signs of a <span className="font-medium italic underline">stroke</span>:
      </h1>

      <section className="mb-25">
        {STROKE_FACTS.map((fact, idx) => (
          <div key={idx} className="flex items-start gap-3 mt-4
              p-2 bg-black/30 backdrop-blur-sm rounded-lg
              shadow-md hover:shadow-lg transition-shadow duration-200">
            <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{fact.icon}</span>
            <p className="text-gray-200 text-sm md:text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              {fact.text}
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default App
