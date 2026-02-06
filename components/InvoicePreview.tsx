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
      <div className="absolute top-[-25px] right-[-10px] opacity-90 pointer-events-none select-none mix-blend-multiply z-20">
        <img src={imageUrl} alt="印影" className="w-[65px] h-[65px] object-contain rotate-[-5deg]" />
      </div>
    );
  }
  const stampText = text.slice(0, 4) || "印";
  return (
    <div className="absolute top-[-10px] right-[-10px] opacity-80 pointer-events-none select-none mix-blend-multiply z-20 rotate-[-12deg]">
      <div className="w-14 h-14 border-[1.5px] border-red-500 rounded flex items-center justify-center relative bg-white/5">
        <div className="absolute inset-0.5 border border-red-500 rounded-sm"></div>
        <span className="text-red-500 font-serif font-bold text-[10px] writing-vertical-rl tracking-[0.2em] leading-none">
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
    switch(headerStyle) {
      case 'dark': return 'bg-slate-900 text-white';
      case 'colored': return `text-white`;
      case 'none': return 'border-b-2 border-slate-900';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full border-collapse ${bordered ? 'border border-slate-300' : ''} text-[13px] min-w-[600px]`}>
        <thead>
          <tr className={`${getHeaderClass()} font-bold`} style={headerStyle === 'colored' ? { backgroundColor: accentColor } : {}}>
            <th className={`p-3 text-left ${bordered ? 'border border-slate-300' : ''}`}>内容</th>
            <th className={`p-3 text-center w-20 ${bordered ? 'border border-slate-300' : ''}`}>数量</th>
            <th className={`p-3 text-center w-20 ${bordered ? 'border border-slate-300' : ''}`}>単位</th>
            <th className={`p-3 text-right w-32 ${bordered ? 'border border-slate-300' : ''}`}>単価</th>
            <th className={`p-3 text-right w-36 ${bordered ? 'border border-slate-300' : ''}`}>金額</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className={`p-3 ${bordered ? 'border border-slate-300' : ''}`}>
                {item.description}
                {item.taxRate === TaxRate.REDUCED && <span className="ml-2 text-[8px] font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded-sm">軽減8%</span>}
              </td>
              <td className={`p-3 text-center ${bordered ? 'border border-slate-300' : ''}`}>{item.quantity}</td>
              <td className={`p-3 text-center ${bordered ? 'border border-slate-300' : ''}`}>{item.unit}</td>
              <td className={`p-3 text-right ${bordered ? 'border border-slate-300' : ''}`}>{item.unitPrice.toLocaleString()}</td>
              <td className={`p-3 text-right font-bold ${bordered ? 'border border-slate-300' : ''}`}>{(item.quantity * item.unitPrice).toLocaleString()}</td>
            </tr>
          ))}
          {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, i) => (
            <tr key={`empty-${i}`} className={`h-10 border-b border-slate-50 ${bordered ? 'border border-slate-300' : ''}`}><td colSpan={5}></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, totals, templateId, previewRef, accentColor = '#4f46e5' }) => {
  const isSerif = ['classic', 'elegant', 'vintage', 'soft'].includes(templateId);
  const isDarkHeader = ['tech', 'monochrome', 'sharp', 'corporate'].includes(templateId);
  const isColoredHeader = ['bold', 'nature', 'playful', 'studio', 'warm', 'cool'].includes(templateId);
  const isBordered = ['classic', 'grid', 'compact', 'vintage'].includes(templateId);
  const isNoPrintBorder = ['simple', 'borderless', 'soft'].includes(templateId);

  return (
    <div 
      ref={previewRef}
      className={`print-area bg-white shadow-2xl box-border p-[15mm] md:p-[20mm] w-[210mm] min-h-[297mm] relative overflow-hidden transition-all duration-300 ${isSerif ? 'font-serif' : 'font-sans'}`}
      style={{ borderTop: isNoPrintBorder ? 'none' : `12px solid ${accentColor}` }}
    >
      {/* Decorative corner */}
      {['playful', 'studio', 'nature'].includes(templateId) && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ backgroundColor: accentColor, borderRadius: '0 0 0 100%' }}></div>
      )}

      {/* Header Area */}
      <div className={`flex flex-col sm:flex-row justify-between items-start mb-12 gap-6 ${templateId === 'grid' ? 'border-b-2 pb-6' : ''}`}>
        <div className="w-full sm:w-auto">
          <h1 className="text-4xl font-black tracking-[0.2em] mb-4 uppercase leading-tight" style={{ color: templateId === 'monochrome' ? '#000' : accentColor }}>
            {templateId === 'simple' ? 'Invoice' : '御請求書'}
          </h1>
          <div className="space-y-1 text-sm">
            <p className="font-bold">No. <span className="text-slate-500">{data.invoiceNumber}</span></p>
            <p className="text-slate-500">発行日: {formatDate(data.date)}</p>
            <p className="text-slate-500">支払期限: {formatDate(data.dueDate)}</p>
          </div>
        </div>
        <div className="text-left sm:text-right relative pt-2 w-full sm:w-auto">
           {data.issuer.enableStamp && <StampComponent text={data.issuer.name} imageUrl={data.issuer.stampImageUrl} />}
           <h3 className="text-2xl font-black mb-2 tracking-tight">{data.issuer.name}</h3>
           <div className="text-[11px] leading-relaxed text-slate-500">
             <p className="font-bold mb-1" style={{ color: accentColor }}>登録番号: {data.issuer.registrationNumber}</p>
             <p>〒{data.issuer.zipCode} {data.issuer.address}</p>
             <p>{data.issuer.phone && `TEL: ${data.issuer.phone}`} {data.issuer.email && ` / ${data.issuer.email}`}</p>
           </div>
        </div>
      </div>

      {/* Recipient Area */}
      <div className="mb-12 border-l-4 pl-6" style={{ borderColor: accentColor }}>
        <h2 className="text-2xl font-black border-b border-slate-100 pb-2 mb-3 tracking-tight">{data.client.name}</h2>
        <div className="text-sm text-slate-500">
          <p>〒{data.client.zipCode}</p>
          <p>{data.client.address}</p>
        </div>
      </div>

      {/* Total Amount Banner */}
      <div className={`p-6 mb-12 flex justify-between items-center rounded-2xl ${templateId === 'shadow' ? 'shadow-xl' : ''}`} style={{ backgroundColor: accentColor + '10' }}>
        <span className="font-black text-slate-400 text-xs tracking-widest uppercase">ご請求金額 (税込)</span>
        <span className="text-3xl md:text-4xl font-black tracking-tighter" style={{ color: accentColor }}>{formatCurrency(totals.grandTotal)}</span>
      </div>

      {/* Main Table */}
      <div className="mb-10">
        <Table 
          items={data.items} 
          accentColor={accentColor} 
          bordered={isBordered}
          headerStyle={isDarkHeader ? 'dark' : isColoredHeader ? 'colored' : 'light'}
        />
      </div>

      {/* Totals & Tax Breakdown */}
      <div className="flex justify-end mb-12">
        <div className="w-full max-w-[320px] space-y-2">
          <div className="flex justify-between text-sm text-slate-500"><span>小計 (税抜)</span><span className="font-bold">{formatCurrency(totals.subtotal)}</span></div>
          <div className="flex justify-between text-sm text-slate-500"><span>消費税計</span><span className="font-bold">{formatCurrency(totals.totalTax)}</span></div>
          
          <div className="py-2 border-t border-b border-slate-100 mt-2 space-y-1">
             {totals.taxSummaries.map(s => (
               <div key={s.rate} className="flex justify-between text-[10px] text-slate-400">
                 <span>{s.rate * 100}% 対象 ({formatCurrency(s.taxableAmount)})</span>
                 <span>税額: {formatCurrency(s.taxAmount)}</span>
               </div>
             ))}
          </div>

          <div className="flex justify-between text-2xl font-black pt-2" style={{ color: accentColor }}>
            <span>合計</span>
            <span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Bank & Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-8 mb-12">
        <div className="sm:col-span-2 p-5 bg-slate-50 rounded-2xl">
          <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">お振込先</p>
          <p className="text-[11px] font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">{data.issuer.bankInfo}</p>
        </div>
        <div className="sm:col-span-3 p-5 border border-slate-100 rounded-2xl">
          <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">備考</p>
          <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-wrap">{data.notes || '特記事項なし'}</p>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="absolute bottom-10 left-0 right-0 text-center opacity-30 pointer-events-none px-6">
        <p className="text-[8px] md:text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase leading-relaxed">
          Qualified Invoice compliant with Japanese Tax Law. Registration: {data.issuer.registrationNumber}<br/>
          Created with Seikyu AI. We take no legal responsibility for the contents.
        </p>
      </div>

      <style>{`
        @media print {
          .print-area { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; padding: 10mm !important; }
        }
      `}</style>
    </div>
  );
};