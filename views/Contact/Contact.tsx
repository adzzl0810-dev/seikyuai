import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { SEO } from '../../components/SEO';

export const Contact: React.FC = () => {
    return (
        <Layout>
            <SEO title="お問い合わせ・運営者情報" description="Seikyu AIに関するお問い合わせはこちらから。" />
            <div className="w-full max-w-3xl mx-auto px-6 py-24">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 p-8 md:p-12 text-center">
                    <h1 className="text-3xl font-black text-slate-900 mb-8">お問い合わせ</h1>

                    <p className="text-slate-600 mb-12 leading-relaxed">
                        Seikyu AIをご利用いただきありがとうございます。<br />
                        機能へのご要望、バグ報告、その他ご質問等がございましたら、<br />
                        以下のフォームよりお気軽にお問い合わせください。
                    </p>

                    <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSd6pWwyLFvgZV_ThJ1II0gBEPNz-yqwOo3BVF6fppvkkPDmvA/viewform?usp=header"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-indigo-300 transition-all group"
                        >
                            <div className="bg-white p-3 rounded-full shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                                <MessageSquare size={24} />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-slate-400 uppercase">Google Form</div>
                                <div className="font-bold text-slate-800">お問い合わせフォーム</div>
                            </div>
                        </a>

                        {/* 
                        <a 
                            href="mailto:support@example.com" 
                            className="flex items-center justify-center gap-3 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-indigo-300 transition-all group"
                        >
                            <div className="bg-white p-3 rounded-full shadow-sm text-green-500 group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-slate-400 uppercase">Email</div>
                                <div className="font-bold text-slate-800">メールでのお問い合わせ</div>
                            </div>
                        </a>
                        */}
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100">
                        <h2 className="text-lg font-black text-slate-800 mb-4">運営者情報</h2>
                        <div className="text-sm text-slate-500 font-medium">
                            <p>Seikyu AI 運営事務局</p>
                            <p>代表開発者: Akihiro Douke</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
