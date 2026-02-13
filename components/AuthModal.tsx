import React, { useState } from 'react';
import { User, KeyRound, LogIn, UserPlus, X, AlertCircle, Mail, Lock } from 'lucide-react';
import { supabase } from '../services/supabase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Fetch profile if needed, or just use auth data
          // For now, construct a basic profile from auth data
          const userProfile: UserProfile = {
            name: data.user.user_metadata.full_name || email.split('@')[0],
            email: data.user.email || '',
            avatarUrl: data.user.user_metadata.avatar_url,
            id: data.user.id
          };
          onLoginSuccess(userProfile);
          onClose();
          resetForm();
        }
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=128`
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          setMessage('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。');
          // Don't close immediately, let them see the message
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError(null);
    setMessage(null);
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
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
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </h2>
          <p className="text-indigo-200 text-xs mt-2">
            {mode === 'login'
              ? 'メールアドレスとパスワードを入力してください'
              : 'アカウントを作成してデータをクラウドに保存しましょう'}
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

            {message && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-bold text-slate-700 mb-1">表示名</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="山田 太郎"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">パスワード</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono tracking-widest text-lg"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">※6文字以上のパスワードを設定してください</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '処理中...' : (mode === 'login' ? 'ログイン' : 'アカウントを作成')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            {mode === 'login' ? (
              <p className="text-sm text-slate-600">
                アカウントをお持ちでないですか？<br />
                <button onClick={() => switchMode('register')} className="text-indigo-600 font-bold hover:underline mt-1">
                  新規登録はこちら
                </button>
              </p>
            ) : (
              <p className="text-sm text-slate-600">
                すでに登録済みですか？<br />
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