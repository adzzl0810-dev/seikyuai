import React from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 border-4 border-slate-900">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 p-2 rounded-xl shadow-lg shadow-red-500/20">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none mb-1">利用規約・免責事項</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Legal Terms & Disclaimer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-10 overflow-y-auto custom-scrollbar leading-relaxed">
          <div className="bg-red-50 p-8 rounded-[2rem] border-2 border-red-100 mb-10">
            <h3 className="text-red-800 font-black text-lg mb-4 flex items-center gap-3">
              <AlertTriangle size={24} />
              重要：免責事項の確認
            </h3>
            <div className="space-y-4 text-red-900/80 text-sm font-bold">
              <p>
                本サービス「Seikyu AI」をご利用いただくにあたり、以下の事項に同意したものとみなされます。
              </p>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <span className="text-red-900">法的責任の不保持:</span> 
                  本サービスを通じて作成された請求書の内容に関して、運営者はその正確性、完全性、適法性について<strong>一切の保証を行わず、いかなる責任も負いません。</strong>
                </li>
                <li>
                  <span className="text-red-900">インボイス制度への対応:</span> 
                  本サービスはインボイス制度に準拠したフォーマットを提供しますが、入力内容（登録番号の有効性や税計算の正確性等）の最終確認は利用者の責任において行ってください。
                </li>
                <li>
                  <span className="text-red-900">損害賠償の拒否:</span> 
                  本サービスの利用により利用者に生じた直接的、間接的、付随的損害（利益の損失、ビジネスの中断、税務上の問題等）について、運営者は理由の如何を問わず一切賠償いたしません。
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-10 text-slate-700">
            <section>
              <h4 className="font-black text-slate-900 mb-4 text-lg border-b-2 border-slate-100 pb-2">1. サービスの目的</h4>
              <p className="text-sm font-medium opacity-80">
                本サービスはAIとブラウザの技術を活用し、請求書作成の手間を軽減するための「ツール」です。会計業務や税務相談、法的文書の保証を提供するものではありません。
              </p>
            </section>

            <section>
              <h4 className="font-black text-slate-900 mb-4 text-lg border-b-2 border-slate-100 pb-2">2. データの管理</h4>
              <p className="text-sm font-medium opacity-80">
                本サービスはサーバーにデータを送信せず、利用者のブラウザ（Local Storage）にのみ情報を保存します。ブラウザのキャッシュクリアや端末の紛失によりデータが消失した場合、復旧は不可能です。
              </p>
            </section>

            <section>
              <h4 className="font-black text-slate-900 mb-4 text-lg border-b-2 border-slate-100 pb-2">3. 禁止事項</h4>
              <p className="text-sm font-medium opacity-80 mb-3">利用者は以下の行為を禁止されます：</p>
              <ul className="grid grid-cols-1 gap-2 text-xs font-bold text-slate-500">
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5"/> 虚偽の情報に基づく不当な請求書の作成</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5"/> サーバーへの攻撃およびリバースエンジニアリング</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5"/> 他のユーザーのPINコードを推測する試み</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">By closing, you agree to these terms.</p>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            承諾して閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
