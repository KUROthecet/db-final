import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { Role } from '../types';
import { 
  User, Mail, Phone, MapPin, Camera, ShieldCheck, 
  Save, Key, Clock, CheckCircle2, Lock, Calendar 
} from 'lucide-react';

const CustomerProfile = () => {
  const { currentUser, updateUserProfile } = useAuth(); // Lấy hàm update từ Context
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [successMessage, setSuccessMessage] = useState('');

  // Form thông tin cá nhân
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
  });

  // Form mật khẩu
  const [passData, setPassData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: (currentUser as any).phone || '',
        address: (currentUser as any).address || '',
        dob: (currentUser as any).dob || '',
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateUserProfile) {
        updateUserProfile(formData);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
        alert("New passwords do not match!");
        return;
    }
    setSuccessMessage('Password changed successfully!');
    setPassData({ current: '', new: '', confirm: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Badge hiển thị chức vụ
  const getRoleBadge = (role?: Role) => {
    switch (role) {
      case Role.MANAGER: return { label: 'Administrator', class: 'bg-red-100 text-red-700 border-red-200' };
      case Role.EMPLOYEE: return { label: 'Staff Member', class: 'bg-blue-100 text-blue-700 border-blue-200' };
      default: return { label: 'Valued Customer', class: 'bg-tlj-green/10 text-tlj-green border-tlj-green/20' };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen bg-tlj-cream/30">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-tlj-charcoal">My Account</h1>
          <p className="text-gray-500 mt-2">Manage your presence at Pane e Amore</p>
        </div>
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200 animate-fade-in">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">{successMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: AVATAR & NAVIGATION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-tlj-green/5 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-tlj-cream flex items-center justify-center text-tlj-green border-4 border-white shadow-xl overflow-hidden">
                {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User size={64} strokeWidth={1.5} />
                )}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-tlj-green text-white rounded-full shadow-lg hover:scale-110 transition-all">
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-tlj-charcoal">{currentUser.fullName}</h2>
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${badge.class}`}>
              {badge.label}
            </div>

            <nav className="mt-10 space-y-2">
              <button 
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'info' ? 'bg-tlj-green text-white shadow-lg shadow-tlj-green/20' : 'text-gray-500 hover:bg-tlj-cream'}`}
              >
                <User size={18} /> Personal Info
              </button>
              <button 
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'password' ? 'bg-tlj-green text-white shadow-lg shadow-tlj-green/20' : 'text-gray-500 hover:bg-tlj-cream'}`}
              >
                <Lock size={18} /> Security
              </button>
            </nav>
          </div>
        </div>

        {/* CỘT PHẢI: FORMS */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-tlj-green/5 min-h-[500px]">
            {activeTab === 'info' ? (
              <form onSubmit={handleInfoSubmit} className="p-8 lg:p-10 space-y-8">
                <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-serif font-bold text-tlj-green">Edit Profile</h3>
                    <p className="text-sm text-gray-400">Keep your delivery details up to date</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-tlj-green/30" size={18} />
                      <input 
                        type="text" value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:border-tlj-green outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-tlj-green/30" size={18} />
                      <input type="email" disabled value={formData.email} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-gray-400 italic" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-tlj-green/30" size={18} />
                      <input 
                        type="text" value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:border-tlj-green outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-tlj-green/30" size={18} />
                      <input 
                        type="date" value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:border-tlj-green outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-tlj-green/30" size={18} />
                      <input 
                        type="text" value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:border-tlj-green outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="bg-tlj-green text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-tlj-charcoal transition-all shadow-lg shadow-tlj-green/20">
                    <Save size={20} /> Save Information
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePassSubmit} className="p-8 lg:p-10 space-y-8">
                <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-serif font-bold text-tlj-green">Security</h3>
                    <p className="text-sm text-gray-400">Update your password to keep your account safe</p>
                </div>

                <div className="max-w-md space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Current Password</label>
                    <input 
                        type="password" required value={passData.current}
                        onChange={e => setPassData({...passData, current: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 px-6 focus:border-tlj-green outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">New Password</label>
                    <input 
                        type="password" required value={passData.new}
                        onChange={e => setPassData({...passData, new: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 px-6 focus:border-tlj-green outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm New Password</label>
                    <input 
                        type="password" required value={passData.confirm}
                        onChange={e => setPassData({...passData, confirm: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 px-6 focus:border-tlj-green outline-none" 
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="bg-tlj-green text-white px-10 py-4 rounded-2xl font-bold hover:bg-tlj-charcoal transition-all shadow-lg shadow-tlj-green/20">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
