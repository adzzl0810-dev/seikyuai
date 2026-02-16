import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { AdUnit } from '../../components/AdUnit';
import { articles } from '../../data/articles';
import ReactMarkdown from 'react-markdown';
import { SEO } from '../../components/SEO';

export const ArticleView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const article = articles.find(a => a.id === id);

    if (!article) {
        return (
            <Layout>
                <div className="w-full min-h-screen flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">記事が見つかりません</h1>
                    <Link to="/column" className="text-indigo-600 hover:underline">コラム一覧に戻る</Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO
                title={article.title}
                description={article.description}
                path={`/column/${article.id}`}
            />
            <div className="w-full max-w-4xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link to="/column" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-bold">
                    <ArrowLeft size={18} /> コラム一覧に戻る
                </Link>

                <article className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 overflow-hidden">
                    <div className="relative h-64 md:h-96 w-full overflow-hidden">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="inline-block px-3 py-1 bg-indigo-500/80 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-indigo-400/50">
                                {article.category}
                            </span>
                            <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2 tracking-tight">
                                {article.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                                <span className="flex items-center gap-1"><Clock size={16} /> {article.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-img:rounded-3xl prose-strong:text-slate-900">
                            <ReactMarkdown>{article.content}</ReactMarkdown>
                        </div>

                        {/* Article Footer / Share */}
                        <div className="mt-12 pt-12 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-slate-400 font-bold text-sm">シェアする</span>
                                <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-600">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Ad Unit after article */}
                <div className="mt-12 bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-200">
                    <AdUnit slot="9876543210" format="horizontal" responsive={true} />
                </div>
            </div>
        </Layout>
    );
};
