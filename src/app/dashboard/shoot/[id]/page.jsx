'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Heart, Star, MapPin, Phone, Mail, Instagram, Facebook, 
  Menu, X, ChevronRight, CheckCircle, ArrowRight, Sparkles, 
  Baby, Calendar, Clock, Image as ImageIcon, Play, Send, Plus, 
  Smile, Users, Video, ShieldCheck, Zap, Award, Timer
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* DATA CONSTANTS (Optimized for High-Ticket Sales)                           */
/* -------------------------------------------------------------------------- */

const SERVICES_DATA = [
  { id: 'maternity', title: 'Maternity', icon: <Heart className="text-pink-400" />, img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80', desc: 'Celebrate Motherhood' },
  { id: 'newborn', title: 'Newborn', icon: <Baby className="text-blue-400" />, img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80', desc: 'Capturing Precious First Moments' },
  { id: 'toddler', title: 'Toddler', icon: <Smile className="text-yellow-400" />, img: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80', desc: 'Cherishing Childhood Moments' },
  { id: 'event', title: 'Events', icon: <Calendar className="text-purple-400" />, img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80', desc: 'Corporate & Birthday Coverage' },
  { id: 'prewedding', title: 'Pre-Wedding', icon: <Users className="text-red-400" />, img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80', desc: 'Romantic Couple Portraits' }
];

const PACKAGES_DATA = {
  Maternity: {
    tiers: [
      {
        name: "Bronze",
        price: "₹6,999",
        duration: "1 Hour",
        features: ["Indoor Only", "15 Retouched Images", "All Raw Photos (JPG)", "1 Costume Allowed", "Gown Available (Optional)"],
        msg: "Basic Entry"
      },
      {
        name: "Silver",
        price: "₹9,999",
        duration: "2 Hr 45 Mins",
        features: ["Indoor & Outdoor", "25 Retouched Images", "All Raw Photos (JPG)", "2 Costumes Allowed", "Gown Available (Optional)", "30 Sec Reel Included"],
        popular: true,
        badge: "BEST SELLER"
      },
      {
        name: "Platinum",
        price: "₹19,999",
        duration: "4 Hr 30 Mins",
        features: ["Indoor & Outdoor", "45 Retouched Images", "3 Costumes Allowed", "1 Photo Frame (8x12)", "Basic Makeup Included", "Parent & Child Shoot Incl."],
        badge: "VIP EXPERIENCE"
      }
    ],
    addons: [
      { name: "Shoot With Parent", price: "₹999" },
      { name: "Shoot With Children", price: "₹999" },
      { name: "Basic Makeup & Hair", price: "₹4,999" },
      { name: "Gown Rental", price: "From ₹1,999" },
      { name: "Travel Charge", price: "₹1,999 (Bangalore)" }
    ]
  },
  Newborn: {
    tiers: [
      {
        name: "Little Star",
        price: "₹6,999",
        duration: "45 Mins",
        features: ["1 Theme", "10 Retouched Images", "All Raw Images", "30 Sec Reel"],
        msg: "Starter"
      },
      {
        name: "La Creame",
        price: "₹13,999",
        duration: "1 Hr 45 Mins",
        features: ["3 Themes", "20 Retouched Images", "All Raw Images", "8x12 Photo Frame", "2 Reels (30 Sec)"],
        popular: true,
        badge: "MOST POPULAR"
      },
      {
        name: "Royal Grand",
        price: "₹24,999",
        duration: "3 Hours",
        features: ["5 Setups", "30 Retouched (Baby)", "5 Retouched (Parents)", "8x8 Photo Album", "2 Reels (30-45 Sec)"],
        badge: "ALL INCLUSIVE"
      }
    ],
    addons: [
      { name: "With Parents/Siblings", price: "₹999" },
      { name: "Home Shoot (Within 18km)", price: "₹1,999" },
      { name: "Twins Extra Charge", price: "Contact Us" }
    ]
  },
  Toddler: {
    tiers: [
      {
        name: "Little Star",
        price: "₹6,999",
        duration: "45 Mins",
        features: ["1 Theme", "10 Retouched Images", "All Raw Images", "30 Sec Reel"]
      },
      {
        name: "Pearl",
        price: "₹9,999",
        duration: "1 Hr 15 Mins",
        features: ["2 Themes", "15 Retouched Images", "All Raw Images", "30 Sec Reel (Optional)"]
      }
    ],
    addons: [
      { name: "With Parents/Siblings", price: "₹999" },
      { name: "Home Shoot", price: "₹1,999" },
      { name: "Frames & Albums", price: "Available" }
    ]
  }
};

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80", category: "Maternity", size: "tall" },
  { src: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80", category: "Toddler", size: "short" },
  { src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80", category: "Newborn", size: "tall" },
  { src: "https://images.unsplash.com/photo-1544126566-47a32b904d16?auto=format&fit=crop&q=80", category: "Cake Smash", size: "short" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80", category: "Family", size: "tall" },
  { src: "https://images.unsplash.com/photo-1532712938310-34cb3958d42d?auto=format&fit=crop&q=80", category: "Maternity", size: "short" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", category: "Event", size: "tall" },
  { src: "https://images.unsplash.com/photo-1606822393282-598e27c0800b?auto=format&fit=crop&q=80", category: "Newborn", size: "short" },
];

/* -------------------------------------------------------------------------- */
/* STYLE UTILITIES                                                            */
/* -------------------------------------------------------------------------- */

const GlobalStyles = () => (
  <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 1rem)); }
    }
    .animate-scroll {
      animation: scroll 40s linear infinite;
    }
    .pause-on-hover:hover .animate-scroll {
      animation-play-state: paused;
    }
    .glass-panel {
      background: rgba(24, 24, 27, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    ::selection {
      background-color: #eab308;
      color: black;
    }
    .tab-active {
      background-color: #eab308;
      color: black;
      box-shadow: 0 0 20px rgba(234, 179, 8, 0.4);
    }
    .tab-inactive {
      background-color: rgba(255,255,255,0.05);
      color: #a1a1aa;
      border: 1px solid #27272a;
    }
    @keyframes pulse-gold {
      0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
      100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
    }
    .animate-pulse-gold {
      animation: pulse-gold 2s infinite;
    }
  `}</style>
);

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

const UrgencyBar = () => (
  <div className="bg-yellow-500 text-black py-2 px-4 text-center text-xs md:text-sm font-bold flex items-center justify-center gap-2 z-[60] relative">
    <Timer className="w-4 h-4 animate-pulse" />
    <span>LIMITED AVAILABILITY: Only 3 slots left for this weekend!</span>
    <span className="hidden md:inline border-l border-black/20 pl-2 ml-2">Book now to secure 2024 pricing.</span>
  </div>
);

const Navbar = ({ onBook }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenu(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`fixed top-8 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/95 backdrop-blur-md border-b border-white/10 py-3" : "bg-gradient-to-b from-black/80 to-transparent py-5"}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="bg-yellow-500 p-2 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.5)]">
              <Camera className="text-black w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none">RAIKA</span>
              <span className="text-[10px] text-yellow-500 tracking-[0.2em] font-bold uppercase">Studios</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Services', 'Packages', 'Gallery', 'Reviews'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={onBook}
              className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-xl"
            >
              Check Availability
            </button>
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="fixed inset-0 z-40 bg-zinc-950 pt-32 px-6 md:hidden animate-in slide-in-from-top-10 fade-in duration-200">
          <div className="flex flex-col gap-6 text-center">
            {['Services', 'Packages', 'Gallery', 'Reviews'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-2xl font-serif text-white/80 hover:text-yellow-500 transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => { onBook(); setMobileMenu(false); }}
              className="bg-yellow-500 text-black py-5 rounded-xl font-bold text-lg mt-8 shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-pulse-gold"
            >
              CLAIM YOUR SLOT
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Hero = ({ onBook }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
          alt="Studio Background" 
          className="w-full h-full object-cover opacity-50 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/50 backdrop-blur-md text-yellow-400 text-xs font-black uppercase tracking-widest mb-8 animate-in slide-in-from-left duration-700">
            <Award className="w-4 h-4" />
            Voted #1 Premium Maternity Studio
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[0.9] tracking-tight">
            Don't Let These <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-700 drop-shadow-2xl">
              Moments Fade.
            </span>
          </h1>
          
          <p className="text-zinc-300 text-lg md:text-2xl mb-12 max-w-xl leading-relaxed font-light border-l-4 border-yellow-500 pl-6">
            Your family's legacy deserves more than a smartphone selfie. Experience the <span className="text-white font-bold">Royal Grand Treatment</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onBook}
              className="bg-yellow-500 text-black px-10 py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-pulse-gold"
            >
              BOOK YOUR SESSION
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium px-4">
               <ShieldCheck className="text-green-500 w-5 h-5" />
               100% Satisfaction Guarantee
            </div>
          </div>
        </div>
      </div>
      
      {/* Social Proof Strip */}
      <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur border-t border-white/10 py-6 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
           <span className="text-lg font-serif italic text-white">Featured in:</span>
           <span className="text-xl font-bold text-white">VOGUE</span>
           <span className="text-xl font-bold text-white">WedMeGood</span>
           <span className="text-xl font-bold text-white">LBB</span>
           <div className="flex items-center gap-2">
             <div className="flex text-yellow-500"><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/></div>
             <span className="text-white font-bold">340+ 5-Star Reviews</span>
           </div>
        </div>
      </div>
    </section>
  );
};

const TrustBadges = () => (
  <section className="bg-zinc-900 border-y border-white/5 py-12">
    <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
       <div className="flex flex-col items-center gap-2">
         <ShieldCheck className="w-8 h-8 text-yellow-500" />
         <h4 className="text-white font-bold">Satisfaction Guarantee</h4>
         <p className="text-zinc-500 text-xs">Love your photos or we reshoot.</p>
       </div>
       <div className="flex flex-col items-center gap-2">
         <Sparkles className="w-8 h-8 text-yellow-500" />
         <h4 className="text-white font-bold">Sanitized Studio</h4>
         <p className="text-zinc-500 text-xs">Safe for newborns & moms.</p>
       </div>
       <div className="flex flex-col items-center gap-2">
         <ImageIcon className="w-8 h-8 text-yellow-500" />
         <h4 className="text-white font-bold">Fast Delivery</h4>
         <p className="text-zinc-500 text-xs">Edited photos in 7 days.</p>
       </div>
       <div className="flex flex-col items-center gap-2">
         <Award className="w-8 h-8 text-yellow-500" />
         <h4 className="text-white font-bold">Award Winning</h4>
         <p className="text-zinc-500 text-xs">Top rated in South India.</p>
       </div>
    </div>
  </section>
);

const InfiniteReviews = () => {
  const reviews = [
    { name: "Priya S.", text: "Worth every penny. The team treated us like royalty.", service: "Newborn" },
    { name: "Rahul M.", text: "I was hesitant about the price, but the results are priceless.", service: "Wedding" },
    { name: "Sneha K.", text: "The gowns were stunning. Felt like a celebrity.", service: "Maternity" },
    { name: "Ananya R.", text: "My toddler usually cries, but they made him laugh!", service: "Toddler" },
    { name: "Vikram J.", text: "Don't go to cheap studios. Go to Raika.", service: "Family" },
  ];

  return (
    <section id="reviews" className="py-20 bg-black overflow-hidden relative">
       <div className="absolute inset-0 bg-yellow-500/5 z-0" />
      <div className="container mx-auto px-4 mb-10 text-center relative z-10">
        <h2 className="text-3xl font-serif text-white mb-2">Join 1,500+ Happy Families</h2>
        <div className="flex justify-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
        </div>
      </div>

      <div className="relative w-full overflow-hidden z-10">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 z-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 z-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />

        <div className="flex gap-4 md:gap-8 w-max animate-scroll pause-on-hover px-4">
          {[...reviews, ...reviews, ...reviews].map((review, i) => (
            <div 
              key={i} 
              className="glass-panel w-[300px] md:w-[400px] p-8 rounded-none border-l-4 border-yellow-500 flex-shrink-0 select-none bg-zinc-900/80"
            >
              <div className="flex justify-between mb-4">
                 <div className="flex gap-1 text-yellow-500">
                   {[...Array(5)].map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                 </div>
                 <span className="text-xs font-bold bg-green-900/50 text-green-400 px-2 py-1 rounded">VERIFIED</span>
              </div>
              <p className="text-zinc-200 text-lg italic mb-6 leading-relaxed">"{review.text}"</p>
              <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">{review.service} Package</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-2">Experiences We Craft</h2>
                <p className="text-zinc-400">We don't take photos. We create art.</p>
            </div>
            <button className="hidden md:block text-yellow-500 font-bold hover:text-white transition-colors">View All Services &rarr;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          {SERVICES_DATA.map((s, i) => (
            <div key={i} className="group relative h-96 overflow-hidden cursor-pointer border border-zinc-800 hover:border-yellow-500/50 transition-colors">
              <img 
                src={s.img} 
                alt={s.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="text-yellow-500 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {s.title}
                </h3>
                <p className="text-zinc-400 text-sm transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. PSYCHOLOGICAL PRICING (The Revenue Engine)
const Pricing = ({ onBook }) => {
  const [activeTab, setActiveTab] = useState('Maternity');

  return (
    <section id="packages" className="py-24 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Invest In Your Legacy</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Cheap photos are expensive because you can't redo the moment. Choose quality.
          </p>
        </div>

        {/* High-End Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {Object.keys(PACKAGES_DATA).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab ? 'tab-active transform scale-105' : 'tab-inactive hover:bg-zinc-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pricing Cards - Designed to sell the middle/high tier */}
        <div className="flex flex-wrap justify-center  gap-4 mb-16 items-center">
          {PACKAGES_DATA[activeTab].tiers.map((pkg, idx) => {
             const isCheap = idx === 0;
             const isPremium = pkg.popular || pkg.name.includes("Gold") || pkg.name.includes("Platinum") || pkg.name.includes("Royal");
             
             return (
            <div 
              key={idx} 
              className={`relative flex flex-col transition-all duration-300 ${
                isPremium
                  ? 'bg-zinc-900 border-2 border-yellow-500 rounded-2xl p-8 z-10 shadow-[0_0_40px_rgba(234,179,8,0.15)] transform hover:-translate-y-2' 
                  : 'bg-zinc-950 border border-zinc-800 rounded-xl p-6 opacity-80 hover:opacity-100'
              }`}
              style={{ height: isPremium ? 'auto' : '90%' }}
            >
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">
                  {pkg.badge}
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`font-bold text-white mb-2 ${isPremium ? 'text-2xl font-serif' : 'text-lg text-zinc-400'}`}>{pkg.name}</h3>
                <div className={`font-serif ${isPremium ? 'text-4xl text-yellow-500' : 'text-2xl text-zinc-500'}`}>{pkg.price}</div>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-6 font-mono border-b border-white/5 pb-4">
                <Clock className="w-3 h-3" /> {pkg.duration}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    {isPremium ? <CheckCircle className="w-5 h-5 text-yellow-500 shrink-0" /> : <div className="w-5 h-5 rounded-full border border-zinc-700 shrink-0" />}
                    <span className={isPremium ? "text-zinc-200" : "text-zinc-500"}>{feat}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={onBook}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${
                  isPremium 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:shadow-lg hover:from-yellow-400 hover:to-yellow-500' 
                    : 'bg-transparent border border-zinc-700 text-zinc-400 hover:border-white hover:text-white'
                }`}
              >
                {isPremium ? "Select This Plan" : "Basic Selection"}
              </button>
            </div>
          )})}
        </div>

        {/* Up-sell Add-ons */}
        <div className="bg-zinc-900 border-l-4 border-yellow-500 p-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
                 <h3 className="text-xl font-bold text-white mb-2">Enhance Your Experience</h3>
                 <p className="text-zinc-400 text-sm">Add makeup, gowns, or family members to any package.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                 {PACKAGES_DATA[activeTab].addons.slice(0,4).map((addon, i) => (
                     <div key={i} className="bg-black/50 px-4 py-2 rounded border border-white/5 flex justify-between gap-4 text-xs">
                         <span className="text-zinc-300">{addon.name}</span>
                         <span className="text-yellow-500 font-bold">{addon.price}</span>
                     </div>
                 ))}
            </div>
        </div>
      </div>
    </section>
  );
};

// 6. Filterable Masonry Gallery
const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Maternity', 'Newborn', 'Toddler', 'Event', 'Family'];
  const filteredImages = filter === 'All' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <section id="gallery" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">The Portfolio</h2>
          <p className="text-zinc-400 mb-8">Real clients. Real moments. No stock photos.</p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === cat 
                    ? 'bg-white text-black' 
                    : 'bg-transparent text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredImages.map((img, idx) => (
            <div key={idx} className="break-inside-avoid relative group overflow-hidden cursor-pointer">
              <img 
                src={img.src} 
                alt={img.category} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                 <span className="text-white font-serif text-2xl italic mb-2">{img.category}</span>
                 <button className="text-yellow-500 text-xs font-bold uppercase tracking-widest border-b border-yellow-500 pb-1">Book This Look</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7. High-Conversion Contact Form
const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! We'll be in touch.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-900 skew-x-12 transform origin-top-right z-0 hidden lg:block" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
              Ready to <br/> <span className="text-yellow-500">Stop Time?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-md">
              Our calendar fills up 3-4 weeks in advance. Don't wait until it's too late to capture this milestone.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-yellow-500 flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                  <Phone className="w-5 h-5 text-white group-hover:text-black" />
                </div>
                <div>
                  <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Speak to a Human</h4>
                  <p className="text-white text-xl font-serif">+91 9738438497</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-white transition-colors">
                  <MapPin className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Visit The Studio</h4>
                  <p className="text-zinc-300">Jayanagar, Bangalore</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 p-10 shadow-2xl border-t-4 border-yellow-500 relative">
             <div className="absolute -top-6 -right-6 bg-white text-black w-24 h-24 rounded-full flex items-center justify-center font-black text-center text-xs p-2 transform rotate-12 shadow-lg z-20">
                FAST REPLY <br/> GUARANTEE
             </div>
            <h3 className="text-3xl font-serif text-white mb-2">Priority Booking</h3>
            <p className="text-zinc-500 mb-8 text-sm">Skip the queue. We reply within 30 mins.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Name</label>
                 <input type="text" className="w-full bg-black border-b border-zinc-800 text-white py-3 focus:outline-none focus:border-yellow-500 transition-colors" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Phone</label>
                 <input type="tel" className="w-full bg-black border-b border-zinc-800 text-white py-3 focus:outline-none focus:border-yellow-500 transition-colors" placeholder="+91..." />
              </div>
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 uppercase tracking-widest transition-all hover:shadow-lg flex justify-center items-center gap-2">
                Secure My Date <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

// 8. Lead Capture Modal (Exit Intent / Conversion)
const BookingModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Left Side - The Hook */}
        <div className="w-full md:w-1/2 bg-yellow-500 p-10 flex flex-col justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
           <div className="relative z-10">
               <h3 className="text-4xl font-serif font-bold text-black mb-4">Wait!</h3>
               <p className="text-black/80 font-medium text-lg mb-8">
                   We only open <span className="font-black">5 premium slots</span> per month to ensure quality. Don't risk losing your preferred date.
               </p>
               <ul className="space-y-2 text-black font-bold text-sm">
                   <li className="flex items-center gap-2"><CheckCircle size={16}/> Free Consultation</li>
                   <li className="flex items-center gap-2"><CheckCircle size={16}/> Gown Selection Access</li>
                   <li className="flex items-center gap-2"><CheckCircle size={16}/> Price Lock Guarantee</li>
               </ul>
           </div>
        </div>

        {/* Right Side - The Form */}
        <div className="w-full md:w-1/2 p-10 bg-zinc-950 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
            <X size={24} />
          </button>

          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">You're on the list!</h3>
              <p className="text-zinc-400 mb-8">We will call you shortly to confirm eligibility.</p>
              <button onClick={onClose} className="text-white hover:text-yellow-500 font-bold underline">Close</button>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">Check Availability</h3>
              <p className="text-zinc-500 text-sm mb-6">No payment required today.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required type="text" placeholder="Your Name" className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                <input required type="tel" placeholder="Phone Number" className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white focus:border-yellow-500 outline-none">
                  <option>Interested in Maternity...</option>
                  <option>Interested in Newborn...</option>
                  <option>Interested in Gold Package...</option>
                </select>
                
                <button 
                  disabled={status === 'submitting'}
                  className="w-full bg-white text-black font-bold py-4 hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 mt-4"
                >
                  {status === 'submitting' ? 'Checking...' : 'Check Dates Now'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN APP COMPONENT                                                         */
/* -------------------------------------------------------------------------- */

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Aggressive Pop-up Trigger (10 seconds)
    const timer = setTimeout(() => {
      if (!modalOpen) setModalOpen(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black min-h-screen text-slate-200 font-sans w-full overflow-x-hidden">
      <GlobalStyles />
      <UrgencyBar />
      <Navbar onBook={() => setModalOpen(true)} />
      
      <main>
        <Hero onBook={() => setModalOpen(true)} />
        <TrustBadges />
        <InfiniteReviews />
        <Services />
        <Gallery />
        <Pricing onBook={() => setModalOpen(true)} />
        <ContactSection />
        
        {/* Simplified Footer */}
        <footer className="bg-zinc-950 border-t border-white/10 py-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <h2 className="text-xl font-bold text-white">RAIKA<span className="text-yellow-500">.</span></h2>
               <p className="text-zinc-600 text-xs mt-2">© 2025 Raika Photography. Premium Studio.</p>
            </div>
            <div className="flex gap-6">
                <Instagram className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                <Facebook className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                <Mail className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile Sticky Action Bar - Optimized for Conversion */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-zinc-900/90 backdrop-blur-lg border-t border-white/10 md:hidden z-40 flex gap-2">
        <a href="tel:+919738438497" className="flex-1 bg-zinc-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 py-3 active:scale-95 transition-transform text-sm">
          <Phone size={16} /> Call
        </a>
        <button onClick={() => setModalOpen(true)} className="flex-[2] bg-yellow-500 text-black font-black rounded-lg flex items-center justify-center gap-2 py-3 shadow-[0_0_15px_rgba(234,179,8,0.3)] active:scale-95 transition-transform text-sm animate-pulse-gold">
          CHECK DATES <ArrowRight size={16} />
        </button>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default App;