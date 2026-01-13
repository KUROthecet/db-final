
import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Lock, Save, Camera } from 'lucide-react';

const CustomerProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    dob: currentUser?.dob || '',
  });

  const [passData, setPassData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  if (!currentUser) return null;

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
        setMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
    }
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setPassData({ current: '', new: '', confirm: '' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-tlj-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-tlj-charcoal mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="relative inline-block mb-4">
                    <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-tlj-cream" />
                    <button className="absolute bottom-0 right-0 p-1.5 bg-tlj-green text-white rounded-full hover:bg-tlj-charcoal transition-colors">
                        <Camera size={14} />
                    </button>
                </div>
                <h3 className="font-bold text-lg text-tlj-charcoal">{currentUser.fullName}</h3>
                <p className="text-gray-500 text-sm mb-6">{currentUser.email}</p>

                <div className="space-y-2">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'info' ? 'bg-tlj-green text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Personal Info
                    </button>
                    <button 
                        onClick={() => setActiveTab('password')}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'password' ? 'bg-tlj-green text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Change Password
                    </button>
                </div>
            </div>
          </div>

          <div className="md:col-span-2">
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {activeTab === 'info' ? (
                    <form onSubmit={handleInfoSubmit} className="space-y-6">
                        <h2 className="text-xl font-bold text-tlj-green mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><User size={14}/> Full Name</label>
                                <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Mail size={14}/> Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Phone size={14}/> Phone</label>
                                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" placeholder="+84..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Calendar size={14}/> Date of Birth</label>
                                <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><MapPin size={14}/> Address</label>
                                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" placeholder="Street address, City..." />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="px-8 py-3 bg-tlj-green text-white rounded-xl font-bold hover:bg-tlj-charcoal transition-colors flex items-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePassSubmit} className="space-y-6">
                        <h2 className="text-xl font-bold text-tlj-green mb-6 border-b border-gray-100 pb-4">Change Password</h2>
                        
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Lock size={14}/> Current Password</label>
                                <input type="password" required value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Lock size={14}/> New Password</label>
                                <input type="password" required value={passData.new} onChange={e => setPassData({...passData, new: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Lock size={14}/> Confirm New Password</label>
                                <input type="password" required value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-tlj-green outline-none" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="px-8 py-3 bg-tlj-green text-white rounded-xl font-bold hover:bg-tlj-charcoal transition-colors flex items-center gap-2">
                                Update Password
                            </button>
                        </div>
                    </form>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
