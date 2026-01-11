'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Layers, X, Loader2, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pastikan URL tidak diakhiri slash '/'
  const API_URL = process.env.NEXT_PUBLIC_API_CATEGORY?.replace(/\/$/, '');

  const getAuthHeader = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return null;
      }
      return { headers: { Authorization: `Bearer ${token}` } };
    }
    return null;
  };

  // 1. GET Categories
  const fetchCategories = async () => {
    try {
      const config = getAuthHeader();
      if (!config) return;

      console.log("Fetching categories from:", `${API_URL}/categories`);
      const res = await axios.get(`${API_URL}/categories`, config);
      
      const data = res.data.data || res.data;
      setCategories(Array.isArray(data) ? data : []);
      setErrorMsg('');
    } catch (error) {
      console.error("Gagal ambil kategori:", error);
      if (error.response?.status === 401) {
        alert("Sesi habis, silakan login ulang (Token beda versi)");
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. CREATE Category
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const config = getAuthHeader();
      await axios.post(`${API_URL}/categories`, { name }, config);
      
      setIsModalOpen(false);
      setName('');
      fetchCategories(); 
      alert("✅ Kategori berhasil dibuat di server xi-dusky!");
    } catch (error) {
      console.error("Error Create:", error);
      const msg = error.response?.data?.message || error.message;
      setErrorMsg(`Gagal: ${msg}`);
      
      if(error.response?.status === 401) {
         alert("Token tidak valid untuk server ini. Silakan Logout dan Login lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE Category
  const handleDelete = async (id) => {
    if(!confirm("Hapus kategori ini?")) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`, getAuthHeader());
      setCategories(categories.filter(c => c._id !== id));
    } catch (error) {
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Kategori</h1>
          <p className="text-gray-400 text-sm">Server: {API_URL}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400"><Loader2 className="animate-spin" /></div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Data kosong di server xi-dusky. Silakan tambah baru.</p>
          </div>
        ) : (
          <table className="w-full text-left text-gray-300">
            <thead className="bg-black/20 text-gray-100 uppercase text-xs">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4 text-center">ID (Untuk Produk)</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-white/5">
                  <td className="p-4 font-medium text-white">{cat.name}</td>
                  <td className="p-4 text-center text-xs font-mono text-gray-500">{cat._id}</td>
                  <td className="p-4 flex justify-center">
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative bg-[#1e293b] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Buat Kategori Baru</h2>
              
              {errorMsg && (
                <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm flex gap-2 items-center">
                  <AlertCircle className="w-4 h-4" /> {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Nama Kategori</label>
                  <input 
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Contoh: Elektronik"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 rounded-lg text-white">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}