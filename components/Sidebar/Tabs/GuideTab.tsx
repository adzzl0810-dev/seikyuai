import React from 'react';
import { BookOpen, Stamp, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

interface GuideTabProps {
    setActiveTab: (tab: 'items' | 'client' | 'issuer' | 'settings' | 'guide') => void;
}

const GuideTab: React.FC<GuideTabProps> = ({ setActiveTab }) => {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="p-8 bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><BookOpen size={24} /></div>
                    <div>
                        <h2 className="font-black text-lg text-slate-800 tracking-tighter leading-none">使い方ガイド</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How to use</span>
                    </div>
                </div>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-slate-100 before:-z-10">
                    {/* Step 1: 入力 */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg shrink-0 z-10">1</div>
                        <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <h3 className="font-black text-slate-800 mb-2">情報の入力</h3>
                            <p className="text-xs text-slate-500 font-bold leading-relaxed mb-2">
                                「明細」「宛先」「自社」タブを切り替えて入力します。
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] bg-white border px-2 py-1 rounded text-slate-400">適格番号(T)対応</span>
                                <span className="text-[10px] bg-white border px-2 py-1 rounded text-slate-400">税率自動計算</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: 印鑑 (New Focus) */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-red-500 text-red-500 flex items-center justify-center font-black text-lg shadow-sm shrink-0 z-10">2</div>
                        <div className="flex-1 bg-red-50/50 rounded-2xl p-5 border border-red-100">
                            <h3 className="font-black text-red-900 mb-2 flex items-center gap-2"><Stamp size={14} /> 電子印鑑の設定</h3>
                            <p className="text-xs text-red-800/70 font-bold leading-relaxed mb-3">
                                「自社」タブの一番下に設定があります。
                            </p>
                            <ul className="text-[10px] font-bold text-red-700 space-y-1 list-disc pl-4">
                                <li>画像をアップロード（背景透過PNG推奨）</li>
                                <li>画像がない場合は自動で生成されます</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 3: デザイン */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-lg shadow-sm shrink-0 z-10">3</div>
                        <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <h3 className="font-black text-slate-800 mb-2">デザイン選択</h3>
                            <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                「デザイン」タブでテンプレートや色を変更。プレビューを見ながら調整できます。
                            </p>
                        </div>
                    </div>

                    {/* Step 4: ダウンロード (New Focus) */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-indigo-200 shadow-xl shrink-0 z-10">4</div>
                        <div className="flex-1 bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100">
                            <h3 className="font-black text-indigo-900 mb-2 flex items-center gap-2"><Download size={14} /> PDF発行</h3>
                            <p className="text-xs text-indigo-800/70 font-bold leading-relaxed mb-4">
                                プレビュー画面の右上（スマホは画面右上）にあるダウンロードボタンを押して保存します。
                            </p>
                            <button onClick={() => setActiveTab('items')} className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-xs font-black shadow-lg shadow-indigo-200 active:scale-95 transition-all w-full flex justify-center items-center gap-2 hover:bg-indigo-700">
                                作成を開始する <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex items-center gap-4">
                <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600"><CheckCircle2 size={24} /></div>
                <div>
                    <h3 className="font-black text-slate-800 text-sm mb-1">データは自動保存されます</h3>
                    <p className="text-[10px] text-slate-400 font-bold">ブラウザを閉じても、次回アクセス時に続きから再開できます。</p>
                </div>
            </div>
        </div>
    );
};

export default GuideTab;
