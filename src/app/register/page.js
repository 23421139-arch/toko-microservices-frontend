'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link yang benar
import { Loader2, AlertCircle } from 'lucide-react'; // Pastikan install lucide-react

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Ambil URL dari env
  const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      console.log("Mencoba register ke:", `${API_AUTH}/register`);
      
      // Kirim data register
      await axios.post(`${API_AUTH}/register`, formData);
      
      alert("Registrasi Berhasil! Silakan Login.");
      router.push('/login');

    } catch (error) {
      console.error("Error Register:", error);
      
      // TANGKAP PESAN ERROR ASLI DARI SERVER
      // Biasanya server kasih pesan di error.response.data.message
      let pesan = "Terjadi kesalahan pada server.";
      
      if (error.response) {
        // Jika server merespon (4xx atau 5xx)
        pesan = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
      } else if (error.request) {
        // Jika server tidak merespon sama sekali (mati/network error)
        pesan = "Tidak dapat menghubungi server. Cek koneksi internet.";
      }

      setErrorMsg(pesan);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-lg shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-center mb-6">Bergabung untuk mengelola toko</p>

        {/* Kotak Error yang Lebih Jelas */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg mb-4 flex items-start gap-3">
            <AlertCircle className="text-red-400 w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-red-200 text-sm font-medium break-words w-full">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              placeholder="Jhon Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Login disini
          </Link>
        </p>
      </div>
    </div>
  );
}