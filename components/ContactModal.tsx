import React from 'react';
import { X, Mail, MessageCircle, ExternalLink } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // TODO: ここにご自身で作成したGoogleフォームのURLを入れてください
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd6pWwyLFvgZV_ThJ1II0gBEPNz-yqwOo3BVF6fppvkkPDmvA/viewform?usp=dialog"; 

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <MessageCircle size={20} />
            </div>
            <h2 className="text-lg font-black tracking-tight">お問い合わせ</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          <p className="text-sm text-slate-600 font-bold leading-relaxed">
            機能の不具合報告、ご要望、その他のお問い合わせは<br/>以下のフォームより受け付けております。
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <Mail size={48} className="text-indigo-200 mx-auto mb-4" />
            <a 
              href={GOOGLE_FORM_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              お問い合わせフォームを開く
              <ExternalLink size={16} className="opacity-70 group-hover:translate-x-1 transition-transform"/>
            </a>
            <p className="text-[10px] text-slate-400 font-bold mt-4">
              ※ Googleフォームへ移動します。<br/>原則2営業日以内にご返信いたします。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button onClick={onClose} className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
