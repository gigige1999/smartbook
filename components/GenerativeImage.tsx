import React, { useState, useEffect, useRef } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import { Wand2, RefreshCw, Pencil, Loader2 } from 'lucide-react';

interface GenerativeImageProps {
  initialPrompt: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-video"
}

export const GenerativeImage: React.FC<GenerativeImageProps> = ({ initialPrompt, alt, className = "", aspectRatio = "aspect-square" }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const generatedRef = useRef(false);

  useEffect(() => {
    // Generate initial image only once
    if (!generatedRef.current && !imageUrl) {
      generatedRef.current = true;
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generateImage(initialPrompt);
      setImageUrl(url);
    } catch (e) {
      setError("Failed to conjure image.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !editPrompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const url = await editImage(imageUrl, editPrompt);
      setImageUrl(url);
      setIsEditing(false);
      setEditPrompt("");
    } catch (e) {
      setError("The spirits refused to change the image.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative group ${className} ${aspectRatio} bg-[#d4cbb8] border-4 border-[#2c241b] overflow-hidden shadow-lg`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e3dcd2] z-10 opacity-90">
            <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#5c4d3c] mb-2" />
                <span className="font-hand text-[#5c4d3c]">Conjuring...</span>
            </div>
        </div>
      )}

      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-cover sepia contrast-125 hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
      ) : (
        !loading && (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#5c4d3c] p-4 text-center">
                <span className="font-hand text-sm opacity-50">{alt}</span>
                {error && <span className="text-red-800 font-bold text-xs mt-2">{error}</span>}
                <button 
                    onClick={handleGenerate} 
                    className="mt-2 p-2 border-2 border-[#5c4d3c] hover:bg-[#5c4d3c] hover:text-[#e3dcd2] transition-colors"
                >
                    <RefreshCw size={16} />
                </button>
            </div>
        )
      )}

      {/* Controls Overlay */}
      {imageUrl && !isEditing && (
        <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[#2c241b] text-[#e3dcd2] p-2 rounded-full hover:bg-[#4a3b2a] border border-[#d6cfc4]"
            title="Edit with Magic"
          >
            <Pencil size={16} />
          </button>
        </div>
      )}

      {/* Edit Mode Overlay */}
      {isEditing && (
        <div className="absolute inset-x-0 bottom-0 bg-[#2c241b]/95 p-3 animate-in slide-in-from-bottom-10">
          <form onSubmit={handleEdit} className="flex flex-col gap-2">
            <label className="text-[#e3dcd2] text-xs font-hand">What should change?</label>
            <div className="flex gap-2">
                <input 
                type="text" 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g. Add a butterfly..."
                className="flex-1 bg-[#e3dcd2] text-[#2c241b] px-2 py-1 text-sm font-mono border-none focus:ring-1 focus:ring-[#d6cfc4] outline-none"
                autoFocus
                />
                <button 
                type="submit" 
                disabled={!editPrompt.trim()}
                className="bg-[#d6cfc4] text-[#2c241b] p-1.5 hover:bg-white disabled:opacity-50"
                >
                <Wand2 size={16} />
                </button>
            </div>
            <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="text-[#d6cfc4] text-xs hover:underline self-start"
            >
                Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
