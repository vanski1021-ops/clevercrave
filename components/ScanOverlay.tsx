"use client";

import { useRouter } from "next/navigation";

interface ScanOverlayProps {
  onClose: () => void;
}

export default function ScanOverlay({ onClose }: ScanOverlayProps) {
  const router = useRouter();

  const handleManualClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    router.push("/scan/manual");
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    router.push("/scan/camera");
  };

  return (
    <>
      {/* Full-Screen Translucent Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md supports-[backdrop-filter]:bg-black/40 cursor-pointer"
      />

      {/* Floating Buttons - Lower Right Side */}
      <div className="fixed right-6 bottom-32 z-50 flex flex-col gap-6 items-end">
        {/* Camera Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCameraClick}
            className="bg-gray-900/80 backdrop-blur-md text-white uppercase font-black text-sm tracking-widest px-5 py-3 rounded-xl shadow-lg whitespace-nowrap"
          >
            SNAP GROCERIES
          </button>
          <button
            onClick={handleCameraClick}
            className="bg-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          >
            <span className="text-4xl">📸</span>
          </button>
        </div>

        {/* Manual Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleManualClick}
            className="bg-gray-900/80 backdrop-blur-md text-white uppercase font-black text-sm tracking-widest px-5 py-3 rounded-xl shadow-lg whitespace-nowrap"
          >
            MANUAL
          </button>
          <button
            onClick={handleManualClick}
            className="bg-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          >
            <span className="text-4xl">✏️</span>
          </button>
        </div>
      </div>
    </>
  );
}
