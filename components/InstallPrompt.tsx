import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <button
                onClick={handleInstallClick}
                className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 group"
            >
                <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                    <Download size={24} />
                </div>
                <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">App版を利用する</div>
                    <div className="font-bold text-sm">ホーム画面に追加</div>
                </div>
            </button>
        </div>
    );
};
