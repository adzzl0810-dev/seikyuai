import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, LayoutTemplate, Palette, Zap } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { AdUnit } from '../../components/AdUnit';

// Mock Invoice Preview Component
const MiniInvoicePreview: React.FC<{ color: string; style: string }> = ({ color, style }) => {
    // Generate color classes based on the prop
    const getColorClass = (c: string) => {
        switch (c) {
            case 'indigo': return 'bg-indigo-600';
            case 'blue': return 'bg-blue-600';
            case 'green': return 'bg-emerald-600';
            case 'purple': return 'bg-purple-600';
            case 'gray': return 'bg-slate-600';
            default: return 'bg-indigo-600';
        }
    };
    const getLightColorClass = (c: string) => {
        switch (c) {
            case 'indigo': return 'bg-indigo-50 text-indigo-600';
            case 'blue': return 'bg-blue-50 text-blue-600';
            case 'green': return 'bg-emerald-50 text-emerald-600';
            case 'purple': return 'bg-purple-50 text-purple-600';
            case 'gray': return 'bg-slate-100 text-slate-600';
            default: return 'bg-indigo-50 text-indigo-600';
        }
    };

    const bgClass = getColorClass(color);
    const lightClass = getLightColorClass(color);

    return (
        <div className="w-full h-full bg-white relative overflow-hidden flex flex-col shadow-inner">
            {/* Header Area */}
            <div className={`h-16 w-full ${style === 'simple' ? 'border-b-4 border-slate-100' : bgClass} flex items-center px-4 relative`}>
                {style === 'modern' && <div className="absolute top-0 right-0 w-24 h-full bg-white/20 skew-x-12"></div>}
                <div className={`w-8 h-8 rounded-lg ${style === 'simple' ? bgClass : 'bg-white/20'} mr-auto`}></div>
                <div className={`w-20 h-2 rounded ${style === 'simple' ? 'bg-slate-200' : 'bg-white/40'}`}></div>
            </div>

            {/* Body Area */}
            <div className="flex-1 p-4 flex flex-col gap-2">
                <div className="flex justify-between mb-2">
                    <div className="w-16 h-8 bg-slate-100 rounded"></div>
                    <div className="w-16 h-8 bg-slate-100 rounded"></div>
                </div>

                {/* Table Header */}
                <div className={`w-full h-4 ${style === 'modern' ? lightClass : 'bg-slate-100'} rounded-sm mb-1`}></div>

                {/* Table Rows */}
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-1 mb-1">
                        <div className="flex-1 h-3 bg-slate-50 rounded-sm"></div>
                        <div className="w-8 h-3 bg-slate-50 rounded-sm"></div>
                        <div className="w-8 h-3 bg-slate-50 rounded-sm"></div>
                    </div>
                ))}

                {/* Total Area */}
                <div className="mt-auto ml-auto px-4 py-2 border-t border-slate-100 w-1/2">
                    <div className="flex justify-between items-center">
                        <div className="w-8 h-2 bg-slate-200 rounded"></div>
                        <div className={`w-12 h-4 ${bgClass} rounded opacity-80`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TemplateGallery: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const templates = [
        { id: 'standard', name: 'スタンダード', style: 'simple', color: 'indigo', tag: '定番', desc: '最も基本的で使いやすいデザイン。' },
        { id: 'modern-blue', name: 'モダンブルー', style: 'modern', color: 'blue', tag: '人気', desc: '信頼感のある青を基調とした現代的なデザイン。' },
        { id: 'creative-purple', name: 'クリエイティブ', style: 'modern', color: 'purple', tag: '個性的', desc: 'デザイン・IT業界におすすめの配色。' },
        { id: 'eco-green', name: 'エコロジー', style: 'simple', color: 'green', tag: '安心感', desc: '環境・自然をイメージさせる優しい緑。' },
        { id: 'monochrome', name: 'モノクローム', style: 'simple', color: 'gray', tag: 'シンプル', desc: 'インク節約にもなるミニマルな白黒。' },
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.style === (selectedCategory === 'modern' ? 'modern' : 'simple'));

    return (
        <Layout>
            <div className="w-full max-w-7xl mx-auto px-6 py-24 animate-in fade-in duration-700">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 font-black text-xs uppercase tracking-wide mb-6 animate-bounce-slow">
                        <Palette size={14} /> Design Gallery
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        請求書も、<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">あなたらしく。</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        ビジネスのシーンや好みに合わせて選べる多彩なテンプレート。<br />
                        クリックするだけで、作成中の請求書に即座に反映されます。
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex justify-center gap-4 mb-16">
                    {['all', 'simple', 'modern'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${selectedCategory === cat
                                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {cat === 'all' ? 'すべて' : cat === 'simple' ? 'シンプル' : 'モダン'}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                            {/* Template Preview Area */}
                            <div className="aspect-[210/297] bg-slate-50 rounded-[1.5rem] mb-6 overflow-hidden relative border border-slate-100 shadow-inner group-hover:shadow-md transition-shadow">
                                <div className="absolute inset-4 bg-white shadow-sm rounded-xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                                    <MiniInvoicePreview color={template.color} style={template.style} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{template.name}</h3>
                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                                        {template.tag}
                                    </span>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${template.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : template.color === 'blue' ? 'bg-blue-100 text-blue-600' : template.color === 'green' ? 'bg-emerald-100 text-emerald-600' : template.color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-600'}`}>
                                    <Zap size={16} fill="currentColor" />
                                </div>
                            </div>

                            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 h-10">
                                {template.desc}
                            </p>

                            <button
                                onClick={() => navigate(`/editor?template=${template.id}`)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 group-hover:scale-[1.02]"
                            >
                                このデザインで作る <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Ad Unit */}
                <div className="w-full bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Sponsored</p>
                    <AdUnit slot="1234567890" format="horizontal" responsive={true} />
                </div>
            </div>
        </Layout>
    );
};
