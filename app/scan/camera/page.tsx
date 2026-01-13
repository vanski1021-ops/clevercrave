'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useUserStore, CREDIT_COSTS } from '@/stores/userStore'
// ✅ IMPORT THE SERVER ACTION
import { detectIngredientsAction } from '@/app/actions/detectIngredients' 
import OutOfCreditsModal from '@/components/OutOfCreditsModal'

export default function CameraPage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const credits = useUserStore(state => state.credits)
  const deductCredits = useUserStore(state => state.deductCredits)
  const incrementScanned = useUserStore(state => state.incrementScanned)

  // Initialize camera on mount
  useEffect(() => {
    let isMounted = true; // Track if component is still active

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        // If component unmounted while asking for camera, stop immediately
        if (!isMounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // ✅ FIX: Handle the play() promise specifically
          await videoRef.current.play().catch((err) => {
            if (err.name === 'AbortError') {
              // Ignore AbortError - this happens when toggling cameras or fast remounts
              console.log('Camera play aborted (harmless)');
            } else {
              console.error('Video play error:', err);
            }
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error('Camera error:', err);
          setError('Camera access denied. Please check permissions.');
        }
      }
    };

    initCamera();

    // Cleanup function
    return () => {
      isMounted = false;
      stopCamera(); // Make sure your stopCamera uses the current stream state or refs
    };
  }, []); // Empty dependency array

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    // Clear the video source to allow new loads
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Handle the play() promise specifically
        await videoRef.current.play().catch((err) => {
          if (err.name === 'AbortError') {
            // Ignore AbortError - this happens when toggling cameras or fast remounts
            console.log('Camera play aborted (harmless)');
          } else {
            console.error('Video play error:', err);
          }
        });
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied. Please check permissions.');
    }
  }

  const handleCapture = async () => {
    if (!deductCredits(CREDIT_COSTS.SCAN)) {
      setShowCreditsModal(true)
      return
    }
    
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return
    
    // Draw current frame to canvas
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(video, 0, 0)
    
    // Get raw base64 string (clean it for the API)
    const base64Data = canvas.toDataURL('image/jpeg', 0.8)
    const base64String = base64Data.split(',')[1] // Remove "data:image/jpeg;base64,"
    
    stopCamera()
    setIsAnalyzing(true)
    
    try {
      // ✅ CALL SERVER ACTION
      const result = await detectIngredientsAction(base64String)
      
      if (!result.success || !result.data) {
        throw new Error(result.error || "Analysis failed")
      }
      
      incrementScanned()
      
      // Store in localStorage for the Review Page
      localStorage.setItem('detectedItems', JSON.stringify(result.data))
      
      router.push('/scan/review')
      
    } catch (error) {
      console.error('Detection error:', error)
      setError('Failed to analyze image. Please try again.')
      setIsAnalyzing(false)
      
      // Refund credits on error
      useUserStore.getState().addCredits(CREDIT_COSTS.SCAN)
      startCamera()
    }
  }

  // Analyzing state
  if (isAnalyzing) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Analyzing...</h3>
          <p className="text-gray-400 font-medium">Identifying your ingredients</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md p-4 flex justify-between items-center">
        <Link
          href="/scan"
          className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        
        <div className="text-white text-sm font-medium">Position items in frame</div>
        
        <div className="w-10 h-10"></div>
      </div>

      {/* Video preview */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-6xl mb-4">📸</span>
            <p className="text-white text-lg mb-2">Camera Error</p>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null)
                startCamera()
              }}
              className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Camera frame overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-md aspect-[4/3] border-4 border-white/30 rounded-3xl backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-sm font-bold text-center">
                  Position ingredients here
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Capture button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
        <button
          onClick={handleCapture}
          disabled={!!error || credits < CREDIT_COSTS.SCAN}
          className="w-20 h-20 bg-white border-4 border-gray-600 rounded-full shadow-2xl active:scale-90 transition-transform flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
        </button>
        
        <div className="bg-gray-900/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full">
          Cost: 🪙 {CREDIT_COSTS.SCAN}
        </div>
      </div>

      {/* Out of credits modal */}
      <OutOfCreditsModal 
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        action="scan"
      />
    </div>
  )
}
