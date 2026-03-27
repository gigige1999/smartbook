import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, HardDrive, DownloadCloud, Languages } from 'lucide-react';
import { clearImageCache, getStorageUsage } from '../services/storageService';
import { useLanguage } from '../src/contexts/LanguageContext';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [usage, setUsage] = useState<string>('Calculating...');
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
        checkUsage();
    }
  }, [isOpen]);

  const checkUsage = async () => {
      const u = await getStorageUsage();
      setUsage(u);
  };

  const handleClear = async () => {
      if (confirm("Are you sure you want to burn all the cached manuscripts? This cannot be undone.")) {
          await clearImageCache();
          checkUsage();
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1a1510]/80 backdrop-blur-sm" onClick={onClose}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#e3dcd2] w-full max-w-md border-4 border-[#2c241b] shadow-2xl relative overflow-hidden paper-texture"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Header */}
             <div className="bg-[#2c241b] p-4 flex justify-between items-center">
                 <h2 className="text-[#e3dcd2] font-title text-xl">Settings & Storage</h2>
                 <button onClick={onClose} className="text-[#e3dcd2] hover:text-white">
                     <X size={24} />
                 </button>
             </div>

             <div className="p-6 space-y-8">
                 
                 <div className="space-y-4">
                     <div className="flex items-center gap-3 text-[#5c4d3c]">
                        <Languages size={24} />
                        <h3 className="font-hand font-bold text-lg">{t('语言设置', 'Language Settings')}</h3>
                     </div>
                     <div className="flex gap-2">
                         <button 
                            onClick={() => setLanguage(Language.ZH)}
                            className={`flex-1 p-2 border-2 font-mono text-sm transition-all ${language === Language.ZH ? 'bg-[#2c241b] text-[#e3dcd2] border-[#2c241b]' : 'bg-transparent text-[#2c241b] border-[#2c241b]/30 hover:border-[#2c241b]'}`}
                         >
                             中文 (ZH)
                         </button>
                         <button 
                            onClick={() => setLanguage(Language.EN)}
                            className={`flex-1 p-2 border-2 font-mono text-sm transition-all ${language === Language.EN ? 'bg-[#2c241b] text-[#e3dcd2] border-[#2c241b]' : 'bg-transparent text-[#2c241b] border-[#2c241b]/30 hover:border-[#2c241b]'}`}
                         >
                             English (EN)
                         </button>
                     </div>
                 </div>

                 <div className="space-y-4">
                     <div className="flex items-center gap-3 text-[#5c4d3c]">
                        <HardDrive size={24} />
                        <h3 className="font-hand font-bold text-lg">Local Storage</h3>
                     </div>
                     <p className="font-mono text-xs text-[#5c4d3c]/80 leading-relaxed">
                        All generated illustrations are automatically saved to your device's local database so they don't vanish into the ether when you leave.
                     </p>
                     
                     <div className="bg-[#d6cfc4] p-4 rounded-sm border border-[#8a7a5f] flex justify-between items-center">
                         <span className="font-mono text-sm">Current Usage:</span>
                         <span className="font-bold font-title text-lg text-[#2c241b]">{usage}</span>
                     </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#5c4d3c]">
                        <DownloadCloud size={24} />
                        <h3 className="font-hand font-bold text-lg">Actions</h3>
                     </div>
                     
                     <button 
                        onClick={handleClear}
                        className="w-full flex items-center justify-center gap-2 bg-[#8B0000] text-[#e3dcd2] p-3 rounded-sm hover:bg-[#600000] transition-colors shadow-md font-mono text-sm border border-[#2c241b]"
                     >
                         <Trash2 size={16} />
                         Burn All Manuscripts (Clear Cache)
                     </button>
                 </div>
             </div>

             {/* Footer decor */}
             <div className="p-2 bg-[#d6cfc4] border-t border-[#8a7a5f] text-center">
                 <span className="font-mono text-[10px] text-[#5c4d3c] opacity-50">Melquíades System v1.0</span>
             </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
