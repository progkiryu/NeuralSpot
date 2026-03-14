
import { useRef, useState } from 'react';
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
  // Minimal state for demo
  const [summary, setSummary] = useState<string | null>(null);

  return (
    <div className="w-screen h-screen bg-neutral-900 flex flex-col items-center justify-center overflow-hidden select-none">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight text-center drop-shadow-lg">
        Detect strokes. Make split-decisions.
      </h1>
      <div className="relative flex items-center justify-between w-full max-w-screen-2xl h-[60vh] px-8">
        {/* Left facts column */}
        <div className="basis-[28%] flex justify-end pr-16">
          <ul className="w-80 max-w-sm hidden md:flex flex-col items-center gap-8 pt-8 pb-8">
            {STROKE_FACTS.slice(0, Math.ceil(STROKE_FACTS.length/2)).map((fact, idx, arr) => (
              <li key={idx} className="w-full flex flex-col items-center">
                <span className="text-2xl mb-1 opacity-70 select-none">{fact.icon}</span>
                <div className="w-full flex justify-center">
                  <span className="text-base text-gray-200 font-semibold text-center animate-fade-in" style={{animationDelay: `${0.1 + idx * 0.07}s`}}>{fact.text}</span>
                </div>
                {idx < arr.length - 1 && <div className="w-5/6 border-t border-gray-600/30 my-6" />}
              </li>
            ))}
          </ul>
        </div>
        {/* Camera section */}
        <div className="z-10 bg-neutral-800 rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-center border border-neutral-700 mx-32">
          <WebcamCapture />
        </div>
        {/* Right facts column */}
        <div className="basis-[28%] flex justify-start pl-16">
          <ul className="w-80 max-w-sm hidden md:flex flex-col items-center gap-8 pt-8 pb-8">
            {STROKE_FACTS.slice(Math.ceil(STROKE_FACTS.length/2)).map((fact, idx, arr) => (
              <li key={idx} className="w-full flex flex-col items-center">
                <span className="text-2xl mb-1 opacity-70 select-none">{fact.icon}</span>
                <div className="w-full flex justify-center">
                  <span className="text-base text-gray-200 font-semibold text-center animate-fade-in" style={{animationDelay: `${0.4 + idx * 0.07}s`}}>{fact.text}</span>
                </div>
                {idx < arr.length - 1 && <div className="w-5/6 border-t border-gray-600/30 my-6" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Summary or prompt */}
      <div className="mt-6">
        {summary ? (
          <div className="bg-neutral-800/80 backdrop-blur p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-pink-200 mb-2">Summary:</h2>
            <p className="text-base font-medium text-gray-200">{summary}</p>
          </div>
        ) : (
          <p className="text-base text-gray-400 italic text-center">
            Add a photo to see results!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
