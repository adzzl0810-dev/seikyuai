import React from 'react';
import { Building, Upload, X, Stamp } from 'lucide-react';
import { InvoiceData } from '../../../types';

import { fetchAddressByZip } from '../../../services/addressService';

interface IssuerTabProps {
    invoiceData: InvoiceData;
    setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
    isRegNumValid: (num: string) => boolean;
    handleStampUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IssuerTab: React.FC<IssuerTabProps> = ({
    invoiceData,
    setInvoiceData,
    isRegNumValid,
    handleStampUpload
}) => {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="p-6 bg-white border-4 border-slate-50 rounded-[3rem] space-y-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Building size={24} /></div>
                    <span className="font-black text-lg text-slate-800 tracking-tighter block">自社情報設定</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl shadow-inner">
                    <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">社名 / 氏名</label>
                    <input className="w-full bg-transparent border-none p-0 font-black text-slate-800 text-base focus:ring-0" placeholder="株式会社サンプル" value={invoiceData.issuer.name} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, name: e.target.value } }))} />
                </div>
                <div className={`p-4 rounded-2xl border-2 shadow-inner ${isRegNumValid(invoiceData.issuer.registrationNumber) ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <label className={`text-[9px] font-black uppercase mb-1 block ${isRegNumValid(invoiceData.issuer.registrationNumber) ? 'text-green-600' : 'text-red-600'}`}>登録番号 (T+13桁)</label>
                    <input className="w-full bg-transparent border-none p-0 font-mono text-slate-800 font-black focus:ring-0" placeholder="T1234567890123" value={invoiceData.issuer.registrationNumber} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, registrationNumber: e.target.value } }))} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl shadow-inner relative">
                        <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">郵便番号</label>
                        <input
                            className="w-full bg-transparent border-none p-0 font-bold text-xs focus:ring-0"
                            placeholder="105-0011"
                            value={invoiceData.issuer.zipCode}
                            onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, zipCode: e.target.value } }))}
                            onBlur={async (e) => {
                                const val = e.target.value;
                                if (val.length >= 7) {
                                    const addr = await fetchAddressByZip(val);
                                    if (addr) {
                                        setInvoiceData(d => ({
                                            ...d,
                                            issuer: { ...d.issuer, address: addr }
                                        }));
                                    }
                                }
                            }}
                        />
                        <div className="absolute top-4 right-4 text-[9px] text-slate-400 font-bold opacity-50">自動入力</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl shadow-inner"><label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">電話番号</label><input className="w-full bg-transparent border-none p-0 font-bold text-xs focus:ring-0" placeholder="03-0000-0000" value={invoiceData.issuer.phone} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, phone: e.target.value } }))} /></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl shadow-inner"><label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">住所</label><textarea className="w-full bg-transparent border-none p-0 h-16 text-xs font-bold resize-none focus:ring-0" placeholder="東京都港区芝公園4丁目2-8" value={invoiceData.issuer.address} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, address: e.target.value } }))} /></div>
                <div className="bg-slate-50 p-4 rounded-2xl shadow-inner"><label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">振込先</label><textarea className="w-full bg-transparent border-none p-0 h-24 text-[10px] font-black resize-none focus:ring-0 leading-relaxed" placeholder="◯◯銀行 ◯◯支店&#10;普通 1234567&#10;カブシキガイシャサンプル" value={invoiceData.issuer.bankInfo} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, bankInfo: e.target.value } }))} /></div>

                <div className="pt-6 border-t border-slate-100">
                    <div className="mb-6">
                        <label className="text-xs font-black text-slate-600 flex items-center gap-3 mb-3"><Upload size={16} className="text-indigo-500" /> 会社ロゴ・アイコン</label>
                        <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 shadow-inner">
                            <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <Upload size={22} className="text-indigo-400 mb-2 group-hover:scale-110" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">ロゴをアップ</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, logoImageUrl: reader.result as string } }));
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                            {invoiceData.issuer.logoImageUrl && (
                                <div className="relative w-20 h-20 bg-white rounded-2xl border-2 border-indigo-100 flex items-center justify-center p-3">
                                    <img src={invoiceData.issuer.logoImageUrl} className="max-w-full max-h-full object-contain" />
                                    <button onClick={() => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, logoImageUrl: undefined } }))} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all"><X size={12} strokeWidth={4} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 px-2">
                        <label className="text-xs font-black text-slate-600 flex items-center gap-3"><Stamp size={20} className="text-red-500" /> 電子印影を表示</label>
                        <div className={`w-14 h-8 rounded-full p-1 transition-all cursor-pointer ${invoiceData.issuer.enableStamp ? 'bg-indigo-600' : 'bg-slate-200'}`} onClick={() => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, enableStamp: !d.issuer.enableStamp } }))}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${invoiceData.issuer.enableStamp ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    {invoiceData.issuer.enableStamp && (
                        <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 shadow-inner">
                            <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <Upload size={22} className="text-indigo-400 mb-2 group-hover:scale-110" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">画像をアップ</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleStampUpload} />
                            </label>
                            {invoiceData.issuer.stampImageUrl && (
                                <div className="relative w-20 h-20 bg-white rounded-2xl border-2 border-indigo-100 flex items-center justify-center p-3">
                                    <img src={invoiceData.issuer.stampImageUrl} className="max-w-full max-h-full object-contain" />
                                    <button onClick={() => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, stampImageUrl: undefined } }))} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all"><X size={12} strokeWidth={4} /></button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IssuerTab;
