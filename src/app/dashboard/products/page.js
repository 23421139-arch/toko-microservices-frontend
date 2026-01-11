"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Untuk dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "", // Penting!
  });

  // --- AMBIL URL DARI ENV (JANGAN DITULIS MANUAL) ---
  const API_PRODUCT = process.env.NEXT_PUBLIC_API_PRODUCT;
  const API_CATEGORY = process.env.NEXT_PUBLIC_API_CATEGORY;

  // --- 1. CEK LOGIN & AMBIL DATA AWAL ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProducts();
    fetchCategories();
  }, []);

  // --- 2. FUNGSI AMBIL PRODUK ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_PRODUCT}/products`); // Pake variabel ENV
      // Handle jika response dibungkus data lain
      const dataProduk = res.data.data || res.data; 
      setProducts(Array.isArray(dataProduk) ? dataProduk : []);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
      // Jangan set error di UI agar user tidak bingung kalau cuma data kosong
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FUNGSI AMBIL KATEGORI (Untuk Dropdown) ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_CATEGORY}/categories`); // Pake variabel ENV
      const dataKategori = res.data.data || res.data;
      setCategories(Array.isArray(dataKategori) ? dataKategori : []);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
  };

  // --- 4. HANDLE INPUT FORM ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 5. SUBMIT PRODUK BARU ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi Sederhana
    if (!formData.categoryId) {
      setError("Wajib pilih kategori!");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Siapkan payload (Convert angka)
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price), // Pastikan jadi angka
        stock: parseInt(formData.stock),     // Pastikan jadi angka
        description: formData.description,
        categoryId: formData.categoryId
      };

      console.log("Mengirim data ke:", `${API_PRODUCT}/products`); // Cek Console log ini nanti

      await axios.post(`${API_PRODUCT}/products`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Sukses
      alert("Produk berhasil disimpan!");
      setIsModalOpen(false);
      setFormData({ name: "", price: "", stock: "", description: "", categoryId: "" });
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error("Error submit:", err);
      setError(err.response?.data?.message || "Gagal menyimpan produk. Cek koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Tambah Produk
        </button>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 border border-red-500">
          {error}
        </div>
      )}

      {/* --- LIST PRODUK --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && <p>Loading...</p>}
        {!loading && products.length === 0 && <p className="text-gray-400">Belum ada produk.</p>}
        {products.map((product) => (
          <div key={product._id || product.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-400 text-sm">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-green-400 font-bold">Rp {product.price}</span>
              <span className="text-sm bg-gray-700 px-2 py-1 rounded">Stok: {product.stock}</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL TAMBAH PRODUK --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* KATEGORI */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kategori</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* NAMA */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nama Produk</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                  required
                />
              </div>

              {/* HARGA & STOK */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stok</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white h-24"
                ></textarea>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
                >
                  {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}