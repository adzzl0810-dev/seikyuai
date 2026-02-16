import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Hide header on Editor page as it has its own Sidebar
    if (location.pathname === '/editor') return null;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'ホーム', path: '/' },
        { name: 'テンプレート', path: '/templates' },
        { name: '機能・特徴', path: '/#features' },
        { name: '使い方ガイド', path: '/guide' },
        { name: 'お役立ちコラム', path: '/column' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled || isMobileMenuOpen
                        ? 'bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-sm py-3'
                        : 'bg-transparent border-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-indigo-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src="/logo_transparent.png"
                                alt="SeikyuAI"
                                className="w-10 h-10 object-contain relative z-10 drop-shadow-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tighter leading-none text-slate-900 flex items-baseline gap-0.5">
                                Seikyu<span className="text-indigo-600">AI</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-bold transition-colors ${location.pathname === link.path
                                        ? 'text-indigo-600'
                                        : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA & Mobile Menu Toggle */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/editor"
                            className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-black text-xs transition-all hover:scale-105 shadow-xl shadow-indigo-500/20"
                        >
                            今すぐ作成 <ChevronRight size={14} />
                        </Link>

                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in slide-in-from-top-10 duration-200">
                    <nav className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-lg font-black pb-4 border-b border-slate-100 ${location.pathname === link.path
                                        ? 'text-indigo-600'
                                        : 'text-slate-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/editor"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-4 rounded-xl font-black text-sm mt-4 shadow-xl"
                        >
                            請求書を作成する <ChevronRight size={16} />
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
};
