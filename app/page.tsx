// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 1. Periksa apakah JWT Token ada di penyimpanan lokal
    const token = localStorage.getItem('token');
    
    if (!token) {
      // 2. Jika tidak ada token, arahkan paksa ke halaman login
      router.push('/login');
    } else {
      // 3. Jika ada token, arahkan ke halaman setup proyek
      router.push('/project-setup');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="text-center">
        {/* Spinner loading sederhana */}
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 font-medium animate-pulse">
          Memeriksa status masuk...
        </p>
      </div>
    </div>
  );
}