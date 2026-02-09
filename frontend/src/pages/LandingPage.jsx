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
  Globe,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  Lock,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-transparent rounded-full flex items-center justify-center overflow-hidden">
           <img src="/Logo2.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 max-w-full max-h-full object-contain" />
          </div>
          <span className="text-xl md:text-2xl font-bold text-black tracking-tight">UMS</span>
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
          className="md:hidden text-black p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F3F0E6] border-b border-gray-200 overflow-hidden absolute w-full shadow-xl"
          >
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {['Features', 'Why Us', 'About', 'FAQ'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-xl font-medium text-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
              <hr className="border-gray-200" />
              <div className="flex flex-col gap-4">
                <Link to="/login" className="text-xl font-medium text-gray-900" onClick={() => setIsOpen(false)}>Log in</Link>
                <Link to="/register" className="text-xl font-medium text-orange-600" onClick={() => setIsOpen(false)}>Apply for Admission</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="pt-24 pb-8 px-4 md:px-6 md:pb-12 md:pt-28">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#222222] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col items-start justify-center"
        >
          <div className="relative z-10 max-w-full md:max-w-[80%] lg:max-w-[65%]">       
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-bold text-4xl md:text-6xl lg:text-[7rem] text-[#F3F0E6] leading-[1.1] md:leading-[0.9] mb-6 md:mb-8 tracking-tight"
            >
              University Management System
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-gray-400 max-w-lg mb-8 md:mb-10 font-light leading-relaxed"
            >
              Deep insights, creative velocity, and full execution. 
              All powered by one powerful university management system.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            >
              <Link 
                to="/register"
                className="w-full sm:w-auto text-center bg-[#FF5722] text-white px-8 py-4 rounded-full font-medium hover:bg-[#F44336] transition-colors shadow-lg shadow-orange-500/20"
              >
                Apply for Admission
              </Link>
              <a href="#about" className="px-4 py-2 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium group transition-colors">
                Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </motion.div>       
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <h2 className="font-bold text-4xl md:text-6xl text-black mb-6 md:mb-8 leading-tight">
            Everything you need <br />
            <span className="text-gray-400 italic">in one place.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
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
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">{feature.title}</h3>
                  <p className="text-gray-500 text-sm md:text-base">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative mt-8 md:mt-0">
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-[80px] md:blur-[100px]" />
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-100"
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

const CardVisual = ({ type }) => {
  switch (type) {
    case 'student':
      return (
        <div className="w-full h-full flex items-center justify-center bg-orange-50/30">
          <motion.div 
            className="relative bg-white p-4 shadow-sm border border-orange-100/50 w-48"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Users size={20} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-2 w-20 bg-gray-100 rounded-full" />
                <div className="h-2 w-14 bg-gray-100 rounded-full" />
              </div>
            </div>
            <div className="space-y-2 pl-1">
              <div className="h-1.5 w-full bg-gray-50 rounded-full" />
              <div className="h-1.5 w-5/6 bg-gray-50 rounded-full" />
            </div>
            <motion.div 
              className="absolute -right-4 -top-4 bg-white p-2 shadow-sm border border-orange-50 text-orange-500"
              animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <GraduationCap size={16} />
            </motion.div>
          </motion.div>
        </div>
      );
    case 'security':
      return (
        <div className="w-full h-full flex items-center justify-center bg-orange-50/30">
          <div className="relative">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-orange-500/20"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5 + (i * 0.2), opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
              />
            ))}
            <div className="relative z-10 bg-white p-4 shadow-sm border border-orange-100">
              <Shield className="text-orange-500 w-12 h-12" strokeWidth={1.5} />
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-black text-white p-1.5 border-2 border-white"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock size={12} />
              </motion.div>
            </div>
          </div>
        </div>
      );
    case 'uptime':
      return (
        <div className="w-full h-full flex items-center justify-center bg-orange-50/30">
          <div className="bg-white p-4 shadow-sm border border-orange-100 w-52">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
              <span className="text-[10px] font-bold text-gray-400">SYSTEM STATUS</span>
              <Activity size={12} className="text-green-500" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                  <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'implementation':
      return (
        <div className="w-full h-full flex items-center justify-center bg-orange-50/30">
          <div className="bg-white p-5 shadow-sm border border-orange-100 w-52">
             <div className="flex justify-between mb-2">
                <div className="h-1.5 w-12 bg-gray-200 rounded-full" />
                <span className="text-[10px] font-bold text-orange-500">100%</span>
             </div>
             <div className="h-2 w-full bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-orange-500 rounded-2xl"
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                />
             </div>
             <div className="space-y-2 opacity-50">
               <div className="w-full h-1 bg-gray-100 rounded-2xl" />
               <div className="w-2/3 h-1 bg-gray-100 rounded-2xl" />
             </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const WhyChooseUs = () => {
  const reasons = [
    { type: 'student', title: "Student-Centric", desc: "Designed to improve the student experience from admission to graduation." },
    { type: 'security', title: "Enterprise Security", desc: "Bank-grade encryption and compliance with international data standards." },
    { type: 'uptime', title: "99.9% Uptime", desc: "Reliable infrastructure ensuring your university never stops running." },
    { type: 'implementation', title: "Fast Implementation", desc: "Get your campus up and running in weeks, not years." }
  ];

  return (
    <section id="why-us" className="py-20 md:py-32 px-4 md:px-6 bg-[#222222] text-white rounded-[2rem] md:rounded-[3rem] mx-2 md:mx-6 mb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-bold text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tight">Why Choose UMS?</h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-light">
            We understand the unique challenges of higher education management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="group bg-[#F3F0E6] overflow-hidden rounded-2xl hover:bg-white transition-all duration-300 h-auto md:h-[400px] flex flex-col"
            >
              <div className="h-[200px] w-full border-b border-gray-100/50 relative overflow-hidden">
                 <CardVisual type={reason.type} />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-black group-hover:text-orange-600 transition-colors mb-2">{reason.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm mb-4">{reason.desc}</p>
                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-black opacity-50 group-hover:opacity-100 transition-all transform translate-y-0 group-hover:-translate-y-2">
                  Learn more <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutUs = () => {
  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 w-full order-2 lg:order-1">
          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                src="/uniHeroSec.jpg" 
                alt="University Campus" 
                className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-8 -right-4 md:-right-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 max-w-[200px] md:max-w-xs z-20"
            >
              <p className="text-3xl md:text-5xl font-bold text-black mb-2">10+</p>
              <p className="text-gray-500 text-sm md:text-base font-medium">Years of excellence <br/> in EdTech</p>
            </motion.div>
          </div>
        </div>
        
        <div className="flex-1 w-full order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-bold text-4xl md:text-6xl lg:text-7xl text-black mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Next Gen</span>
            </h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-600 font-light leading-relaxed">
                <p>
                    At UMS, we believe that technology should be an enabler, not a barrier. Our mission is to simplify the complex administrative processes of universities so that educators can focus on what truly matters: teaching.
                </p>
                <p>
                    Founded by a team of educators and engineers, we've built a platform that is intuitive, powerful, and adaptable to the needs of modern institutions.
                </p>
            </div>
            
            <div className="mt-8 md:mt-10 flex items-center gap-8">
                <button className="group flex items-center gap-3 text-black font-bold text-base md:text-lg hover:text-orange-600 transition-colors">
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
    <section id="faq" className="py-16 md:py-24 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-black mb-4 md:mb-6">Frequently Asked Questions</h2>
        <p className="text-gray-600 text-lg md:text-xl">Got questions? We've got answers.</p>
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
              className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-base md:text-lg font-bold text-black pr-4">{faq.q}</span>
              <div className="shrink-0">
                {openIndex === index ? <Minus className="text-orange-500" /> : <Plus className="text-black" />}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 md:p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 text-sm md:text-base">
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
    <footer className="bg-[#222222] text-white pt-16 md:pt-20 pb-10 rounded-t-[2rem] md:rounded-t-[3rem] mx-2 md:mx-6 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/Logo2.png" alt="UMS Logo" className="h-10 w-auto object-contain brightness-0 invert" />
              <span className="text-2xl font-bold text-white tracking-tight">UMS</span>
            </div>
            <p className="text-gray-400 max-w-sm text-base md:text-lg leading-relaxed">
              The modern operating system for forward-thinking universities. Built for speed, security, and scale.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-2">
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Platform</h4>
              <ul className="space-y-4 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Enterprise</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 text-center md:text-left">
          <p>© 2024 University Management System. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
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
