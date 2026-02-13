import React from 'react';
import { InvoiceData, InvoiceTotals, TaxRate } from '../types';

interface ReceiptTemplateProps {
    data: InvoiceData;
    totals: InvoiceTotals;
    previewRef: React.RefObject<HTMLDivElement | null>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
};

export const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ data, totals, previewRef }) => {
    return (
        <div
            ref={previewRef}
            className="print-area bg-white text-slate-900 font-mono text-[10px] leading-tight relative shadow-2xl mx-auto"
            style={{
                width: '80mm', // Standard Receipt Width
                minHeight: '200mm', // Variable height realistically, but fixed for preview
                padding: '5mm',
                boxSizing: 'border-box'
            }}
        >
            {/* Texture effect for thermal paper */}
            <div className="absolute inset-0 bg-neutral-50 pointer-events-none opacity-50 mix-blend-multiply"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-6 w-full">
                    <h1 className="text-xl font-bold mb-2 tracking-widest border-b-2 border-slate-900 pb-1 inline-block">
                        領 収 書
                    </h1>
                    <p className="text-xs mb-1 font-bold">{data.issuer.name || '店舗名未設定'}</p>
                    <p className="text-[9px]">{data.issuer.address}</p>
                    <p className="text-[9px]">{data.issuer.phone}</p>
                    <p className="text-[9px] mt-1">登録番号: {data.issuer.registrationNumber}</p>
                </div>

                {/* Meta Data */}
                <div className="w-full flex justify-between mb-4 border-b border-dashed border-slate-400 pb-2">
                    <div className="text-left">
                        <p>{formatDate(data.date)}</p>
                        <p>No: {data.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        <p>様</p>
                    </div>
                </div>

                {/* Client Name (Big) */}
                <div className="w-full text-center mb-6">
                    <p className="text-sm font-bold border-b border-slate-900 inline-block px-4 pb-1">
                        {data.client.name || '様'}
                    </p>
                </div>

                {/* Items */}
                <div className="w-full mb-4">
                    <div className="flex justify-between border-b border-slate-900 pb-1 mb-2 font-bold">
                        <span>品名</span>
                        <div className="flex gap-4">
                            <span>単価</span>
                            <span>金額</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {data.items.map((item) => (
                            <div key={item.id} className="flex flex-col">
                                <div className="flex justify-between mb-0.5">
                                    <span className="font-bold truncate w-2/3">{item.description || '商品'}</span>
                                    <span>{formatCurrency(item.quantity * item.unitPrice)}</span>
                                </div>
                                <div className="flex justify-between text-[8px] text-slate-500 pl-2">
                                    <span>@{item.unitPrice.toLocaleString()} x {item.quantity}{item.unit}</span>
                                    {item.taxRate === TaxRate.REDUCED && <span>(軽)</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="w-full border-t-2 border-dashed border-slate-400 pt-2 mb-6">
                    <div className="flex justify-between mb-1">
                        <span>小計 (税抜)</span>
                        <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>消費税等</span>
                        <span>{formatCurrency(totals.totalTax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold mt-2 border-y-2 border-slate-900 py-2">
                        <span>合計</span>
                        <span>{formatCurrency(totals.grandTotal)}</span>
                    </div>

                    {/* Tax Breakdown */}
                    <div className="mt-2 text-[8px] text-right space-y-0.5 text-slate-500">
                        {totals.taxSummaries.map(s => (
                            <p key={s.rate}>
                                {s.rate * 100}%対象: {formatCurrency(s.taxableAmount)} (税: {formatCurrency(s.taxAmount)})
                            </p>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center w-full mt-auto mb-8">
                    <p className="mb-4 text-xs font-bold">毎度ありがとうございます</p>

                    {/* Mock Barcode */}
                    <div className="h-8 bg-slate-900 w-2/3 mx-auto mb-1 opacity-80"
                        style={{ maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)' }}>
                    </div>
                    <p className="text-[8px] tracking-[0.3em]">{data.invoiceNumber}</p>

                    <p className="mt-4 text-[8px] text-slate-400">Powered by Seikyu AI</p>
                </div>
            </div>

            {/* ZigZag Bottom */}
            <div
                className="absolute bottom-[-10px] left-0 right-0 h-[10px] w-full"
                style={{
                    background: 'linear-gradient(-45deg, transparent 7px, #fff 0) 0 0, linear-gradient(45deg, transparent 7px, #fff 0) 0 0',
                    backgroundSize: '10px 10px',
                    backgroundRepeat: 'repeat-x',
                    filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.1))'
                }}
            ></div>

            <style>{`
        @media print {
          .print-area { 
            width: 80mm !important; 
            margin: 0 !important; 
            box-shadow: none !important;
            height: auto !important;
            min-height: auto !important;
            page-break-inside: avoid;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
        </div>
    );
};
