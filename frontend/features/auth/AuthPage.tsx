import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Globe, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    // Mock auth - just navigate to dashboard
    setTimeout(() => {
      localStorage.setItem('medimind_user', JSON.stringify({ email }));
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const trustBullets = [
    { icon: Shield, text: 'AI-powered health understanding' },
    { icon: Heart, text: 'Secure & private' },
    { icon: Globe, text: 'English & Urdu supported' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D9488] to-[#0F766E] p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-[#0D9488]" fill="#0D9488" />
            </div>
            <span className="text-2xl font-bold text-white">MediMind AI</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Understand your health, simply.
          </h1>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            AI-powered insights that turn complex medical data into clear, actionable guidance.
          </p>

          <div className="space-y-4">
            {trustBullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <bullet.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{bullet.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#F8FFFE]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-[#0D9488]">MediMind AI</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-[#CCFBF1] p-8">
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              {(['signin', 'signup'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === m
                      ? 'bg-white text-[#0D9488] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 text-base bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 text-base bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-11 text-base bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full bg-[#0D9488] text-white py-3 rounded-xl text-base font-semibold hover:bg-[#0F766E] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'signin' ? 'Sign In' : 'Create My Account'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
