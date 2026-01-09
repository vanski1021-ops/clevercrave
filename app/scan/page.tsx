"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();

  const handleBarcodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Barcode scanner coming soon!");
  };

  const handleManualClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Manual entry coming soon!");
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/scan/camera");
  };

  return (
    <>
      {/* Full-Screen Translucent Overlay */}
      <Link
        href="/"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
      />

      {/* Floating Buttons - Right Side */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
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
            className="bg-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="text-4xl">📸</span>
          </button>
        </div>

        {/* Barcode Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBarcodeClick}
            className="bg-gray-900/80 backdrop-blur-md text-white uppercase font-black text-sm tracking-widest px-5 py-3 rounded-xl shadow-lg whitespace-nowrap"
          >
            BARCODE
          </button>
          <button
            onClick={handleBarcodeClick}
            className="bg-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="text-4xl">🏷️</span>
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
            className="bg-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="text-4xl">✏️</span>
          </button>
        </div>
      </div>
    </>
  );
}
