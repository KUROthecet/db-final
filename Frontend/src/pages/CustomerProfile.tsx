import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { Role } from '../types';
import axiosClient from '../api/axiosClient';
import { 
  User, Mail, Phone, MapPin, Camera, CheckCircle2, 
  Save, Lock, Calendar, AlertCircle, Loader2
} from 'lucide-react';

const CustomerProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Đồng bộ dữ liệu từ Context vào Form khi User thay đổi hoặc trang Load
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || (currentUser as any).fullname || '',
        email: currentUser.email || '',
        phone: (currentUser as any).phone || '',
        address: (currentUser as any).address || '',
        dob: (currentUser as any).dob ? new Date((currentUser as any).dob).toISOString().split('T')[0] : '',
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  // XỬ LÝ CẬP NHẬT THÔNG TIN CÁ NHÂN
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
        if (updateUserProfile) {
            // Đợi hàm updateUserProfile (trong AuthContext) thực hiện gọi API
            await updateUserProfile(formData);
            setSuccessMessage('Thông tin đã được cập nhật thành công!');
            setTimeout(() => setSuccessMessage(''), 4000);
        }
    } catch (err: any) {
        setErrorMessage(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // XỬ LÝ ĐỔI MẬT KHẨU
  const handlePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (passData.new !== passData.confirm) {
        setErrorMessage("Mật khẩu mới không khớp nhau!");
        return;
    }

    setIsSubmitting(true);
    try {
        // Xác định đúng URL API dựa trên Role của người dùng
        let url = `/auth/change-password/${currentUser.id}`;
        if (currentUser.role === Role.EMPLOYEE) url = `/employee/auth/change-password/${currentUser.id}`;
        if (currentUser.role === Role.MANAGER) url = `/manager/auth/change-password/${currentUser.id}`;

        await axiosClient.post(url, {
            currentPassword: passData.current,
            newPassword: passData.new
        });

        setSuccessMessage('Mật khẩu đã được thay đổi thành công!');
        setPassData({ current: '', new: '', confirm: '' });
        setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
        const msg = err.response?.data?.error || "Mật khẩu hiện tại không chính xác!";
        setErrorMessage(msg);
    } finally {
        setIsSubmitting(false);
    }
  };

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
          <p className="text-gray-500 mt-2">Quản lý thông tin cá nhân tại Pane e Amore</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            {successMessage && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200 animate-bounce">
                <CheckCircle2 size={18} />
                <span className="text-sm font-bold">{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl border border-red-200 animate-pulse">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">{errorMessage}</span>
              </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
            
            <h2 className="text-xl font-bold text-tlj-charcoal">{currentUser.fullName || (currentUser as any).fullname}</h2>
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${badge.class}`}>
              {badge.label}
            </div>

            <nav className="mt-10 space-y-2">
              <button 
                onClick={() => { setActiveTab('info'); setErrorMessage(''); }}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'info' ? 'bg-tlj-green text-white shadow-lg shadow-tlj-green/20' : 'text-gray-500 hover:bg-tlj-cream'}`}
              >
                <User size={18} /> Thông tin cá nhân
              </button>
              <button 
                onClick={() => { setActiveTab('password'); setErrorMessage(''); }}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'password' ? 'bg-tlj-green text-white shadow-lg shadow-tlj-green/20' : 'text-gray-500 hover:bg-tlj-cream'}`}
              >
                <Lock size={18} /> Bảo mật & Mật khẩu
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-tlj-green/5 min-h-[500px]">
            {activeTab === 'info' ? (
              <form onSubmit={handleInfoSubmit} className="p-8 lg:p-10 space-y-8">
                <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-serif font-bold text-tlj-green">Edit Profile</h3>
                    <p className="text-sm text-gray-400">Cập nhật thông tin để chúng tôi phục vụ bạn tốt hơn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-tlj-green/30" size={18} />
                      <input 
                        type="text" required value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:border-tlj-green outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email (Không thể sửa)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-tlj-green/30" size={18} />
                      <input type="email" readOnly value={formData.email} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-gray-400 italic cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
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
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Ngày sinh</label>
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
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Địa chỉ giao hàng</label>
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
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="bg-tlj-green text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-tlj-charcoal disabled:opacity-50 disabled:cursor-wait transition-all shadow-lg"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePassSubmit} className="p-8 lg:p-10 space-y-8">
                <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-serif font-bold text-tlj-green">Security</h3>
                    <p className="text-sm text-gray-400">Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn</p>
                </div>

                <div className="max-w-md space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mật khẩu hiện tại</label>
                    <input 
                        type="password" required value={passData.current}
                        onChange={e => setPassData({...passData, current: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 px-6 focus:border-tlj-green outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mật khẩu mới</label>
                    <input 
                        type="password" required minLength={6} value={passData.new}
                        onChange={e => setPassData({...passData, new: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 px-6 focus:border-tlj-green outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Xác nhận mật khẩu mới</label>
                    <input 
                        type="password" required value={passData.confirm}
                        onChange={e => setPassData({...passData, confirm: e.target.value})}
                        className="w-full bg-tlj-cream/20 border border-gray-100 rounded-2xl py-3 px-6 focus:border-tlj-green outline-none" 
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="bg-tlj-green text-white px-10 py-4 rounded-2xl font-bold hover:bg-tlj-charcoal disabled:opacity-50 transition-all shadow-lg"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
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