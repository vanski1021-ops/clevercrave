import Link from "next/link";

export default function TestEnvPage() {
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">🔧 Environment Test</h1>
          
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-bold mb-2">Gemini API Key Status:</p>
              {geminiKey ? (
                <div className="text-green-600 font-mono text-sm">
                  ✅ Loaded: {geminiKey.substring(0, 25)}...
                </div>
              ) : (
                <div className="text-red-600 font-mono text-sm">
                  ❌ Not loaded (undefined)
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              {geminiKey ? (
                <p className="text-green-700 font-bold">
                  ✅ SUCCESS! Environment variables are working!
                </p>
              ) : (
                <div>
                  <p className="text-red-700 font-bold mb-2">
                    ❌ Not working yet
                  </p>
                  <p className="text-sm text-gray-700">
                    1. Stop dev server (Ctrl+C)<br/>
                    2. Delete .next folder<br/>
                    3. Run: npm run dev<br/>
                    4. Refresh this page
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <Link href="/" className="text-orange-500 underline mt-6 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }