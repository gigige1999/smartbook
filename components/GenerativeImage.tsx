
import React, { useState, useEffect, useRef } from 'react';
import { generateImage, editImage, saveCustomImage, checkImageCache, STYLES } from '../services/geminiService';
import { Wand2, RefreshCw, Pencil, Loader2, Download, Upload } from 'lucide-react';

interface GenerativeImageProps {
  initialPrompt: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-video"
  stylePreset?: keyof typeof STYLES;
}

export const GenerativeImage: React.FC<GenerativeImageProps> = ({ 
    initialPrompt, 
    alt, 
    className = "", 
    aspectRatio = "aspect-square",
    stylePreset = 'RUSTY_LAKE'
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Track generation ID to prevent race conditions with uploads
  const generationIdRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Check cache on mount - this ensures cross-refresh persistence
    const loadFromCache = async () => {
      try {
        // Fix: Explicitly cast stylePreset to the expected union type to resolve string assignment error.
        const cached = await checkImageCache(initialPrompt, stylePreset as keyof typeof STYLES);
        if (isMounted && cached) {
          setImageUrl(cached);
        }
      } catch (e) {
        console.error("Failed to check cache", e);
      }
    };
    
    if (!imageUrl) {
        loadFromCache();
    }
    
    return () => { isMounted = false; };
  }, [initialPrompt, stylePreset]);

  const handleGenerate = async () => {
    const currentId = Date.now();
    generationIdRef.current = currentId;

    setLoading(true);
    setError(null);
    try {
      // Fix: Explicitly cast stylePreset to the expected union type to resolve string assignment error.
      const url = await generateImage(initialPrompt, stylePreset as keyof typeof STYLES);
      if (generationIdRef.current === currentId) {
          setImageUrl(url);
      }
    } catch (e) {
      if (generationIdRef.current === currentId) {
          setError("Failed to conjure image.");
          console.error(e);
      }
    } finally {
      if (generationIdRef.current === currentId) {
          setLoading(false);
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !editPrompt.trim()) return;
    
    const currentId = Date.now();
    generationIdRef.current = currentId;

    setLoading(true);
    setError(null);
    try {
      // Fix: Explicitly cast stylePreset to the expected union type to resolve string assignment error.
      const url = await editImage(imageUrl, editPrompt, stylePreset as keyof typeof STYLES);
      if (generationIdRef.current === currentId) {
        setImageUrl(url);
        setIsEditing(false);
        setEditPrompt("");
      }
    } catch (e) {
      if (generationIdRef.current === currentId) {
        setError("The spirits refused to change the image.");
        console.error(e);
      }
    } finally {
      if (generationIdRef.current === currentId) {
        setLoading(false);
      }
    }
  };

  const handleDownloadJpg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    
    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#e3dcd2'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            
            const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
            
            const link = document.createElement('a');
            link.href = jpgUrl;
            link.download = `${alt.replace(/\s+/g, '_').toLowerCase()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const currentId = Date.now();
    generationIdRef.current = currentId;

    setLoading(true);
    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            if (generationIdRef.current !== currentId) return;
            const base64 = reader.result as string;
            setImageUrl(base64);
            // Fix: Explicitly cast stylePreset to the expected union type to resolve string assignment error.
            await saveCustomImage(initialPrompt, base64, stylePreset as keyof typeof STYLES);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    } catch (err) {
        console.error("Failed to upload image", err);
        if (generationIdRef.current === currentId) {
            setError("Failed to accept offering.");
            setLoading(false);
        }
    }
  };

  return (
    <div className={`relative group ${className} ${aspectRatio} bg-transparent overflow-hidden shadow-lg`}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#e3dcd2] z-20 opacity-95 transition-opacity p-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#5c4d3c] mb-4" />
            <span className="font-hand text-[#5c4d3c] mb-4 text-center text-sm">Conjuring...</span>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick(e);
                }}
                className="flex items-center gap-2 bg-[#2c241b] text-[#e3dcd2] px-3 py-1.5 rounded-sm text-xs font-mono hover:bg-[#4a3b2a] transition-colors shadow-md z-30 pointer-events-auto"
            >
                <Upload size={14} />
                <span>Upload Instead</span>
            </button>
        </div>
      )}

      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
      ) : (
        !loading && (
            <div 
                className="w-full h-full flex flex-col items-center justify-center text-[#5c4d3c] p-4 text-center border-4 border-dashed border-[#5c4d3c]/30 cursor-pointer hover:bg-[#5c4d3c]/5 transition-colors"
                onClick={handleGenerate}
            >
                <span className="font-hand text-sm opacity-50 mb-2">{alt}</span>
                {error && <span className="text-red-800 font-bold text-xs mb-2 block">{error}</span>}
                <div className="flex gap-2 mt-1">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleGenerate(); }} 
                        className="p-2 border-2 border-[#5c4d3c] hover:bg-[#5c4d3c] hover:text-[#e3dcd2] transition-colors"
                        title="Conjure Image"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button 
                        onClick={handleUploadClick} 
                        className="p-2 border-2 border-[#5c4d3c] hover:bg-[#5c4d3c] hover:text-[#e3dcd2] transition-colors"
                        title="Upload your own"
                    >
                        <Upload size={16} />
                    </button>
                </div>
                <p className="mt-3 text-[10px] font-mono uppercase opacity-40">Click to Conjure</p>
            </div>
        )
      )}

      {/* Controls Overlay */}
      {imageUrl && !isEditing && (
        <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          {/* Refresh/Regenerate button for existing images */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
            className="bg-[#2c241b] text-[#e3dcd2] p-2 rounded-full hover:bg-[#4a3b2a] border border-[#d6cfc4] shadow-md"
            title="Regenerate Image"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={handleUploadClick}
            className="bg-[#2c241b] text-[#e3dcd2] p-2 rounded-full hover:bg-[#4a3b2a] border border-[#d6cfc4] shadow-md"
            title="Replace with Local Image"
          >
            <Upload size={16} />
          </button>
          <button 
            onClick={handleDownloadJpg}
            className="bg-[#2c241b] text-[#e3dcd2] p-2 rounded-full hover:bg-[#4a3b2a] border border-[#d6cfc4] shadow-md"
            title="Download as JPG"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[#2c241b] text-[#e3dcd2] p-2 rounded-full hover:bg-[#4a3b2a] border border-[#d6cfc4] shadow-md"
            title="Edit with Magic"
          >
            <Pencil size={16} />
          </button>
        </div>
      )}

      {/* Edit Mode Overlay */}
      {isEditing && (
        <div className="absolute inset-x-0 bottom-0 bg-[#2c241b]/95 p-3 animate-in slide-in-from-bottom-10 z-20">
          <form onSubmit={handleEdit} className="flex flex-col gap-2">
            <label className="text-[#e3dcd2] text-xs font-hand">What should change?</label>
            <div className="flex gap-2">
                <input 
                type="text" 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g. Make it redder..."
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
