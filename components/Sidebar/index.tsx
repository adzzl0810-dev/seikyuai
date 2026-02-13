import { useState } from 'react';
import {
    History as HistoryIcon, LogOut, FileText, Info,
    Building, Palette, BookOpen, Copy
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SidebarProps {
    user: UserProfile | null;
    activeTab: 'items' | 'client' | 'issuer' | 'settings' | 'guide';
    setActiveTab: (tab: 'items' | 'client' | 'issuer' | 'settings' | 'guide') => void;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onHistoryClick: () => void;
    onConvertClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    user,
    activeTab,
    setActiveTab,
    onLoginClick,
    onLogoutClick,
    onHistoryClick,
    onConvertClick
}) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return (
        <>
            <header className="px-6 py-6 border-b flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-xl"><FileText size={24} /></div>
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter text-slate-800 leading-none">Seikyu <span className="text-indigo-600">AI</span></h1>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Smart Invoice Solution</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onConvertClick} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-all border border-slate-100 shadow-sm active:scale-95" title="書類を変換・複製"><Copy size={20} /></button>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <button onClick={onHistoryClick} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-all border border-slate-100"><HistoryIcon size={20} /></button>
                            <div className="relative">
                                {isProfileMenuOpen && (
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                                )}
                                <img
                                    src={user.avatarUrl}
                                    className="w-10 h-10 rounded-full ring-2 ring-indigo-50 cursor-pointer shadow-md hover:ring-indigo-200 transition-all active:scale-95"
                                    alt="avatar"
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                />
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 top-full mt-3 bg-white shadow-xl rounded-2xl p-2 min-w-[200px] border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                onLogoutClick();
                                            }}
                                            className="w-full flex items-center gap-3 text-sm p-3 hover:bg-red-50 rounded-xl text-red-600 font-bold transition-all"
                                        >
                                            <LogOut size={16} /> ログアウト
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button onClick={onLoginClick} className="text-xs font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-5 py-2.5 rounded-2xl transition-all shadow-sm">
                            ログイン
                        </button>
                    )}
                </div>
            </header>

            <nav className="flex px-2 pt-2 border-b bg-white shrink-0 overflow-x-auto no-scrollbar">
                {(['items', 'client', 'issuer', 'settings', 'guide'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 min-w-[80px] py-4 text-[11px] font-black tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                    >
                        {tab === 'items' ? '明細入力' : tab === 'client' ? '宛先' : tab === 'issuer' ? '自社' : tab === 'settings' ? 'デザイン' : '使い方'}
                        {activeTab === tab && <div className="absolute bottom-0 left-4 right-4 h-1 bg-indigo-600 rounded-t-full"></div>}
                    </button>
                ))}
            </nav>
        </>
    );
};

export default Sidebar;
