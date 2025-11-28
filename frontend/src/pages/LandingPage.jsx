import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Menu, 
  X, 
  Play, 
  Star, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  GraduationCap,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Fonts ---
// inject the Serif font for the "Like Image" look
// --- Fonts ---
// Using default dashboard font (Plus Jakarta Sans)


// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F3F0E6]/90 backdrop-blur-md py-2 shadow-sm' : 'bg-transparent py-2'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center">
           <img src="./public/Logo2.png" alt="Logo" />
          </div>
          <span className="text-2xl font-bold text-black tracking-tight">UMS</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Why Us', 'About', 'FAQ'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-gray-900 hover:text-black transition-colors">
            Log in
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg shadow-black/20"
          >
            Apply for Admission
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F3F0E6] border-b border-gray-200 overflow-hidden absolute w-full"
          >
            <div className="p-6 flex flex-col gap-4">
              {['Features', 'Why Us', 'About', 'FAQ'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-lg font-medium text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <hr className="border-gray-200 my-2" />
              <Link to="/login" className="text-lg font-medium text-gray-900">Log in</Link>
              <Link to="/register" className="text-lg font-medium text-orange-600">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="pt-20 pb-12 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* The Dark Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#222222] rounded-[3rem] p-8 md:p-8 relative overflow-hidden min-h-[550px] md:min-h--[var(60px-100%)] flex flex-col md:flex-row items-center"
        >
          {/* Background Pattern/Glow */}
          {/* <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F3F0E6] rounded-full blur-[130px] -translate-y-1/2 translate-x-1/3 pointer-events-none" /> */}
          
          {/* Left Content */}
          <div className="relative z-10 max-w-[60%]">       

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-bold text-5xl md:text-[7.5rem] text-[#F3F0E6] leading-[0.9] mb-8 tracking-tight"
            >
              University Management System
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-400 max-w-lg mb-7 font-light leading-relaxed"
            >
              Deep insights, creative velocity, and full execution. 
              All powered by one powerful university management system.
            </motion.p>

            {/* Rating */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 mb-2 border-t border-white/10 pt-2 max-w-full"
            >
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6"
            >
              <Link 
                to="/register"
                className="bg-[#FF5722] text-white px-8 py-4 rounded-full font-medium hover:bg-[#F44336] transition-colors shadow-lg shadow-orange-500/20"
              >
                Apply for Admission
              </Link>
              <a href="#about" className="text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium group">
                Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
      
          {/* Right Content - Hero Image */}
          {/* <div className="relative z-10 mt-12 md:mt-0 md:absolute md:right-0 md:bottom-0 md:w-[55%] md:h-[90%]">
             <img 
               src="/heroRightImage.png" 
               alt="Dashboard Preview" 
               className="w-full h-full object-contain object-bottom"
             />
          </div> */}
        </motion.div>       
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-bold text-5xl md:text-6xl text-black mb-8 leading-tight">
            Everything you need <br />
            <span className="text-gray-400 italic">in one place.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Manage students, faculty, and administration with a seamless, modern interface designed for the future of education.
          </p>
          
          <div className="space-y-6">
            {[
              { title: 'Real-time Analytics', desc: 'Track performance instantly.' },
              { title: 'Secure Data', desc: 'Enterprise-grade encryption.' },
              { title: 'Automated Workflows', desc: 'Save hours on admin tasks.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">{feature.title}</h3>
                  <p className="text-gray-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-[100px]" />
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-lg overflow-hidden shadow-2xl border border-gray-100"
          >
             <img 
               src="/featuresRight.png" 
               alt="Features Dashboard" 
               className="w-full h-auto object-cover"
             />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <GraduationCap size={24} />,
      title: "Student-Centric",
      desc: "Designed to improve the student experience from admission to graduation."
    },
    {
      icon: <Shield size={24} />,
      title: "Enterprise Security",
      desc: "Bank-grade encryption and compliance with international data standards."
    },
    {
      icon: <Clock size={24} />,
      title: "99.9% Uptime",
      desc: "Reliable infrastructure ensuring your university never stops running."
    },
    {
      icon: <Zap size={24} />,
      title: "Fast Implementation",
      desc: "Get your campus up and running in weeks, not years."
    }
  ];

  return (
    <section id="why-us" className="py-32 px-6 bg-[#222222] text-white rounded-[3rem] mx-4 md:mx-6 mb-12 relative overflow-hidden">
      {/* Decorative background blur */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" /> */}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-bold text-5xl md:text-7xl mb-6 tracking-tight">Why Choose UMS?</h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-light">
            We understand the unique challenges of higher education management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="group bg-[#F3F0E6] backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:bg-[#F3F0E6]/90 transition-all duration-300 h-[360px]"
            >
              <div className="w-15 h-15 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">{reason.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutUs = () => {
  return (
    <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-20">
        <div className="flex-1 w-full">
          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                src="./public/uniHeroSec.jpg" 
                alt="University Campus" 
                className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 max-w-xs z-20"
            >
              <p className="text-5xl font-bold text-black mb-2">10+</p>
              <p className="text-gray-500 font-medium">Years of excellence <br/> in EdTech</p>
            </motion.div>
          </div>
        </div>
        
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-bold text-6xl md:text-7xl text-black mb-8 leading-[0.9]">
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Next Gen</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                <p>
                    At UMS, we believe that technology should be an enabler, not a barrier. Our mission is to simplify the complex administrative processes of universities so that educators can focus on what truly matters: teaching.
                </p>
                <p>
                    Founded by a team of educators and engineers, we've built a platform that is intuitive, powerful, and adaptable to the needs of modern institutions.
                </p>
            </div>
            
            <div className="mt-10 flex items-center gap-8">
                <button className="group flex items-center gap-3 text-black font-bold text-lg hover:text-orange-600 transition-colors">
                    Read our full story 
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 group-hover:translate-x-2 transition-all">
                        <ArrowRight size={16} />
                    </span>
                </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    { q: "Is UMS suitable for small colleges?", a: "Yes! UMS is scalable and works perfectly for institutions of all sizes, from small colleges to large universities." },
    { q: "Can we migrate our existing data?", a: "Absolutely. We provide dedicated migration tools and support to ensure a smooth transition from your legacy systems." },
    { q: "Is training provided?", a: "We offer comprehensive training sessions for administrators, faculty, and staff to ensure everyone gets the most out of the platform." },
    { q: "How secure is the student data?", a: "Security is our top priority. We use end-to-end encryption and comply with GDPR, FERPA, and other global data protection regulations." },
  ];

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-bold text-5xl md:text-6xl text-black mb-6">Frequently Asked Questions</h2>
        <p className="text-gray-600 text-xl">Got questions? We've got answers.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            initial={false}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-bold text-black">{faq.q}</span>
              {openIndex === index ? <Minus className="text-orange-500" /> : <Plus className="text-black" />}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#222222] text-white pt-20 pb-10 rounded-t-[3rem] mx-4 md:mx-6 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/Logo2.png" alt="UMS Logo" className="h-12 w-auto object-contain brightness-0 invert" />
              <span className="text-2xl font-bold text-white tracking-tight">UMS</span>
            </div>
            <p className="text-gray-400 max-w-sm text-lg leading-relaxed">
              The modern operating system for forward-thinking universities. Built for speed, security, and scale.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Solutions</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 University Management System. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F3F0E6] text-black selection:bg-orange-500/30 font-sans">
      <Navbar />
      <Hero />
      <Features />
      <WhyChooseUs />
      <AboutUs />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
