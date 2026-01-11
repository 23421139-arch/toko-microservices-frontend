'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Fitur Show/Hide
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH || "https://auth-service-theta-two.vercel.app";
      
      // --- PERBAIKAN DI SINI (Hapus /auth) ---
      // Dulu: `${API_AUTH}/auth/login`
      // Sekarang: `${API_AUTH}/login`
      const res = await axios.post(`${API_AUTH}/login`, form);
      
      // Simpan token
      localStorage.setItem('token', res.data.token);
      
      // Redirect Dashboard
      router.push('/dashboard');
    } catch (err) {
      // Ambil pesan error spesifik dari backend jika ada
      setError(err.response?.data?.message || 'Login gagal. Periksa kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container Utama: Flex Center untuk memposisikan Card tepat di tengah layar
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Efek Glow di belakang Card */}
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* CARD UTAMA (Glassmorphism) */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 overflow-hidden">
          
          {/* Header Card */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-tr from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Panel</h1>
            <p className="text-blue-200/80 text-sm mt-2 font-medium">Sistem Manajemen Toko Elektronik</p>
          </div>

          {/* Notifikasi Error */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-200 text-sm"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
            </motion.div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="admin@example.com"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            {/* Input Password dengan Toggle Show/Hide */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-400 transition-colors w-5 h-5" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Masuk Dashboard'}
            </motion.button>
          </form>

          {/* Footer Card */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Belum punya akun?{' '}
              <a href="/register" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline decoration-blue-400/30">
                Daftar Akun
              </a>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}