import { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';


function App() {

  const [summary, SetSummary] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-10 px-5
    bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400">
      <h1 className="text-4xl font-bold text-white">Detect stokes. Make split-decisions.</h1>
      
      <section className="w-full max-w-4xl gap-10 flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center gap-5">
          <button title="Take a photo"
          className="rounded-full p-2 flex items-center justify-center h-[80px] w-[80px] bg-white cursor-pointer
          shadow-xl shadow-black/50
          hover:bg-black duration-200 transition"
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
          onMouseEnter={() => setHovered('photo-library')} onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <PhotoLibraryIcon
               fontSize="large"
               className={`duration-200 ${hovered === 'photo-library' ? 'text-pink-500 scale-115' : 'text-black'} !transition`} />
            </span>
          </button>
          <button title="Automatic Screenshots" 
          className="rounded-full p-2 flex items-center justify-center h-[80px] w-[80px] bg-white cursor-pointer
          shadow-lg shadow-black/50
          hover:bg-black duration-200 transition"
          onMouseEnter={() => setHovered('linked-camera')} onMouseLeave={() => setHovered(null)}>
            <span className="flex items-center justify-center h-[60px] w-[60px] border-2 border-gray-300 rounded-full">
              <LinkedCameraIcon
                fontSize="large"
                className={`duration-200 ${hovered === 'linked-camera' ? 'text-pink-500 scale-115' : 'text-black'} !transition`}
              />
            </span>
          </button>
        </div>

        {summary ? (
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg mt-10">
            <h1>Summary:</h1>
            <p className="text-lg font-semibold text-gray-800">{summary}</p>
          </div>
        ) : <h1 className="text-xl font-semibold italic underline 
          bg-gradient-to-r from-orange-500 to-pink-500 
          bg-clip-text text-transparent 
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] 
          tracking-wide">
            Add a photo to see results!
          </h1>}

      </section>

    </div>
  )
}

export default App
