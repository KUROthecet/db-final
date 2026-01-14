
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Role } from '../types';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    if (password.length < 3) {
        setError('Password must be at least 3 characters');
        return;
    }

    setLoading(true);
    try {
      await signup(name, email, Role.CUSTOMER, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 bg-tlj-cream relative overflow-hidden items-center justify-center order-last">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2832')] bg-cover bg-center opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="relative z-10 text-left px-16 text-white w-full">
           <h1 className="text-6xl font-serif font-bold mb-6">Join the <br/>Family</h1>
           <p className="text-xl font-light leading-relaxed opacity-90 max-w-md">
             Unlock exclusive offers, track your orders in real-time, and get fresh bread delivered to your doorstep.
           </p>
           
           <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                 <CheckCircle className="text-tlj-green bg-white rounded-full p-0.5" size={24} />
                 <span className="font-medium">Free delivery on first order</span>
              </div>
              <div className="flex items-center gap-3">
                 <CheckCircle className="text-tlj-green bg-white rounded-full p-0.5" size={24} />
                 <span className="font-medium">Exclusive seasonal menu access</span>
              </div>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-tlj-charcoal mb-2">Create Account</h2>
            <p className="text-gray-500">Sign up to start your delicious journey.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all placeholder-gray-400 text-gray-800"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all placeholder-gray-400 text-gray-800"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all placeholder-gray-400 text-gray-800"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Confirm Password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all placeholder-gray-400 text-gray-800"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-tlj-green text-white rounded-xl font-bold hover:bg-tlj-charcoal transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                  <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account? <Link to="/login" className="text-tlj-green font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
