import React, { useState } from 'react';
import { User, KeyRound, LogIn, UserPlus, X, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../services/storageService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 4 || isNaN(Number(pin))) {
        setError('PINコードは4桁の数字で入力してください');
        return;
    }

    if (mode === 'login') {
      const result = loginUser(username, pin);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
        // Reset form
        setUsername('');
        setPin('');
      } else {
        setError(result.error || 'ログインに失敗しました');
      }
    } else {
      if (!displayName.trim()) {
        setError('表示名を入力してください');
        return;
      }
      const result = registerUser(username, displayName, pin);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
        // Reset form
        setUsername('');
        setDisplayName('');
        setPin('');
      } else {
        setError(result.error || '登録に失敗しました');
      }
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="bg-indigo-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-indigo-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {mode === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
            {mode === 'login' ? 'アカウントにログイン' : '新規アカウント作成'}
          </h2>
          <p className="text-indigo-200 text-xs mt-2">
            {mode === 'login' 
              ? '設定したIDとPINコードを入力してください' 
              : 'IDと4桁のPINコードを設定して、データを安全に管理しましょう'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">ユーザーID (半角英数)</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="例: user01"
                  required
                  pattern="^[a-zA-Z0-9_]+$"
                  title="半角英数字で入力してください"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-bold text-slate-700 mb-1">表示名 (請求書には表示されません)</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="例: 山田 太郎"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">PINコード (4桁の数字)</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono tracking-widest text-lg"
                  placeholder="0000"
                  required
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">※他人のアクセスを防ぐための暗証番号です</p>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex justify-center items-center gap-2 mt-4"
            >
              {mode === 'login' ? 'ログイン' : 'アカウントを作成'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
             {mode === 'login' ? (
               <p className="text-sm text-slate-600">
                 アカウントをお持ちでないですか？<br/>
                 <button onClick={() => switchMode('register')} className="text-indigo-600 font-bold hover:underline mt-1">
                   新規登録はこちら
                 </button>
               </p>
             ) : (
               <p className="text-sm text-slate-600">
                 すでに登録済みですか？<br/>
                 <button onClick={() => switchMode('login')} className="text-indigo-600 font-bold hover:underline mt-1">
                   ログインはこちら
                 </button>
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};