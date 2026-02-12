import React from 'react';
import {
    Info, FileType, Plus, Copy, Trash2, FileText
} from 'lucide-react';
import { InvoiceData, TaxRate, LineItem } from '../../../types';

interface ItemsTabProps {
    invoiceData: InvoiceData;
    setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
    documentTitles: string[];
    unitSuggestions: string[];
    duplicateItem: (item: LineItem) => void;
}

const ItemsTab: React.FC<ItemsTabProps> = ({
    invoiceData,
    setInvoiceData,
    documentTitles,
    unitSuggestions,
    duplicateItem
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-slate-800 font-black text-xs uppercase tracking-widest flex items-center gap-2"><Info size={14} className="text-indigo-600" /> 請求基本情報</div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase tracking-tighter">書類種別</label>
                    <div className="relative">
                        <FileType className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select
                            className="w-full pl-9 pr-4 py-2 text-sm font-black border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                            value={invoiceData.title}
                            onChange={e => setInvoiceData(d => ({ ...d, title: e.target.value }))}
                        >
                            {documentTitles.map(title => (
                                <option key={title} value={title}>{title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase tracking-tighter">請求番号</label>
                    <input className="w-full text-sm font-bold border-none focus:ring-0 p-0 bg-white" value={invoiceData.invoiceNumber} onChange={e => setInvoiceData(d => ({ ...d, invoiceNumber: e.target.value }))} placeholder="INV-2024-001" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase tracking-tighter">発行日</label>
                        <input type="date" className="w-full text-xs font-bold border-none focus:ring-0 p-0 bg-white" value={invoiceData.date} onChange={e => setInvoiceData(d => ({ ...d, date: e.target.value }))} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase tracking-tighter">支払期限</label>
                        <input type="date" className="w-full text-xs font-bold border-none focus:ring-0 p-0 bg-white" value={invoiceData.dueDate} onChange={e => setInvoiceData(d => ({ ...d, dueDate: e.target.value }))} />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-3xl shadow-xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-indigo-300 font-black text-[10px] uppercase tracking-widest">
                        <Plus size={14} /> スマート明細入力 (Beta)
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                            placeholder="例: サイト制作費 150000 1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = e.currentTarget.value.trim();
                                    if (!val) return;

                                    // Parse logic: Name Price [Qty] [Unit]
                                    // Regex to find the last numbers
                                    const parts = val.split(/\s+/);
                                    let price = 0;
                                    let qty = 1;
                                    let name = val;
                                    let unit = '式';

                                    // Try to find numbers from the end
                                    if (parts.length >= 2) {
                                        const last = parts[parts.length - 1];
                                        const secondLast = parts[parts.length - 2];

                                        if (!isNaN(Number(last))) {
                                            // Case: Name Price
                                            if (parts.length === 2) {
                                                price = Number(last);
                                                name = parts[0];
                                            }
                                            // Case: Name Price Qty
                                            else if (!isNaN(Number(secondLast))) {
                                                qty = Number(last);
                                                price = Number(secondLast);
                                                name = parts.slice(0, parts.length - 2).join(' ');
                                            }
                                            // Case: Name Price (Qty=1)
                                            else {
                                                price = Number(last);
                                                name = parts.slice(0, parts.length - 1).join(' ');
                                            }
                                        }
                                    }

                                    if (price > 0) {
                                        setInvoiceData(d => ({
                                            ...d,
                                            items: [...d.items, {
                                                id: Math.random().toString(),
                                                description: name,
                                                quantity: qty,
                                                unitPrice: price,
                                                unit: unit,
                                                taxRate: TaxRate.STANDARD
                                            }]
                                        }));
                                        e.currentTarget.value = '';
                                        // Optional: toast success
                                    }
                                }
                            }}
                        />
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold ml-1">
                        使い方のヒント: <span className="text-slate-300">"品名 単価 [数量]"</span> を入力してEnter
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2 text-xs font-black uppercase text-slate-800 tracking-widest">
                    <span>明細項目</span>
                    <span className="text-[10px] text-slate-400 font-bold">{invoiceData.items.length}件</span>
                </div>
                {invoiceData.items.map((item, idx) => (
                    <div key={item.id} className="p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-200 transition-all group relative shadow-sm">
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                            <button onClick={() => duplicateItem(item)} className="bg-white text-indigo-400 hover:text-indigo-600 shadow-md p-1.5 rounded-full border" title="複製"><Copy size={16} /></button>
                            <button onClick={() => setInvoiceData(d => ({ ...d, items: d.items.filter(i => i.id !== item.id) }))} className="bg-white text-slate-300 hover:text-red-500 shadow-md p-1.5 rounded-full border" title="削除"><Trash2 size={16} /></button>
                        </div>
                        <div className="mb-4">
                            <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">内容 #{idx + 1}</label>
                            <input className="w-full text-sm font-black text-slate-700 border-none p-0 focus:ring-0 bg-white" value={item.description} onChange={e => setInvoiceData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i) }))} placeholder="Web制作・コンサルティング費" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <label className="text-[8px] font-black text-slate-400 block mb-0.5">数量</label>
                                <input type="number" className="w-full bg-transparent text-sm font-bold border-none p-0 focus:ring-0" value={item.quantity} onChange={e => setInvoiceData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? { ...i, quantity: parseFloat(e.target.value) || 0 } : i) }))} />
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <label className="text-[8px] font-black text-slate-400 block mb-0.5">単価 (円)</label>
                                <input type="number" className="w-full bg-transparent text-sm font-bold border-none p-0 focus:ring-0" value={item.unitPrice} onChange={e => setInvoiceData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? { ...i, unitPrice: parseInt(e.target.value) || 0 } : i) }))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <label className="text-[8px] font-black text-slate-400 block mb-1 uppercase">単位</label>
                                <input className="w-full bg-transparent text-[10px] font-black border-none p-0 focus:ring-0" value={item.unit} onChange={e => setInvoiceData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? { ...i, unit: e.target.value } : i) }))} />
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                    {unitSuggestions.map(u => (
                                        <button key={u} onClick={() => setInvoiceData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? { ...i, unit: u } : i) }))} className="text-[8px] font-bold bg-white border border-slate-100 px-1.5 py-0.5 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors">{u}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <label className="text-[8px] font-black text-slate-400 block mb-1 uppercase">消費税率</label>
                                <select className="w-full bg-transparent text-[10px] font-black border-none p-0 focus:ring-0 appearance-none" value={item.taxRate} onChange={e => setInvoiceData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? { ...i, taxRate: parseFloat(e.target.value) } : i) }))}>
                                    <option value={TaxRate.STANDARD}>標準 10%</option><option value={TaxRate.REDUCED}>軽減 8%</option><option value={TaxRate.EXEMPT}>非課税</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={() => setInvoiceData(d => ({ ...d, items: [...d.items, { id: Math.random().toString(), description: '', quantity: 1, unitPrice: 0, unit: '式', taxRate: TaxRate.STANDARD }] }))} className="w-full py-5 bg-indigo-600 text-white rounded-3xl shadow-xl hover:bg-indigo-700 transition-all font-black text-xs flex justify-center items-center gap-3 active:scale-[0.98]">
                    <Plus size={18} strokeWidth={4} /> 新しい明細を追加
                </button>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 mb-2 text-slate-800 font-black text-xs uppercase tracking-widest"><FileText size={14} className="text-indigo-600" /> 備考</div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <textarea className="w-full text-sm font-bold border-none p-0 h-24 resize-none bg-white focus:ring-0" placeholder="振込手数料は貴社負担にて..." value={invoiceData.notes} onChange={e => setInvoiceData(d => ({ ...d, notes: e.target.value }))} />
                </div>
            </div>
        </div>
    );
};

export default ItemsTab;
