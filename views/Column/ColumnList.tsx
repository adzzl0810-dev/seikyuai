import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, TrendingUp, ShieldCheck } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { AdUnit } from '../../components/AdUnit';
import { articles } from '../../data/articles';

export const ColumnList: React.FC = () => {
    // Placeholder articles - in a real app these would come from a CMS or markdown files


    return (
        <Layout>
            <div className="w-full flex-1 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100">
                            <BookOpen size={14} /> Knowledge Base
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">お役立ちコラム</h1>
                        <p className="text-slate-600 font-medium max-w-2xl mx-auto">
                            請求書作成や経理業務に役立つ情報を発信しています。<br />インボイス制度や電子帳簿保存法など、最新の法改正情報もチェックできます。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {articles.map((article) => (
                            <Link
                                to={`/column/${article.id}`}
                                key={article.id}
                                className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/60 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="h-48 rounded-3xl bg-slate-100 mb-6 overflow-hidden relative">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-indigo-600 shadow-sm">
                                        {article.category}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-slate-400 mb-3">{article.date}</div>
                                    <h3 className="text-xl font-black text-slate-800 mb-3 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                                        {article.description}
                                    </p>
                                    <div className="mt-auto flex items-center text-indigo-600 font-bold text-sm">
                                        Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
