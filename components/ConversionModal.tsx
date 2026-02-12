import React from 'react';
import { X, Copy, FileText, FileCheck, Truck, Receipt } from 'lucide-react';

interface ConversionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConvert: (title: string) => void;
    currentTitle: string;
}

export const ConversionModal: React.FC<ConversionModalProps> = ({ isOpen, onClose, onConvert, currentTitle }) => {
    if (!isOpen) return null;

    const options = [
        { label: '御請求書', icon: <FileText size={20} />, color: 'bg-indigo-100 text-indigo-600' },
        { label: '御見積書', icon: <Copy size={20} />, color: 'bg-emerald-100 text-emerald-600' },
        { label: '納品書', icon: <Truck size={20} />, color: 'bg-blue-100 text-blue-600' },
        { label: '領収書', icon: <Receipt size={20} />, color: 'bg-orange-100 text-orange-600' },
        { label: '検収書', icon: <FileCheck size={20} />, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-black text-slate-800">書類を変換・複製</h3>
                        <p className="text-xs text-slate-500 font-bold mt-1">現在のデータを元に新しい書類を作成します</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 grid gap-3">
                    {options.map((option) => (
                        <button
                            key={option.label}
                            onClick={() => {
                                onConvert(option.label);
                                onClose();
                            }}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${currentTitle === option.label
                                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-2'
                                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`p-3 rounded-xl ${option.color}`}>
                                {option.icon}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className={`font-black ${currentTitle === option.label ? 'text-indigo-900' : 'text-slate-700'}`}>
                                    {option.label}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">として複製作成</span>
                            </div>
                            {currentTitle === option.label && (
                                <span className="ml-auto text-[10px] font-black bg-indigo-600 text-white px-2 py-1 rounded-full">CURRENT</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
