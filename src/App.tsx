/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Gamepad2, 
  User, 
  Wallet, 
  ChevronRight, 
  Star, 
  Flame, 
  Clock,
  Search,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Dices,
  Spade,
  Club,
  Heart,
  Diamond
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const CATEGORIES = [
  { id: 'all', name: 'Semua Game', icon: Gamepad2 },
  { id: 'slots', name: 'Slots', icon: Dices },
  { id: 'live', name: 'Live Casino', icon: User },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'poker', name: 'Poker', icon: Spade },
];

const PROMOTIONS = [
  { id: 1, title: 'Welcome Bonus 100%', desc: 'Deposit pertama & dapatkan bonus melimpah!', color: 'from-red-600 to-red-900' },
  { id: 2, title: 'Daily Cashback 5%', desc: 'Kekalahan bukan akhir, kami kembalikan modalmu.', color: 'from-gold-600 to-gold-900' },
  { id: 3, title: 'VIP Tournament', desc: 'Total hadiah Rp 1.000.000.000 menantimu!', color: 'from-purple-600 to-purple-900' },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [balance, setBalance] = useState(1500000);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [usedUsername, setUsedUsername] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      if (data.status === 'success') {
        setProviders(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch providers", err);
    } finally {
      setLoading(false);
    }
  };

  const launchGame = async (game: any) => {
    setSelectedGame(game);
    setIsLaunching(true);
    setGameUrl(null);
    setUsedUsername(null);

    try {
      const res = await fetch('/api/get-game-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id || "874c49d5d915de9b82f66088f9794789" })
      });
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        setGameUrl(data.data);
        setUsedUsername(data.usedUsername);
      } else {
        const errorMsg = data.message || data.error || "Gagal memuat game.";
        alert(`${errorMsg} Silakan coba lagi nanti.`);
        setSelectedGame(null);
      }
    } catch (err) {
      console.error("Launch error", err);
      alert("Terjadi kesalahan saat meluncurkan game.");
      setSelectedGame(null);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-casino-black/90 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-gold-400 to-gold-700 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20">
                <Trophy className="text-casino-black w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold gold-text tracking-tighter">NAGAMAS</h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-gold-400",
                    activeCategory === cat.id ? "text-gold-500" : "text-gray-400"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
              <Wallet className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-bold text-gold-100">
                Rp {balance.toLocaleString('id-ID')}
              </span>
              <button className="bg-gold-600 hover:bg-gold-500 text-casino-black text-[10px] font-black px-2 py-0.5 rounded-sm transition-colors">
                DEPOSIT
              </button>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-xs font-medium text-gray-300">VIP Naga</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-12">
        
        {/* Hero Slider */}
        <section className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-casino-black via-transparent to-transparent z-10" />
          <img 
            src="https://picsum.photos/seed/casino-gold/1920/1080" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-16 max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-gold-600/20 border border-gold-500/30 px-3 py-1 rounded-full"
            >
              <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Premium Experience</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black leading-tight"
            >
              KEBERUNTUNGAN <br /> 
              <span className="gold-text">MENANTI ANDA</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-md"
            >
              Mainkan ratusan game slot & live casino terbaik dari provider ternama dunia.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <button className="bg-gold-600 hover:bg-gold-500 text-casino-black font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-gold-600/20">
                Main Sekarang
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-8 py-3 rounded-xl transition-all">
                Lihat Promo
              </button>
            </motion.div>
          </div>
        </section>

        {/* Stats / Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Jackpot', value: 'Rp 12.450.000.000', icon: Trophy },
            { label: 'Pemain Online', value: '45.201', icon: User },
            { label: 'Game Tersedia', value: '1.500+', icon: Gamepad2 },
            { label: 'Win Rate', value: '98.5%', icon: Flame },
          ].map((stat, i) => (
            <div key={i} className="casino-card p-4 flex flex-col items-center text-center space-y-1">
              <stat.icon className="w-5 h-5 text-gold-500 mb-2" />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
              <span className="text-lg font-black text-gold-100">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Providers Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gold-600 rounded-full" />
              <h3 className="text-2xl font-black uppercase tracking-tight">Provider Game</h3>
            </div>
            <button className="text-sm font-bold text-gold-500 flex items-center gap-1 hover:underline">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
              ))
            ) : (
              providers.map((provider, i) => (
                <motion.div
                  key={provider.provider_name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="casino-card group cursor-pointer"
                >
                  <div className="aspect-video bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
                    <span className="text-sm font-black text-gray-400 group-hover:text-gold-400 transition-colors uppercase text-center">
                      {provider.provider_name}
                    </span>
                  </div>
                  <div className="p-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Provider</span>
                    <div className="flex gap-0.5">
                      <Star className="w-2 h-2 text-gold-500 fill-gold-500" />
                      <Star className="w-2 h-2 text-gold-500 fill-gold-500" />
                      <Star className="w-2 h-2 text-gold-500 fill-gold-500" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Featured Games */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-red-600 rounded-full" />
              <h3 className="text-2xl font-black uppercase tracking-tight">Game Populer</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { id: '874c49d5d915de9b82f66088f9794789', name: 'Gates of Olympus', provider: 'Pragmatic Play', img: 'https://picsum.photos/seed/zeus/400/500' },
              { id: 'mahjong-ways-2-id', name: 'Mahjong Ways 2', provider: 'PG Soft', img: 'https://picsum.photos/seed/mahjong/400/500' },
              { id: 'sweet-bonanza-id', name: 'Sweet Bonanza', provider: 'Pragmatic Play', img: 'https://picsum.photos/seed/candy/400/500' },
              { id: 'starlight-princess-id', name: 'Starlight Princess', provider: 'Pragmatic Play', img: 'https://picsum.photos/seed/anime/400/500' },
            ].map((game, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="casino-card group cursor-pointer"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={game.img} 
                    alt={game.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-casino-black via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 bg-red-600 text-[10px] font-black px-2 py-1 rounded-sm shadow-lg">
                    HOT
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-casino-black/40 backdrop-blur-[2px]">
                    <button 
                      onClick={() => launchGame(game)}
                      className="bg-gold-600 text-casino-black font-black px-6 py-2 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
                    >
                      PLAY NOW
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-gold-100 truncate">{game.name}</h4>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{game.provider}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Game Modal */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-casino-black/95 backdrop-blur-xl p-4 md:p-8"
            >
              <div className="w-full h-full max-w-6xl bg-casino-dark rounded-3xl border border-white/10 overflow-hidden flex flex-col relative">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-casino-black/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden">
                      <img src={selectedGame.img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black text-gold-100 uppercase tracking-tight">{selectedGame.name}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {selectedGame.provider} {usedUsername && `• User ID: ${usedUsername}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {gameUrl && (
                      <a 
                        href={gameUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                      >
                        BUKA DI TAB BARU
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedGame(null);
                        setGameUrl(null);
                      }}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-black relative">
                  {isLaunching ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                      <p className="text-gold-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Launching Game...</p>
                    </div>
                  ) : gameUrl ? (
                    <iframe 
                      src={gameUrl} 
                      className="w-full h-full border-none"
                      allow="autoplay; fullscreen"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-red-500 font-bold">Gagal memuat game.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promotions */}
        <section className="grid md:grid-cols-3 gap-6">
          {PROMOTIONS.map((promo) => (
            <div 
              key={promo.id}
              className={cn(
                "p-8 rounded-3xl bg-linear-to-br flex flex-col justify-between h-[200px] border border-white/10 relative overflow-hidden group",
                promo.color
              )}
            >
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="space-y-2 relative z-10">
                <h4 className="text-2xl font-black leading-tight">{promo.title}</h4>
                <p className="text-white/70 text-sm font-medium">{promo.desc}</p>
              </div>
              <button className="self-start bg-white text-casino-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-gold-400 transition-colors relative z-10">
                Klaim Sekarang
              </button>
            </div>
          ))}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-casino-black border-t border-white/5 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold-600 rounded-lg flex items-center justify-center">
                <Trophy className="text-casino-black w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold gold-text tracking-tighter">NAGAMAS</h1>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              NagaEmas adalah platform hiburan online terpercaya di Asia dengan lisensi resmi internasional. Kami menjamin keamanan data dan kecepatan transaksi.
            </p>
            <div className="flex gap-4">
              {[Spade, Club, Heart, Diamond].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-gold-500 transition-colors cursor-pointer">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold text-gold-400 uppercase tracking-widest text-xs">Menu Cepat</h5>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li className="hover:text-gold-500 cursor-pointer transition-colors">Tentang Kami</li>
              <li className="hover:text-gold-500 cursor-pointer transition-colors">Syarat & Ketentuan</li>
              <li className="hover:text-gold-500 cursor-pointer transition-colors">Kebijakan Privasi</li>
              <li className="hover:text-gold-500 cursor-pointer transition-colors">Pusat Bantuan</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold text-gold-400 uppercase tracking-widest text-xs">Metode Pembayaran</h5>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 bg-white/5 rounded-md border border-white/5" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold text-gold-400 uppercase tracking-widest text-xs">Lisensi Resmi</h5>
            <div className="flex flex-wrap gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center font-black text-[8px] text-gray-500">PAGCOR</div>
              <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center font-black text-[8px] text-gray-500">BMM</div>
              <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center font-black text-[8px] text-gray-500">GA</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          &copy; 2026 NAGAMAS CASINO. ALL RIGHTS RESERVED. 18+ RESPONSIBLE GAMING.
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-casino-black p-6 md:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-2xl font-bold gold-text tracking-tighter">NAGAMAS</h1>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="space-y-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 text-2xl font-black uppercase tracking-tight text-gray-400 hover:text-gold-500"
                >
                  <cat.icon className="w-6 h-6" />
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="absolute bottom-12 left-6 right-6 space-y-4">
              <button className="w-full bg-gold-600 text-casino-black font-black py-4 rounded-2xl">
                DEPOSIT SEKARANG
              </button>
              <button className="w-full bg-white/5 text-white font-black py-4 rounded-2xl border border-white/10">
                LOGOUT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

