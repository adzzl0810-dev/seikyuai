import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FloatingPaths } from './ui/background-paths';
import { Header } from './Header';
import { HelmetProvider } from 'react-helmet-async';
import { InstallPrompt } from './InstallPrompt';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <HelmetProvider>
            <div className="relative flex flex-col min-h-screen overflow-hidden bg-slate-50/50 font-sans isolate">

                {/* Background Pattern */}
                <div className="absolute inset-0 -z-10 overflow-hidden opacity-60 pointer-events-none">
                    <FloatingPaths position={1} />
                    <FloatingPaths position={-1} />
                </div>

                <Header />

                <main className="flex-1 flex flex-col w-full relative z-0">
                    {children}
                </main>

                {/* Global Footer */}
                <footer className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200 py-8 relative z-10">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-slate-400 font-bold text-xs">
                            &copy; 2024 Seikyu AI. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6">
                            <Link to="/privacy" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">プライバシーポリシー</Link>
                            <Link to="/contact" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">お問い合わせ</Link>
                        </div>
                    </div>
                </footer>

                <InstallPrompt />

            </div>
        </HelmetProvider>
    );
};
