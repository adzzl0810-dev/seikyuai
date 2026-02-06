
import React from 'react';
import { X, Palette, ShieldCheck, Stamp, Save, Download, Info, CheckCircle2, HelpCircle, Lightbulb, Zap, ShieldQuestion } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      icon: <Palette className="text-indigo-600" size={24} />,
      title: "デザインのカスタマイズ",
      desc: "ブランドに合わせたプロ仕様の見た目へ。",
      details: [
        { label: "テンプレート", text: "モダン、クラシック、シンプルなど20種類から選択可能です。" },
        { label: "ブランドカラー", text: "自社のコーポレートカラーを選択すると、アクセントカラーが一括反映されます。" },
        { label: "プレビュー", text: "入力内容はリアルタイムで右側のプレビューに反映されます。" }
      ]
    },
    {
      icon: <ShieldCheck className="text-green-600" size={24} />,
      title: "インボイス制度完全対応",
      desc: "適格請求書としての要件を自動で満たします。",
      details: [
        { label: "登録番号", text: "自社情報に『T + 13桁』の番号を入力してください。" },
        { label: "税率計算", text: "10%と8%（軽減税率）の合計を分けて自動算出します。" },
        { label: "端数処理", text: "一回のみの消費税計算に対応した、法令に沿った集計を行います。" }
      ]
    },
    {
      icon: <Stamp className="text-red-500" size={24} />,
      title: "電子印影と署名",
      desc: "物理的なハンコなしで法的に有効な形式へ。",
      details: [
        { label: "画像アップ", text: "背景透過PNGの印影画像を推奨します。正方形が最適です。" },
        { label: "簡易印影", text: "画像がない場合、社名から伝統的なスタイルの角印を自動生成します。" }
      ]
    },
    {
      icon: <HelpCircle className="text-orange-500" size={24} />,
      title: "よくある質問 (FAQ)",
      desc: "困ったときはこちらを確認してください。",
      details: [
        { label: "Q. 保存は？", text: "入力内容は自動でブラウザに保存されます。ログインすれば履歴に残ります。" },
        { label: "Q. 料金は？", text: "会員登録不要、完全無料です。維持管理のため広告を表示しています。" },
        { label: "Q. セキュリティ", text: "入力データはサーバーに保存されません。PDF化も端末上で行われます。" }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.2)] w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-200">
        {/* Header */}
        <div className="bg-white p-8 border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <Zap size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-800 leading-none mb-2">Seikyu AI 徹底活用ガイド</h2>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-full">v1.2.0 Professional</span>
                <span className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12}/> インボイス対応済み</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all text-slate-400 hover:text-slate-800 border border-transparent hover:border-slate-100">
            <X size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{section.icon}</div>
                  <h3 className="font-black text-slate-800 text-lg tracking-tight">{section.title}</h3>
                </div>
                <p className="text-xs text-slate-400 font-bold mb-6">{section.desc}</p>
                <div className="space-y-4">
                  {section.details.map((detail, dIdx) => (
                    <div key={dIdx} className="bg-slate-50/50 p-3 rounded-xl border border-transparent hover:border-indigo-100 transition-colors">
                      <div className="text-[10px] font-black text-indigo-500 uppercase mb-1">{detail.label}</div>
                      <div className="text-[11px] font-bold text-slate-600 leading-relaxed">{detail.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips Banner */}
          <div className="mt-10 bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h4 className="text-2xl font-black tracking-tight mb-3 flex items-center gap-3"><Lightbulb className="text-yellow-400"/> プロが教える最速作成テクニック</h4>
                <p className="text-slate-400 text-sm font-bold leading-relaxed">
                  作成履歴から「複製」して内容を少し書き換えるのが一番早いです。<br/>
                  また、ブランドカラーを設定しておくと、PDFの見た目が一気にプロ仕様になります。
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center">
                  <span className="text-[10px] font-black text-slate-300 block mb-1 uppercase tracking-widest">Average creation time</span>
                  <span className="text-3xl font-black text-indigo-400">45 Sec.</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-[-50px] left-[-20px] w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px]"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-6 items-center justify-between shrink-0">
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><ShieldQuestion size={14}/> Privacy First Policy</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14}/> Compliance Verified</span>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-black py-5 px-16 rounded-[1.5rem] shadow-2xl transition-all active:scale-95 hover:-translate-y-1"
          >
            使い始める
          </button>
        </div>
      </div>
    </div>
  );
};
