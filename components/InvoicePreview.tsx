import React from 'react';
import { InvoiceData, TaxRate, InvoiceTotals, TemplateId } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  totals: InvoiceTotals;
  templateId: TemplateId;
  previewRef: React.RefObject<HTMLDivElement | null>;
  accentColor?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const StampComponent: React.FC<{ text: string; imageUrl?: string; color?: string }> = ({ text, imageUrl, color = '#ef4444' }) => {
  if (imageUrl) {
    return (
      <div className="relative inline-block mt-2 mr-1 opacity-90 select-none mix-blend-multiply z-20">
        <img src={imageUrl} alt="印影" className="w-[50px] h-[50px] object-contain" />
      </div>
    );
  }
  const stampText = text.slice(0, 4) || "印";
  return (
    <div className="relative inline-block mt-2 mr-1 opacity-80 select-none mix-blend-multiply z-20 rotate-[-12deg]">
      <div className="w-11 h-11 border-[1.5px] border-red-500 rounded flex items-center justify-center relative bg-white/5">
        <div className="absolute inset-0.5 border border-red-500 rounded-sm"></div>
        <span className="text-red-500 font-serif font-bold text-[9px] writing-vertical-rl tracking-[0.2em] leading-none">
          {stampText}之印
        </span>
      </div>
    </div>
  );
};

const Table: React.FC<{
  items: InvoiceData['items'];
  accentColor: string;
  bordered?: boolean;
  headerStyle?: 'dark' | 'light' | 'colored' | 'none';
}> = ({ items, accentColor, bordered, headerStyle = 'light' }) => {
  const getHeaderClass = () => {
    switch (headerStyle) {
      case 'dark': return 'bg-slate-900 text-white';
      case 'colored': return `text-white`;
      case 'none': return 'border-b border-slate-900';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full border-collapse ${bordered ? 'border border-slate-300' : ''} text-[10px] min-w-[500px]`}>
        <thead>
          <tr className={`${getHeaderClass()} font-bold`} style={headerStyle === 'colored' ? { backgroundColor: accentColor } : {}}>
            <th className={`p-1 px-2 text-left ${bordered ? 'border border-slate-300' : ''}`}>内容</th>
            <th className={`p-1 text-center w-14 ${bordered ? 'border border-slate-300' : ''}`}>数量</th>
            <th className={`p-1 text-center w-14 ${bordered ? 'border border-slate-300' : ''}`}>単位</th>
            <th className={`p-1 text-right w-24 ${bordered ? 'border border-slate-300' : ''}`}>単価</th>
            <th className={`p-1 px-2 text-right w-28 ${bordered ? 'border border-slate-300' : ''}`}>金額</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className={`p-1 px-2 ${bordered ? 'border border-slate-300' : ''}`}>
                {item.description || <span className="text-slate-200">（内容を入力）</span>}
                {item.taxRate === TaxRate.REDUCED && <span className="ml-1 text-[8px] font-bold text-white bg-indigo-500 px-1 py-0.5 rounded-[2px] scale-90 inline-block origin-left">軽減8%</span>}
              </td>
              <td className={`p-1 text-center ${bordered ? 'border border-slate-300' : ''}`}>{item.quantity}</td>
              <td className={`p-1 text-center ${bordered ? 'border border-slate-300' : ''}`}>{item.unit}</td>
              <td className={`p-1 text-right ${bordered ? 'border border-slate-300' : ''}`}>{item.unitPrice.toLocaleString()}</td>
              <td className={`p-1 px-2 text-right font-bold ${bordered ? 'border border-slate-300' : ''}`}>{(item.quantity * item.unitPrice).toLocaleString()}</td>
            </tr>
          ))}
          {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, i) => (
            <tr key={`empty-${i}`} className={`h-8 border-b border-slate-50 ${bordered ? 'border border-slate-300' : ''}`}><td colSpan={5}></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import { ReceiptTemplate } from './ReceiptTemplate';

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, totals, templateId, previewRef, accentColor = '#4f46e5' }) => {
  if (templateId === 'receipt') {
    return <ReceiptTemplate data={data} totals={totals} previewRef={previewRef} />;
  }

  const isSerif = ['classic', 'elegant', 'vintage', 'soft'].includes(templateId);
  const isDarkHeader = ['tech', 'monochrome', 'sharp', 'corporate'].includes(templateId);
  const isColoredHeader = ['bold', 'nature', 'playful', 'studio', 'warm', 'cool'].includes(templateId);
  const isBordered = ['classic', 'grid', 'compact', 'vintage'].includes(templateId);
  const isNoPrintBorder = ['simple', 'borderless', 'soft'].includes(templateId);

  return (
    <div
      ref={previewRef}
      className={`print-area bg-white shadow-2xl box-border p-[8mm] w-[210mm] min-h-[297mm] relative overflow-hidden transition-all duration-300 ${isSerif ? 'font-serif' : 'font-sans'}`}
      style={{ borderTop: isNoPrintBorder ? 'none' : `10px solid ${accentColor}` }}
    >
      {/* Decorative corner */}
      {['playful', 'studio', 'nature'].includes(templateId) && (
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10" style={{ backgroundColor: accentColor, borderRadius: '0 0 0 100%' }}></div>
      )}

      {/* Header Area */}
      <div className={`flex flex-col sm:flex-row justify-between items-start mb-5 gap-4 ${templateId === 'grid' ? 'border-b pb-3' : ''}`}>
        <div className="w-full sm:w-auto">
          {/* SEO Optimized: Changed h1 to h2, keeping h1 for site title only */}
          <h2 className="text-2xl font-black tracking-[0.1em] mb-1 uppercase leading-tight" style={{ color: templateId === 'monochrome' ? '#000' : accentColor }}>
            {data.title || '御請求書'}
          </h2>
          <div className="space-y-0 text-[10px]">
            <p className="font-bold">No. <span className="text-slate-500 font-medium">{data.invoiceNumber}</span></p>
            <p className="text-slate-500">発行日: {formatDate(data.date)}</p>
            <p className="text-slate-500">支払期限: {formatDate(data.dueDate)}</p>
          </div>
        </div>
        <div className="text-left sm:text-right relative pt-1 w-full sm:w-auto flex flex-col sm:items-end">
          <h3 className="text-lg font-black mb-0.5 tracking-tight">{data.issuer.name || <span className="text-slate-200">自社名（サンプル）</span>}</h3>
          <div className="text-[9px] leading-snug text-slate-500">
            <p className="font-bold mb-0.5" style={{ color: accentColor }}>登録番号: {data.issuer.registrationNumber || 'T0000000000000'}</p>
            <p>〒{data.issuer.zipCode || '000-0000'} {data.issuer.address || '自社住所（サンプル）'}</p>
            <p>{(data.issuer.phone || data.issuer.email) ? `${data.issuer.phone} / ${data.issuer.email}` : 'TEL: 03-0000-0000 / info@example.com'}</p>
          </div>

          {/* Logo & Stamp */}
          <div className="flex gap-3 mt-1 justify-end items-start w-full">
            {data.issuer.logoImageUrl && (
              <img src={data.issuer.logoImageUrl} alt="Logo" className="h-10 object-contain" />
            )}
            {data.issuer.enableStamp && <StampComponent text={data.issuer.name} imageUrl={data.issuer.stampImageUrl} />}
          </div>
        </div>
      </div>

      {/* Recipient Area */}
      <div className="mb-5 border-l-[3px] pl-4" style={{ borderColor: accentColor }}>
        <h2 className="text-lg font-black border-b border-slate-100 pb-1 mb-1 tracking-tight">{data.client.name || <span className="text-slate-300">クライアント名（サンプル）</span>}</h2>
        <div className="text-[10px] text-slate-500">
          <p>〒{data.client.zipCode || '000-0000'}</p>
          <p>{data.client.address || 'クライアント住所（サンプル）'}</p>
        </div>
      </div>

      {/* Total Amount Banner */}
      <div className={`px-4 py-2.5 mb-5 flex justify-between items-center rounded-lg ${templateId === 'shadow' ? 'shadow-md' : ''}`} style={{ backgroundColor: accentColor + '10' }}>
        <span className="font-black text-slate-400 text-[10px] tracking-widest uppercase">ご請求金額 (税込)</span>
        <span className="text-2xl font-black tracking-tighter" style={{ color: accentColor }}>{formatCurrency(totals.grandTotal)}</span>
      </div>

      {/* Main Table */}
      <div className="mb-5">
        <Table
          items={data.items}
          accentColor={accentColor}
          bordered={isBordered}
          headerStyle={isDarkHeader ? 'dark' : isColoredHeader ? 'colored' : 'light'}
        />
      </div>

      {/* Totals & Tax Breakdown */}
      <div className="flex justify-end mb-5">
        <div className="w-full max-w-[280px] space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500"><span>小計 (税抜)</span><span className="font-bold">{formatCurrency(totals.subtotal)}</span></div>
          <div className="flex justify-between text-xs text-slate-500"><span>消費税計</span><span className="font-bold">{formatCurrency(totals.totalTax)}</span></div>

          <div className="py-1.5 border-t border-b border-slate-100 mt-1 space-y-0.5">
            {totals.taxSummaries.map(s => (
              <div key={s.rate} className="flex justify-between text-[9px] text-slate-400">
                <span>{s.rate * 100}% 対象 ({formatCurrency(s.taxableAmount)})</span>
                <span>税額: {formatCurrency(s.taxAmount)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xl font-black pt-1" style={{ color: accentColor }}>
            <span>合計</span>
            <span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Bank & Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg">
          <p className="text-[9px] font-black text-slate-400 mb-0.5 uppercase tracking-widest">お振込先</p>
          <p className="text-[9px] font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">{data.issuer.bankInfo || '振込先銀行情報（サンプル）'}</p>
        </div>
        <div className="sm:col-span-3 p-3 border border-slate-100 rounded-lg">
          <p className="text-[9px] font-black text-slate-400 mb-0.5 uppercase tracking-widest">備考</p>
          <p className="text-[9px] text-slate-500 leading-relaxed whitespace-pre-wrap">{data.notes || '備考・特記事項（サンプル）'}</p>
        </div>
      </div>



      <style>{`
        @media print {
          .print-area { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; padding: 8mm !important; }
        }
      `}</style>
    </div>
  );
};
