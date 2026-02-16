import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { BookOpen, FileText, Printer, CheckCircle, HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';

export const Guide: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const steps = [
        {
            icon: <FileText size={24} />,
            title: "1. 必要な情報を入力",
            desc: "「明細入力」「宛先」「自社」タブに必要な情報を入力します。自動計算機能により、小計や消費税はリアルタイムで反映されます。"
        },
        {
            icon: <CheckCircle size={24} />,
            title: "2. デザインを選択",
            desc: "「デザイン」タブから、ビジネスの雰囲気に合ったテンプレートを選びます。カラーテーマも自由に変更可能です。"
        },
        {
            icon: <Printer size={24} />,
            title: "3. PDFをダウンロード",
            desc: "プレビューで内容を確認し、「PDFをダウンロード」ボタンをクリック。高品質なPDFファイルが即座に生成されます。"
        }
    ];

    const faqs = [
        { q: "無料で使えますか？", a: "はい、すべての機能を完全無料でご利用いただけます。クレジットカード登録なども一切不要です。" },
        { q: "スマホでも使えますか？", a: "はい、スマートフォンやタブレットにも最適化されています。外出先でもすぐに請求書を作成・送信できます。" },
        { q: "インボイス制度に対応していますか？", a: "はい、適格請求書発行事業者の登録番号入力や、税率ごとの区分記載など、インボイス制度の要件を完全に満たしています。" },
        { q: "データは保存されますか？", a: "入力データはお使いのブラウザ（ローカルストレージ）にのみ保存され、サーバーには送信されません。セキュリティ面でも安心してご利用いただけます。" }
    ];

    return (
        <Layout>
            <div className="w-full flex-1 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100">
                            <BookOpen size={14} /> User Manual
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">使い方ガイド</h1>
                        <p className="text-slate-600 font-medium">Seikyu AIの基本的な使い方と、よくある質問をまとめました。</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {steps.map((step, i) => (
                            <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="absolute -right-4 -top-4 text-[10rem] font-black text-slate-100/50 -z-10 select-none group-hover:text-indigo-100/50 transition-colors">{i + 1}</div>
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-md mb-6">{step.icon}</div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/60 backdrop-blur-lg rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-sm mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <HelpCircle className="text-indigo-600" size={28} />
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">よくある質問</h2>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="border border-slate-100 rounded-2xl bg-white/50 overflow-hidden transition-all">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="flex items-start gap-4">
                                            <span className="text-indigo-600 font-black">Q.</span>
                                            {faq.q}
                                        </span>
                                        {openFaq === i ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="p-5 pt-0 text-sm text-slate-600 font-medium leading-relaxed pl-12 border-t border-slate-50">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
