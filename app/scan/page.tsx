"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home - the scan overlay is now state-based
    router.replace("/");
  }, [router]);

  return (
    <div className="bg-[#FFF7ED] min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}
