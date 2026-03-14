import { useRef, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import WebcamCapture from './WebcamCapture';

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

function App() {

  const [summary, setSummary] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCameraAndCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();

          // capture instantly after the video starts
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

            // stop all camera tracks
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      const imageUrl = URL.createObjectURL(file);
      setSelected('photo-library');
      setPhotoURL(imageUrl);
    }
  };

  const handleModeSelect = (mode: string) => {
    if (mode === selected) return setSelected(null);
    setSelected(mode);
  }

  const handleRemovePhoto = () => {
    setSelected(null);
    setPhotoURL(null);
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start gap-10 px-5
        bg-gradient-to-r from-indigo-900 via-black-500 to-red-400
        overflow-y-scroll">
        <video ref={videoRef} style={{ display: "none" }} />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <h1 id="app-quote" className="mt-50 text-6xl italic text-white text-center"> 🧠 Detect strokes. Make split-decisions.</h1>


      <section className="bg-neutral-800/80 backdrop-blur p-4 rounded-lg shadow-lg
      w-full max-w-4xl gap-10 flex flex-col items-center justify-center">
        {
          (selected === 'add-photo' && photoURL) && (
            <> 
              <div className="w-[320px] h-[240px] rounded-xl border-2 border-neutral-700 shadow-lg bg-black overflow-hidden">
                <img src={photoURL} className="w-full h-full object-cover" />
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full
              cursor-pointer text-white font-bold hover:scale-105 transition"
              onClick={handleRemovePhoto}>
                Remove Photo
              </button>
            </>
          )
        }
        { selected === 'linked-camera' && (
          <WebcamCapture />
        )
        }
        {
          selected === 'photo-library' && photoURL && (
            <>
              <div className="w-[320px] h-[240px] rounded-xl border-2 border-neutral-700 shadow-lg bg-black overflow-hidden">
                <img className="w-full h-full object-cover" alt="Selected"
                src={photoURL} />
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full
              cursor-pointer text-white font-bold hover:scale-105 transition"
              onClick={handleRemovePhoto}>
                Remove Photo
              </button>
            </>
          )
        }

        { selected !== null && <hr className="w-full" /> }

        <div className="w-full flex items-center justify-center gap-5">
          <button title="Take a photo"
          className="rounded-full p-2 flex items-center justify-center h-[80px] w-[80px] bg-white cursor-pointer
          shadow-xl shadow-black/50
          hover:bg-black duration-200 transition"
          onClick={() => startCameraAndCapture()}
          onMouseEnter={() => setHovered('add-photo')} onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <AddPhotoAlternateIcon
              fontSize="large" 
              className={`duration-200 ${hovered === 'add-photo' ? 'text-pink-500 scale-115' : 'text-black'} !transition`} />
            </span>
          </button>
          <button title="Upload from Library" 
          className="rounded-full p-2 flex items-center justify-center h-[80px] w-[80px] bg-white cursor-pointer
          shadow-lg shadow-black/50
          hover:bg-black duration-200 transition"
          onClick={() => openFileDialog()}
          onMouseEnter={() => setHovered('photo-library')} onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <PhotoLibraryIcon
               fontSize="large"
               className={`duration-200 ${hovered === 'photo-library' ? 'text-pink-500 scale-115' : 'text-black'} !transition`} />
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
          onMouseEnter={() => setHovered('linked-camera')} onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <LinkedCameraIcon
                fontSize="large"
                className={`duration-200 ${hovered === 'linked-camera' ? 'text-pink-500 scale-115' : 'text-black'} !transition`}
              />
            </span>
          </button>
        </div>
      </section>

      <h1 className="text-2xl text-white
      drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mt-12">Your photo summary:</h1>

      {summary ? (
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg mt-10">
            <p className="text-lg font-semibold text-gray-800">{summary}</p>
          </div>
        ) : <h1 className="text-xl font-semibold italic underline 
          bg-gradient-to-r from-orange-500 to-pink-500 
          bg-clip-text text-transparent 
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] 
          tracking-wide">
            Add a photo to see results!
          </h1>
      }

      <h1 className="text-2xl text-white
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mt-12">
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
