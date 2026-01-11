'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar'; // Import Sidebar yang tadi dibuat

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // 🔒 Proteksi Halaman: Cek apakah user punya token?
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return null; // Atau bisa return loading spinner
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* Panggil Sidebar */}
      <Sidebar />
      
      {/* Area Konten Utama (di sebelah kanan Sidebar) */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}