import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Star, LayoutTemplate, FileText } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { AdUnit } from '../../components/AdUnit';

import { SEO } from '../../components/SEO';

export const Home: React.FC = () => {
    return (
        <Layout>
            <SEO />
            <div className="w-full flex-1 flex flex-col items-center">
                {/* Hero Section */}
                <section className="w-full relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-indigo-900 text-xs font-black uppercase tracking-widest shadow-sm">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                v2.0 Major Update
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                                <span className="block mb-2">請求書作成を、</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">もっと美しく、<br />もっと自由に。</span>
                            </h1>
                            <p className="text-lg text-slate-600 font-bold leading-relaxed max-w-xl">
                                登録不要・完全無料。インボイス制度に対応したプロ仕様の請求書を、ブラウザだけで瞬時に作成。
                                洗練された20種類以上のテンプレートで、あなたのビジネスをよりスマートに。
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link to="/editor" className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black hover:bg-black transition-all hover:scale-105 shadow-2xl shadow-indigo-500/30 group">
                                    今すぐ作る <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/templates" className="inline-flex items-center justify-center gap-3 bg-white/60 backdrop-blur-md text-slate-900 border border-white/60 px-8 py-5 rounded-[2rem] font-black hover:bg-white transition-all hover:shadow-xl">
                                    テンプレートを見る
                                </Link>
                            </div>
                            <div className="flex items-center gap-6 text-xs font-bold text-slate-500 pt-4">
                                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> 登録不要</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> 完全無料</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> インボイス対応</span>
                            </div>
                        </div>
                        <div className="relative group perspective-1000">
                            <div className="absolute -inset-20 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-[100px] rounded-full"></div>
                            <div className="relative z-10 transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6">
                                <img
                                    src="/hero-dashboard.png"
                                    alt="SeikyuAI Dashboard"
                                    className="w-full h-auto rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] border border-white/40 ring-1 ring-white/50 backdrop-blur-sm"
                                />
                                {/* Floating UI Elements */}
                                <div className="absolute -top-10 -right-10 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/60 animate-bounce-slow hidden lg:block">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600"><FileText size={24} /></div>
                                        <div>
                                            <div className="text-xs font-black text-slate-400 uppercase">Total</div>
                                            <div className="text-xl font-black text-slate-900">¥ 1,280,000</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -left-10 bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 animate-bounce-slow delay-700 hidden lg:block">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-500/20 rounded-2xl text-green-400"><ShieldCheck size={24} /></div>
                                        <div>
                                            <div className="text-xs font-black text-slate-400 uppercase">Status</div>
                                            <div className="text-sm font-black text-white">インボイス登録済み</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ad Section */}
                <div className="w-full max-w-4xl px-6 mb-32 z-10 relative">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent blur-xl rounded-3xl"></div>
                        <AdUnit
                            slot="1234567890"
                            format="horizontal"
                            responsive={true}
                            className="min-h-[120px] bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 flex items-center justify-center text-slate-300 relative z-10"
                        />
                    </div>
                </div>

                {/* Features Grid */}
                <section id="features" className="w-full max-w-7xl px-6 pb-32">
                    <div className="text-center mb-20">
                        <span className="text-indigo-600 font-black tracking-widest uppercase text-xs mb-3 block">Why Seikyu AI?</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">選ばれる3つの理由</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group p-10 bg-white/60 backdrop-blur-lg rounded-[3rem] shadow-sm border border-white/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform"><Zap size={32} /></div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">爆速作成</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                面倒な登録、ログイン、課金フローは一切ナシ。<br />ブラウザを開いて30秒で、プロフェッショナルな請求書が完成します。
                            </p>
                        </div>
                        <div className="group p-10 bg-white/60 backdrop-blur-lg rounded-[3rem] shadow-sm border border-white/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform"><ShieldCheck size={32} /></div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">インボイス完全対応</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                適格請求書発行事業者の登録番号チェックや、8%・10%の税率計算など、複雑な日本の法制度に完全準拠しています。
                            </p>
                        </div>
                        <div className="group p-10 bg-white/60 backdrop-blur-lg rounded-[3rem] shadow-sm border border-white/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-transform"><LayoutTemplate size={32} /></div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">多彩なデザイン</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                シンプル、モダン、そして遊び心まで。<br />20種類以上の高品質テンプレートで、ブランドイメージに合った請求書を。
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};
