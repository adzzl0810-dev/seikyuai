import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Star, Copy, Download, Mail, ExternalLink, Check } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { AdUnit } from '../../components/AdUnit';
import { loadDraft } from '../../services/storageService';

export const DownloadComplete: React.FC = () => {
    const [emailData, setEmailData] = useState({ subject: '', body: '' });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const draft = loadDraft();
        if (draft) {
            const subject = `【請求書送付のご案内】${draft.title} (${draft.issuer.name})`;
            const body = `${draft.client.name} 御中\n\nお世話になっております。\n${draft.issuer.name}です。\n\n表題の件、${draft.title}を送付させていただきます。\nご査収のほど、よろしくお願い申し上げます。\n\n--------------------------------------------------\n請求金額：¥${draft.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString()} (税込)\nお支払い期限：${draft.dueDate}\n--------------------------------------------------\n\nご不明な点がございましたら、お気軽にお問い合わせください。\n今後ともよろしくお願い申し上げます。\n\n==================================================\n${draft.issuer.name}\n${draft.issuer.email ? `Email: ${draft.issuer.email}\n` : ''}${draft.issuer.phone ? `Tel: ${draft.issuer.phone}\n` : ''}==================================================`;
            setEmailData({ subject, body });
        }
    }, []);

    const handleCopyEmail = () => {
        const text = `件名：${emailData.subject}\n\n${emailData.body}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <Layout>
            <div className="w-full flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6">

                <div className="w-full max-w-2xl bg-white/60 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-white/60 text-center relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"></div>
                    <div className="absolute -inset-10 bg-indigo-500/5 blur-3xl -z-10 rounded-full group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>

                    <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30 animate-bounce-slow">
                        <CheckCircle2 size={48} strokeWidth={3} />
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 tracking-tight">ダウンロードが完了しました</h1>
                    <p className="text-slate-600 font-medium mb-12 text-lg leading-relaxed">
                        ご利用ありがとうございます。<br />
                        作成した請求書は、ブラウザの「履歴」からいつでも再編集・複製が可能です。
                    </p>

                    {/* Smart Email Template Section */}
                    <div className="bg-slate-50 rounded-3xl p-8 mb-12 text-left border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Mail size={20} /></div>
                            <h3 className="font-black text-slate-800 text-lg">スマートメールテンプレート</h3>
                            <span className="ml-auto text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">Auto Generated</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">件名</label>
                                <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 select-all">
                                    {emailData.subject || '（請求書データから自動生成されます）'}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">本文</label>
                                <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-600 whitespace-pre-wrap select-all h-32 overflow-y-auto custom-scrollbar">
                                    {emailData.body || '（請求書データから自動生成されます）'}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleCopyEmail}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'コピーしました' : '全文をコピー'}
                                </button>
                                <a
                                    href={`mailto:?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`}
                                    className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                    <ExternalLink size={18} /> メーラー起動
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* High Value Ad Area (Rectangle) */}
                    <div className="w-full min-h-[250px] bg-white/50 backdrop-blur-md rounded-3xl mb-12 flex items-center justify-center border border-white/50 relative overflow-hidden group/ad">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/ad:opacity-100 transition-opacity"></div>
                        <AdUnit slot="5678901234" format="rectangle" responsive={true} className="relative z-10" />
                        <div className="absolute bottom-2 right-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Sponsored</div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link to="/editor" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-full font-black hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                            <Copy size={20} /> 続けて作成する
                        </Link>
                        <Link to="/" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-full font-black hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
                            トップへ戻る
                        </Link>
                    </div>

                </div>

                <div className="mt-16 text-center max-w-4xl mx-auto w-full">
                    <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
                        <div className="h-px bg-slate-300 w-12"></div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Recommended Services</p>
                        <div className="h-px bg-slate-300 w-12"></div>
                    </div>
                </div>

            </div>
        </Layout>
    );
};
