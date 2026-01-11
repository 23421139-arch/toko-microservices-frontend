'use client';

import { motion } from 'framer-motion';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  // Data Dummy untuk visualisasi
  const stats = [
    { title: 'Total Produk', value: '120', icon: Package, color: 'bg-blue-500' },
    { title: 'Total Pendapatan', value: 'Rp 45.2Jt', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Pelanggan', value: '3,400', icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400">Selamat datang kembali, Admin!</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">+2.5%</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder Chart Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg min-h-[300px] flex items-center justify-center flex-col text-gray-500"
      >
        <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
        <p>Area Grafik Statistik (Akan Datang)</p>
      </motion.div>
    </div>
  );
}