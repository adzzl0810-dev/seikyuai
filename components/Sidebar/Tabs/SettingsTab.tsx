import React from 'react';
import { Palette, LayoutTemplate } from 'lucide-react';
import { TemplateId } from '../../../types';

interface SettingsTabProps {
    themeColor: string;
    setThemeColor: (color: string) => void;
    template: TemplateId;
    setTemplate: (template: TemplateId) => void;
    templates: { id: TemplateId, label: string }[];
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    themeColor,
    setThemeColor,
    template,
    setTemplate,
    templates
}) => {
    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="p-8 bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Palette size={24} /></div>
                    <span className="font-black text-lg text-slate-800 tracking-tighter">デザイン設定</span>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ブランドカラー</label>
                    <div className="grid grid-cols-7 gap-2">
                        {['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#000000'].map(c => (
                            <button
                                key={c}
                                onClick={() => setThemeColor(c)}
                                className={`w-full aspect-square rounded-xl border-4 transition-all ${themeColor === c ? 'border-white ring-4 ring-indigo-100 scale-110 shadow-lg' : 'border-transparent opacity-80'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">20種類のテンプレート</label>
                    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                        {templates.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTemplate(t.id)}
                                className={`group py-5 px-4 rounded-3xl border-2 text-[11px] font-black transition-all flex flex-col items-center gap-2 ${template === t.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-slate-50 text-slate-400 border-slate-50 hover:bg-white hover:text-indigo-600'}`}
                            >
                                <LayoutTemplate size={18} className={template === t.id ? 'text-indigo-400' : 'text-slate-200'} />
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
