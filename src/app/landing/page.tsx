// pages/index.js
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  // Simulate popup trigger (you can customize this logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOfferPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      id: 'baby',
      title: 'Baby Photography',
      description: 'From Womb to Wonderland: Chronicles of Baby Photography That Follows the Journey of Growth',
      image: '/api/placeholder/400/300',
      features: ['Newborn Sessions', 'Milestone Photos', 'Studio Props', 'Home Shoots']
    },
    {
      id: 'maternity',
      title: 'Maternity Photography',
      description: 'Capturing Connection: Maternity Photography that Chronicles the Bond Between Mother and Child',
      image: '/api/placeholder/400/300',
      features: ['Pregnancy Sessions', 'Couple Shots', 'Outdoor & Studio', 'Custom Themes']
    },
    {
      id: 'toddler',
      title: 'Toddler Photography',
      description: 'Capturing Connections: Portraits Showcasing the Heartwarming Bonds of Toddler Relationships',
      image: '/api/placeholder/400/300',
      features: ['Playful Sessions', 'Family Portraits', 'Themed Shoots', 'Cake Smash']
    },
    {
      id: 'prewedding',
      title: 'Pre-Wedding Photography',
      description: 'From Laughter to Forever: Preserving the Essence of Your Relationship in Pre-Wedding Imagery',
      image: '/api/placeholder/400/300',
      features: ['Romantic Sessions', 'Multiple Locations', 'Cinematic Style', 'Save the Date']
    },
    {
      id: 'events',
      title: 'Event Photography',
      description: 'Capturing the moments that captivate your heart with professional event coverage',
      image: '/api/placeholder/400/300',
      features: ['Weddings', 'Corporate Events', 'Birthdays', 'Celebrations']
    }
  ];

  const testimonials = [
    {
      name: "Ramya Gajendra",
      text: "The studio was clean, warm, and well-prepared with beautiful props, outfits, and cozy settings. The final photos turned out absolutely stunning!",
      rating: 5
    },
    {
      name: "Sasanapuri Sandeep Kumar",
      text: "The photographer Shravan and his assistant Suresh did a wonderful shoot. They first got attached to the kid and started after she was comfortable.",
      rating: 5
    },
    {
      name: "Sharanya Nagaraj",
      text: "What stood out the most was their flexibility and warmth. The Raika team was kind and accommodating, which is so important when working with little ones.",
      rating: 5
    },
    {
      name: "Megha M",
      text: "Shravan and Dinesh created a calm environment. The setups were beautifully curated — soft, dreamy, and perfectly suited to our baby's personality.",
      rating: 5
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const HeroSection = () => {
    const heroRef = useRef(null);
    const isInView = useInView(heroRef, { once: true });

    return (
      <section ref={heroRef} id="home" className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-32 right-20 w-24 h-24 bg-rose-300 rounded-full opacity-30"
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-gray-800 leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Raika
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"> Photography</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Capturing precious moments that captivate your heart. From newborn innocence to maternity glow, we preserve life's most beautiful chapters.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Your Session
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection('portfolio')}
                  className="px-8 py-4 border-2 border-gray-800 text-gray-800 font-semibold rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Portfolio
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-8 mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500">6200+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500">5★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500">1 Year</div>
                  <div className="text-sm text-gray-600">Free Storage</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div 
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <img src="/api/placeholder/600/700" alt="Beautiful baby photography" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-pink-400 rounded-full opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-rose-300 rounded-full opacity-60"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  const ServicesSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
      <section ref={sectionRef} id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Our <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional photography services that capture life's most precious moments with artistic excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const WhyChooseSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const features = [
      {
        title: '6200+ Shoots Experience',
        description: 'With experience of more than 6200+ shoots, we understand your expectations and deliver beyond them every time.',
        icon: '📸'
      },
      {
        title: 'Best Price Every Time',
        description: 'Instead of charging more, we serve more clients to keep costs lower while maintaining premium quality.',
        icon: '💰'
      },
      {
        title: '1 Year Free Storage',
        description: 'Your precious memories are safe with us. Minimum 1 year validity in our secure cloud gallery.',
        icon: '☁️'
      },
      {
        title: 'Home & Studio Shoots',
        description: 'Flexible location options - beautiful studio setups or comfortable home sessions.',
        icon: '🏠'
      }
    ];

    return (
      <section ref={sectionRef} id="why-choose" className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Why Choose <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Us?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <motion.div 
                  className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const TestimonialsSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
      const timer = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }, []);

    return (
      <section ref={sectionRef} id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              What Our <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Clients Say</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 lg:p-12 text-center"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-3xl text-yellow-400">⭐</span>
                  ))}
                </div>
                
                <blockquote className="text-xl lg:text-2xl text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>
                
                <div className="text-lg font-semibold text-gray-800">
                  - {testimonials[activeTestimonial].name}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-pink-500 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const ContactSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
      <section ref={sectionRef} id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-pink-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Let's Create <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Magic Together</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to capture your precious moments? Get in touch and let's discuss your photography needs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Book Your Session</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select Service</option>
                    <option value="baby">Baby Photography</option>
                    <option value="maternity">Maternity Photography</option>
                    <option value="toddler">Toddler Photography</option>
                    <option value="prewedding">Pre-Wedding Photography</option>
                    <option value="events">Event Photography</option>
                  </select>
                </div>
                
                <textarea
                  placeholder="Tell us about your vision..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 mb-6"
                />
                
                <motion.button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Inquiry
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white"
            >
              <h3 className="text-3xl font-bold mb-8">Get in Touch</h3>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                  whileHover={{ x: 10 }}
                >
                  <div className="text-2xl">📍</div>
                  <div>
                    <h4 className="font-semibold text-lg">Visit Our Studio</h4>
                    <p className="text-gray-300">No.46, 8th F main, 3rd block Jayanagar, Bangalore-560011</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                  whileHover={{ x: 10 }}
                >
                  <div className="text-2xl">📱</div>
                  <div>
                    <h4 className="font-semibold text-lg">Call or WhatsApp</h4>
                    <p className="text-gray-300">Available for consultations and bookings</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                  whileHover={{ x: 10 }}
                >
                  <div className="text-2xl">🕐</div>
                  <div>
                    <h4 className="font-semibold text-lg">Flexible Scheduling</h4>
                    <p className="text-gray-300">Book advance to secure your preferred date and time</p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="mt-12 p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-2xl backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h4 className="text-xl font-bold mb-3">🎁 Special Offer</h4>
                <p className="text-gray-300">Book now and get a complimentary family portrait session worth ₹5000!</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  const Navigation = () => {
    return (
      <motion.nav 
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Raika Photography
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-8">
              {['home', 'services', 'why-choose', 'testimonials', 'contact'].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-gray-700 hover:text-pink-500 font-medium transition-colors duration-300 capitalize"
                  whileHover={{ y: -2 }}
                >
                  {item.replace('-', ' ')}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-pink-500 transition-colors duration-300"
            >
              <div className={`w-6 h-0.5 bg-current mb-1 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-6 h-0.5 bg-current mb-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden border-t border-gray-200 mt-4 pt-4 overflow-hidden"
              >
                {['home', 'services', 'why-choose', 'testimonials', 'contact'].map((item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left py-3 text-gray-700 hover:text-pink-500 font-medium transition-colors duration-300 capitalize"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.replace('-', ' ')}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    );
  };

  const PortfolioSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const portfolioImages = [
      { src: '/api/placeholder/400/500', category: 'baby', title: 'Newborn Bliss' },
      { src: '/api/placeholder/400/500', category: 'maternity', title: 'Expecting Joy' },
      { src: '/api/placeholder/400/500', category: 'toddler', title: 'Playful Moments' },
      { src: '/api/placeholder/400/500', category: 'prewedding', title: 'Love Story' },
      { src: '/api/placeholder/400/500', category: 'events', title: 'Special Day' },
      { src: '/api/placeholder/400/500', category: 'baby', title: 'Tiny Fingers' },
      { src: '/api/placeholder/400/500', category: 'maternity', title: 'Glowing Mom' },
      { src: '/api/placeholder/400/500', category: 'toddler', title: 'First Steps' }
    ];

    return (
      <section ref={sectionRef} id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Our <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Portfolio</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A glimpse into the beautiful moments we've captured for families across Bangalore
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioImages.map((image, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-semibold">{image.title}</h4>
                  <p className="text-sm capitalize">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              See More & Book Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  };

  const OfferPopup = () => {
    if (!showOfferPopup) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowOfferPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-white rounded-3xl p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowOfferPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
            >
              ✕
            </button>

            <div className="text-center">
              <motion.div 
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎁
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Special Launch Offer!
              </h3>
              
              <p className="text-gray-600 mb-6">
                Book any photography session this month and get a FREE family portrait session worth ₹5000!
              </p>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 mb-6">
                <div className="text-3xl font-bold text-pink-600">50% OFF</div>
                <div className="text-sm text-gray-600">on your first booking</div>
              </div>

              <motion.button
                onClick={() => {
                  setShowOfferPopup(false);
                  scrollToSection('contact');
                }}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Claim Offer Now
              </motion.button>

              <p className="text-xs text-gray-500 mt-3">
                *Limited time offer. Terms and conditions apply.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
                Raika Photography
              </div>
              <p className="text-gray-400 leading-relaxed">
                Capturing precious moments that captivate your heart. Professional photography services in Bangalore.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Baby Photography</li>
                <li>Maternity Photography</li>
                <li>Toddler Photography</li>
                <li>Pre-Wedding Photography</li>
                <li>Event Photography</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📍 No.46, 8th F main, 3rd block</p>
                <p>Jayanagar, Bangalore-560011</p>
                <p>📧 info@raikaphotography.com</p>
                <p>📱 Available on WhatsApp</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Raika Photography. All rights reserved. Made with ❤️ in Bangalore.</p>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <>
      <Head>
        <title>Raika Photography Bangalore - Professional Baby, Maternity & Event Photography</title>
        <meta name="description" content="Professional photography services in Bangalore. Specializing in baby, maternity, toddler, pre-wedding and event photography. 6200+ shoots experience. Book now!" />
        <meta name="keywords" content="baby photography bangalore, maternity photography, toddler photography, pre-wedding photography, event photography, newborn photography, professional photographer bangalore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Raika Photography - Professional Photography Services Bangalore" />
        <meta property="og:description" content="Capturing precious moments with professional baby, maternity, and event photography in Bangalore. 6200+ shoots experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://raikaphotography.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="overflow-x-hidden">
        <Navigation />
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
        <OfferPopup />
      </div>
    </>
  );
}
/*
// pages/_app.js
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp

// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ec4899, #f43f5e);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #db2777, #e11d48);
}

/* Smooth animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}

/* Loading animation for images */
.image-loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 2s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
*/