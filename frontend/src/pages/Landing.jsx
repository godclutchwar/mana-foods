import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Coffee, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="w-full bg-forest-950 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gold-500/5 mandala-bg opacity-30 animate-spin-slow"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 py-32 text-center">
          <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full mb-10 animate-fade-in-slow">
            <Star className="w-4 h-4 text-gold-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-400">Pure. Authentic. Home Made.</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif font-black gold-text-gradient mb-8 drop-shadow-2xl leading-none">
            MANA <br/><span className="text-white">TRADITION</span>
          </h1>
          <p className="mt-8 text-xl md:text-3xl text-emerald-100/60 max-w-3xl mx-auto font-light leading-relaxed italic animate-slide-up">
            "These products really feels an authentic home made and this tastes good and feels good."
          </p>
          <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/home" className="inline-flex items-center px-12 py-5 border border-gold-500/30 text-lg font-black rounded-2xl text-forest-950 bg-gold-500 hover:bg-gold-400 transition-all transform hover:-translate-y-2 shadow-[0_20px_50px_rgba(212,175,55,0.2)] uppercase tracking-widest">
              Explore Our Kitchen
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-gold-500 tracking-[0.5em] uppercase mb-4">Our Essence</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-black text-white">Three Pillars of Purity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Heart, title: "Homemade Sweets", desc: "Melt-in-your-mouth Pootharekulu, soft Laddus, and traditional Ariselu. Made with pure ghee and love." },
              { icon: Coffee, title: "Artisanal Savouries", desc: "Crunchy Jantikalu, spicy Karam Boondi, and Murukulu that make perfectly crisp evening snacks." },
              { icon: Leaf, title: "Heritage Pickles", desc: "Spicy Mango Avakai, rich Gongura, and aromatic Podulu ground in traditional stone mortars." }
            ].map((pillar, i) => (
              <div key={i} className="premium-card p-12 group hover:bg-forest-900/60">
                <div className="w-20 h-20 bg-forest-950 border border-gold-500/10 rounded-3xl flex items-center justify-center mb-10 text-gold-500 group-hover:scale-110 transition-transform shadow-2xl">
                  <pillar.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 font-serif uppercase tracking-tight">{pillar.title}</h3>
                <p className="text-emerald-100/40 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

