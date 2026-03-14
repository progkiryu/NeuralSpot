
import { useRef, useState } from 'react';
import WebcamCapture from './WebcamCapture';

const STROKE_FACTS = [
  "Sudden numbness or weakness in the face, arm, or leg, especially on one side of the body.",
  "Sudden confusion, trouble speaking, or understanding speech.",
  "Sudden trouble seeing in one or both eyes.",
  "Sudden trouble walking, dizziness, loss of balance or coordination.",
  "Sudden severe headache with no known cause."
];

function App() {
  // Minimal state for demo
  const [summary, setSummary] = useState<string | null>(null);

  return (
    <div className="w-screen h-screen bg-neutral-900 flex flex-col items-center justify-center overflow-hidden select-none">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight text-center drop-shadow-lg">
        Detect strokes. Make split-decisions.
      </h1>
      <div className="relative flex items-center justify-center w-full max-w-6xl h-[60vh] px-2">
        {/* Stroke facts as bullet points with dividers - left */}
        <ul className="absolute left-0 top-1/2 -translate-y-1/2 w-72 max-w-xs text-right pr-6 hidden md:flex flex-col items-end gap-0.5">
          {STROKE_FACTS.slice(0,3).map((fact, idx) => (
            <li key={idx} className="w-full">
              <div className="flex items-center gap-2 w-full">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-500/60 mr-2"></span>
                <span className="text-sm text-gray-300 font-medium animate-fade-in" style={{animationDelay: `${0.1 + idx * 0.1}s`}}>{fact}</span>
              </div>
              {idx < 2 && <div className="w-5/6 ml-auto border-t border-gray-600/30 my-2" />}
            </li>
          ))}
        </ul>
        {/* Stroke facts as bullet points with dividers - right */}
        <ul className="absolute right-0 top-1/2 -translate-y-1/2 w-72 max-w-xs text-left pl-6 hidden md:flex flex-col items-start gap-0.5">
          {STROKE_FACTS.slice(3).map((fact, idx) => (
            <li key={idx} className="w-full">
              <div className="flex items-center gap-2 w-full">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-500/60 mr-2"></span>
                <span className="text-sm text-gray-300 font-medium animate-fade-in" style={{animationDelay: `${0.4 + idx * 0.1}s`}}>{fact}</span>
              </div>
              {idx < STROKE_FACTS.slice(3).length - 1 && <div className="w-5/6 border-t border-gray-600/30 my-2" />}
            </li>
          ))}
        </ul>
        {/* Camera section */}
        <div className="z-10 bg-neutral-800 rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-center border border-neutral-700">
          <WebcamCapture />
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
