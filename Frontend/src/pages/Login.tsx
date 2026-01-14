
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Role } from '../types';
import { ChefHat, Mail, Lock, ArrowRight, Briefcase, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.CUSTOMER);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password, role);
      
      if (role === Role.MANAGER) {
          navigate('/admin');
      } else if (role === Role.EMPLOYEE) {
          navigate('/employee');
      } else {
          navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoRole: Role) => {
    setEmail(demoEmail);
    setRole(demoRole);
    setPassword('123');
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 bg-tlj-green relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="relative z-10 text-center px-12 text-tlj-cream">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
              <ChefHat size={48} />
           </div>
           <h1 className="text-5xl font-serif font-bold mb-6">Pane e Amore</h1>
           <p className="text-xl font-light leading-relaxed opacity-90 max-w-lg mx-auto">
             "Where every loaf tells a story of tradition, patience, and love. Welcome back to the family."
           </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-tlj-charcoal mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Portal</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setRole(Role.CUSTOMER)}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg text-sm font-medium transition-all duration-200 ${role === Role.CUSTOMER ? 'bg-white text-tlj-green shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <User size={18} className="mb-1" /> Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole(Role.EMPLOYEE)}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg text-sm font-medium transition-all duration-200 ${role === Role.EMPLOYEE ? 'bg-white text-tlj-blue shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Briefcase size={18} className="mb-1" /> Staff
                </button>
                <button
                  type="button"
                  onClick={() => setRole(Role.MANAGER)}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg text-sm font-medium transition-all duration-200 ${role === Role.MANAGER ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ShieldCheck size={18} className="mb-1" /> Admin
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all placeholder-gray-400 text-gray-800"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all placeholder-gray-400 text-gray-800"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-tlj-green text-white rounded-xl font-bold hover:bg-tlj-charcoal transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 mb-4 uppercase tracking-widest">Quick Demo Access</p>
            <div className="flex justify-center gap-2">
               <button onClick={() => fillDemo('admin@bakery.com', Role.MANAGER)} className="px-3 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium hover:bg-purple-100 transition-colors">Admin</button>
               <button onClick={() => fillDemo('staff@bakery.com', Role.EMPLOYEE)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 transition-colors">Staff</button>
               <button onClick={() => fillDemo('client@bakery.com', Role.CUSTOMER)} className="px-3 py-1 bg-green-50 text-green-600 rounded text-xs font-medium hover:bg-green-100 transition-colors">Client</button>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account? <Link to="/signup" className="text-tlj-green font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
