import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Download, FileText, Building, User, Settings, 
  Stamp, Search, Check, AlertCircle, Save, History as HistoryIcon, X, 
  ChevronRight, ShieldCheck, Zap, LayoutTemplate, MapPin, Upload, LogIn, LogOut,
  Palette, MousePointer2, Info, BookOpen, ShieldAlert, Eye, Edit3, Copy, RefreshCw,
  ExternalLink, Scale, Loader2
} from 'lucide-react';
import { InvoiceData, TaxRate, LineItem, InvoiceTotals, TaxSummary, TemplateId, UserProfile, SavedInvoice } from './types';
import { InvoicePreview } from './components/InvoicePreview';
import { fetchAddressByZip } from './services/addressService';
import { 
  getCurrentUser, logoutUser, saveDraft, loadDraft, 
  saveUserPreferences, getUserPreferences, 
  saveInvoiceToHistory, getInvoiceHistory, deleteInvoiceFromHistory 
} from './services/storageService';
import { AuthModal } from './components/AuthModal';
import { TermsModal } from './components/TermsModal';
import { GuideModal } from './components/GuideModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TEMPLATES: {id: TemplateId, label: string}[] = [
  { id: 'modern', label: 'モダン' }, { id: 'classic', label: 'クラシック' }, { id: 'simple', label: 'シンプル' },
  { id: 'bold', label: '太字強調' }, { id: 'elegant', label: 'エレガント' }, { id: 'tech', label: 'テック' },
  { id: 'nature', label: 'ネイチャー' }, { id: 'grid', label: 'グリッド' }, { id: 'corporate', label: 'コーポレート' },
  { id: 'monochrome', label: 'モノクロ' }, { id: 'warm', label: 'ウォーム' }, { id: 'cool', label: 'クール' },
  { id: 'compact', label: 'コンパクト' }, { id: 'playful', label: 'プレイフル' }, { id: 'shadow', label: 'シャドウ' },
  { id: 'borderless', label: '枠なし' }, { id: 'sharp', label: 'シャープ' }, { id: 'soft', label: 'ソフト' },
  { id: 'vintage', label: 'ビンテージ' }, { id: 'studio', label: 'スタジオ' }
];

const UNIT_SUGGESTIONS = ['式', '個', '月', 'h', '日', '件'];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [history, setHistory] = useState<SavedInvoice[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [themeColor, setThemeColor] = useState('#4f46e5');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    const saved = loadDraft();
    return saved || {
      invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-001`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuer: {
        name: "サンプル株式会社",
        registrationNumber: "T1234567890123",
        address: "東京都港区芝公園4丁目2-8",
        zipCode: "105-0011",
        phone: "03-0000-0000",
        email: "info@example.com",
        bankInfo: "サンプル銀行 サンプル支店\n普通 1234567\nサンプル（カ",
        enableStamp: true
      },
      client: { name: "クライアント株式会社 御中", address: "東京都千代田区丸の内1-1-1", zipCode: "100-0005" },
      items: [{ id: '1', description: 'Web制作・コンサルティング', quantity: 1, unitPrice: 200000, unit: '式', taxRate: TaxRate.STANDARD }],
      notes: "振込手数料は貴社にてご負担願います。"
    };
  });

  const [template, setTemplate] = useState<TemplateId>('modern');
  const [activeTab, setActiveTab] = useState<'items' | 'client' | 'issuer' | 'settings'>('items');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { saveDraft(invoiceData); }, [invoiceData]);

  useEffect(() => {
    if (user) {
      setHistory(getInvoiceHistory(user.email));
      const prefs = getUserPreferences(user.email);
      if (prefs) setInvoiceData(prev => ({ ...prev, issuer: prefs }));
    }
  }, [user]);

  const totals = useMemo((): InvoiceTotals => {
    let subtotal = 0;
    const itemsByRate: Record<number, number> = { [TaxRate.STANDARD]: 0, [TaxRate.REDUCED]: 0, [TaxRate.EXEMPT]: 0 };
    invoiceData.items.forEach(item => {
      const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subtotal += lineTotal;
      itemsByRate[item.taxRate] += lineTotal;
    });
    const taxSummaries: TaxSummary[] = [];
    let totalTax = 0;
    Object.entries(itemsByRate).forEach(([rateStr, taxableAmount]) => {
      const rate = parseFloat(rateStr);
      if (taxableAmount > 0) {
        const tax = Math.floor(taxableAmount * rate);
        totalTax += tax;
        taxSummaries.push({ rate, taxableAmount, taxAmount: tax });
      }
    });
    return { subtotal, totalTax, grandTotal: subtotal + totalTax, taxSummaries };
  }, [invoiceData.items]);

  const handleZipLookup = async (type: 'client' | 'issuer') => {
    const zip = type === 'client' ? invoiceData.client.zipCode : invoiceData.issuer.zipCode;
    if (!zip) return;
    const address = await fetchAddressByZip(zip);
    if (address) setInvoiceData(prev => ({ ...prev, [type]: { ...prev[type], address } }));
  };

  const duplicateItem = (item: LineItem) => {
    const newItem = { ...item, id: Math.random().toString() };
    setInvoiceData(d => ({ ...d, items: [...d.items, newItem] }));
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setInvoiceData(prev => ({ ...prev, issuer: { ...prev.issuer, stampImageUrl: reader.result as string } }));
      reader.readAsDataURL(file);
    }
  };

  const convertPricesToInclusive = () => {
    setInvoiceData(d => ({
      ...d,
      items: d.items.map(i => ({
        ...i,
        unitPrice: Math.round(i.unitPrice * (1 + i.taxRate))
      }))
    }));
  };

  const downloadPdf = async () => {
    if (!previewRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      // Fix for Mobile PDF Scaling:
      // Force html2canvas to simulate a desktop environment (windowWidth: 1280)
      // and explicitly set the canvas capture dimensions to A4 pixel width (~794px at 96DPI).
      const A4_WIDTH_PX = 794; 
      const A4_HEIGHT_PX = 1123;

      const canvas = await html2canvas(previewRef.current, { 
        scale: 3, // High resolution for clear text
        useCORS: true, 
        backgroundColor: '#ffffff',
        windowWidth: 1280, // Simulate desktop view to trigger 'md:' Tailwind classes
        width: A4_WIDTH_PX, // Force A4 width capture
        height: Math.max(previewRef.current.scrollHeight, A4_HEIGHT_PX), // Capture full height
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.print-area') as HTMLElement;
          if (el) {
            // Force desktop layout styles on the cloned element
            el.style.width = '210mm';
            el.style.minHeight = '297mm';
            el.style.padding = '20mm'; // Ensure desktop padding is applied
            el.style.margin = '0 auto';
            el.style.transform = 'none'; // Reset any scaling transforms
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`請求書_${invoiceData.invoiceNumber}.pdf`);
      
      if (user) {
        const saved: SavedInvoice = { ...invoiceData, id: crypto.randomUUID(), createdAt: Date.now(), templateId: template };
        saveInvoiceToHistory(user.email, saved);
        setHistory(getInvoiceHistory(user.email));
      }
      alert("PDFをダウンロードしました！✨\n※いかなる損害についても当サービスは責任を負いません。");
    } catch (e) { 
      console.error(e);
      alert("PDF作成に失敗しました。"); 
    }
    finally { 
      setIsGeneratingPdf(false);
    }
  };

  const isRegNumValid = (num: string) => /^T[0-9]{13}$/.test(num);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#F8FAFC] font-sans">
      <aside className={`${mobileView === 'edit' ? 'flex' : 'hidden lg:flex'} w-full lg:w-[480px] xl:w-[520px] bg-white border-r shadow-2xl flex-col z-20 overflow-hidden shrink-0 h-full`}>
        <header className="px-6 py-6 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-xl"><FileText size={24} /></div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-slate-800 leading-none">Seikyu <span className="text-indigo-600">AI</span></h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Smart Invoice Solution</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowHistory(!showHistory)} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-all border border-slate-100"><HistoryIcon size={20} /></button>
                <div className="group relative">
                  <img src={user.avatarUrl} className="w-10 h-10 rounded-full ring-2 ring-indigo-50 cursor-pointer shadow-md" alt="avatar" />
                  <div className="absolute right-0 top-full mt-3 hidden group-hover:block bg-white shadow-2xl rounded-2xl p-2 min-w-[160px] border border-slate-100 z-50">
                    <button onClick={() => { logoutUser(); setUser(null); }} className="w-full flex items-center gap-3 text-sm p-4 hover:bg-red-50 rounded-xl text-red-600 font-black transition-all"><LogOut size={16} /> ログアウト</button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-xs font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-5 py-2.5 rounded-2xl transition-all shadow-sm">
                ログイン
              </button>
            )}
          </div>
        </header>

        <nav className="flex px-2 pt-2 border-b bg-white shrink-0 overflow-x-auto no-scrollbar">
          {(['items', 'client', 'issuer', 'settings'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[80px] py-4 text-[11px] font-black tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              {tab === 'items' ? '明細入力' : tab === 'client' ? '宛先' : tab === 'issuer' ? '自社' : 'デザイン'}
              {activeTab === tab && <div className="absolute bottom-0 left-4 right-4 h-1 bg-indigo-600 rounded-t-full"></div>}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 bg-white custom-scrollbar">
          {activeTab === 'items' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-800 font-black text-xs uppercase tracking-widest flex items-center gap-2"><Info size={14} className="text-indigo-600"/> 請求基本情報</div>
                  <button onClick={convertPricesToInclusive} className="text-[9px] font-black text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-all flex items-center gap-1">
                    <RefreshCw size={10} /> 全単価を税込へ変換
                  </button>
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
                      <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">内容 #{idx+1}</label>
                      <input className="w-full text-sm font-black text-slate-700 border-none p-0 focus:ring-0 bg-white" value={item.description} onChange={e => setInvoiceData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i) }))} placeholder="内容を入力" />
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
                          {UNIT_SUGGESTIONS.map(u => (
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
                  <Plus size={18} strokeWidth={4}/> 新しい明細を追加
                </button>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 mb-2 text-slate-800 font-black text-xs uppercase tracking-widest"><FileText size={14} className="text-indigo-600"/> 備考</div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <textarea className="w-full text-sm font-bold border-none p-0 h-24 resize-none bg-white focus:ring-0" placeholder="振込手数料は貴社負担にて..." value={invoiceData.notes} onChange={e => setInvoiceData(d => ({ ...d, notes: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'client' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-5 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">宛先名（御中 / 様）</label>
                  <input className="w-full p-0 text-xl font-black border-none bg-white focus:ring-0" placeholder="株式会社〇〇 御中" value={invoiceData.client.name} onChange={e => setInvoiceData(d => ({ ...d, client: { ...d.client, name: e.target.value } }))} />
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">郵便番号</label>
                  <div className="flex gap-4">
                    <input className="flex-1 text-sm font-black border-none p-0 bg-white focus:ring-0" placeholder="1000001" value={invoiceData.client.zipCode} onChange={e => setInvoiceData(d => ({ ...d, client: { ...d.client, zipCode: e.target.value } }))} />
                    <button onClick={() => handleZipLookup('client')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl shadow-lg font-black text-[10px]">検索</button>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">住所</label>
                  <textarea className="w-full text-sm font-bold border-none h-24 resize-none p-0 bg-white focus:ring-0" placeholder="住所を入力してください" value={invoiceData.client.address} onChange={e => setInvoiceData(d => ({ ...d, client: { ...d.client, address: e.target.value } }))} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issuer' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 bg-white border-4 border-slate-50 rounded-[3rem] space-y-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Building size={24}/></div>
                   <span className="font-black text-lg text-slate-800 tracking-tighter block">自社情報設定</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl shadow-inner">
                  <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">社名 / 氏名</label>
                  <input className="w-full bg-transparent border-none p-0 font-black text-slate-800 text-base focus:ring-0" value={invoiceData.issuer.name} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, name: e.target.value } }))} />
                </div>
                <div className={`p-4 rounded-2xl border-2 shadow-inner ${isRegNumValid(invoiceData.issuer.registrationNumber) ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <label className={`text-[9px] font-black uppercase mb-1 block ${isRegNumValid(invoiceData.issuer.registrationNumber) ? 'text-green-600' : 'text-red-600'}`}>登録番号 (T+13桁)</label>
                  <input className="w-full bg-transparent border-none p-0 font-mono text-slate-800 font-black focus:ring-0" placeholder="T1234567890123" value={invoiceData.issuer.registrationNumber} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, registrationNumber: e.target.value } }))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl shadow-inner"><label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">郵便番号</label><input className="w-full bg-transparent border-none p-0 font-bold text-xs focus:ring-0" value={invoiceData.issuer.zipCode} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, zipCode: e.target.value } }))} /></div>
                  <div className="bg-slate-50 p-4 rounded-2xl shadow-inner"><label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">電話番号</label><input className="w-full bg-transparent border-none p-0 font-bold text-xs focus:ring-0" value={invoiceData.issuer.phone} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, phone: e.target.value } }))} /></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl shadow-inner"><label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">住所</label><textarea className="w-full bg-transparent border-none p-0 h-16 text-xs font-bold resize-none focus:ring-0" value={invoiceData.issuer.address} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, address: e.target.value } }))} /></div>
                <div className="bg-slate-50 p-4 rounded-2xl shadow-inner"><label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">振込先</label><textarea className="w-full bg-transparent border-none p-0 h-24 text-[10px] font-black resize-none focus:ring-0 leading-relaxed" value={invoiceData.issuer.bankInfo} onChange={e => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, bankInfo: e.target.value } }))} /></div>

                <div className="pt-6 border-t border-slate-100">
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
                           <img src={invoiceData.issuer.stampImageUrl} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                           <button onClick={() => setInvoiceData(d => ({ ...d, issuer: { ...d.issuer, stampImageUrl: undefined } }))} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all"><X size={12} strokeWidth={4}/></button>
                         </div>
                       )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="p-8 bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Palette size={24}/></div>
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
                      {TEMPLATES.map(t => (
                        <button 
                          key={t.id} 
                          onClick={() => setTemplate(t.id)}
                          className={`group py-5 px-4 rounded-3xl border-2 text-[11px] font-black transition-all flex flex-col items-center gap-2 ${template === t.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-slate-50 text-slate-400 border-slate-50 hover:bg-white hover:text-indigo-600'}`}
                        >
                          <LayoutTemplate size={18} className={template === t.id ? 'text-indigo-400' : 'text-slate-200'}/>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t shrink-0">
          <div className="flex justify-between items-center mb-4 px-1">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-300 uppercase leading-none">合計金額（税込）</span>
                <span className="text-2xl font-black text-slate-800 tracking-tighter">{totals.grandTotal.toLocaleString()}<span className="text-xs ml-1 text-slate-400 font-bold">円</span></span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-green-200 shadow-lg"></div>
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Secured System</span>
             </div>
          </div>
          
          {/* Enhanced Legal Footer */}
          <div className="pt-4 border-t border-slate-50 space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
              <button onClick={() => setIsPrivacyOpen(true)} className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 uppercase tracking-tighter">Privacy Policy</button>
              <button onClick={() => setIsTermsOpen(true)} className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 uppercase tracking-tighter">Terms of Service</button>
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 uppercase tracking-tighter">Support <ExternalLink size={8}/></a>
            </div>
            <div className="flex justify-center">
               <button onClick={() => setIsGuideOpen(true)} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full transition-all hover:bg-indigo-100 flex items-center gap-1.5 shadow-sm active:scale-95"><BookOpen size={12}/> 使い方ガイド</button>
            </div>
            <p className="text-[8px] font-bold text-slate-300 text-center uppercase tracking-widest">© 2024 Seikyu AI. All rights reserved.</p>
          </div>
        </div>
      </aside>

      <main className={`${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'} flex-1 flex-col items-center overflow-y-auto p-4 lg:p-12 bg-[#F8FAFC] relative custom-scrollbar h-full`}>

        <div className="w-full max-w-[210mm] mb-12 hidden lg:flex justify-between items-center no-print">
          <div className="flex items-center gap-5 bg-white px-7 py-4 rounded-[2rem] shadow-xl border border-white">
             <div className="bg-green-100 text-green-600 p-2 rounded-full"><ShieldCheck size={24}/></div>
             <div className="flex flex-col">
               <span className="text-sm font-black text-slate-800 tracking-tight">インボイス準拠済み</span>
               <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Validated Registration No.</span>
             </div>
          </div>
          <button 
            id="download-btn"
            onClick={downloadPdf} 
            disabled={isGeneratingPdf}
            className="group bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-[2rem] font-black text-sm flex items-center gap-4 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} strokeWidth={3} />} 
            {isGeneratingPdf ? "PDF作成中..." : "PDFをダウンロード"}
          </button>
        </div>

        <div className="lg:hidden fixed top-6 right-6 z-[100] flex flex-col gap-2">
           <button 
             id="download-btn-mobile"
             onClick={downloadPdf}
             disabled={isGeneratingPdf}
             className="bg-indigo-600 text-white p-3 rounded-full shadow-2xl active:scale-90 transition-transform disabled:opacity-70 disabled:bg-indigo-400"
             title="PDFを保存"
           >
             {isGeneratingPdf ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
           </button>
        </div>

        <div className="relative group transition-all duration-700 origin-top mb-24 lg:mt-0 mt-8 max-w-full">
          <div className="absolute -inset-10 bg-gradient-to-br from-indigo-500/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
          <div className="relative max-w-full overflow-hidden flex justify-center scale-75 sm:scale-90 md:scale-95 lg:scale-100 origin-top">
            <InvoicePreview 
              data={invoiceData} 
              totals={totals} 
              templateId={template} 
              previewRef={previewRef} 
              accentColor={themeColor}
            />
          </div>
        </div>

        {showHistory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-10 shrink-0">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4"><HistoryIcon className="text-indigo-600" size={32}/> 作成履歴</h2>
                <button onClick={() => setShowHistory(false)} className="p-4 hover:bg-slate-50 rounded-3xl transition-all"><X size={28}/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-40 text-slate-200">
                    <HistoryIcon size={80} className="mb-6 opacity-20" />
                    <p className="font-black text-xl">履歴はありません</p>
                  </div>
                ) : (
                  history.sort((a,b) => b.createdAt - a.createdAt).map(item => (
                    <div key={item.id} className="group p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden" onClick={() => { setInvoiceData(item); setTemplate(item.templateId); setShowHistory(false); setMobileView('edit'); }}>
                      <div className="text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-widest">{new Date(item.createdAt).toLocaleString()}</div>
                      <div className="font-black text-slate-800 text-lg mb-1 truncate">{item.client.name}</div>
                      <div className="text-sm font-bold text-slate-400">#{item.invoiceNumber}</div>
                      <button onClick={(e) => { e.stopPropagation(); deleteInvoiceFromHistory(user!.email, item.id); setHistory(getInvoiceHistory(user!.email)); }} className="absolute top-4 right-4 bg-white text-slate-200 hover:text-red-500 shadow-sm p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-slate-100"><Trash2 size={16}/></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl p-1 rounded-full shadow-2xl z-[100] border border-white/20">
         <button 
           onClick={() => setMobileView('edit')}
           className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[10px] transition-all ${mobileView === 'edit' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
         >
           <Edit3 size={14}/> 入力
         </button>
         <button 
           onClick={() => setMobileView('preview')}
           className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[10px] transition-all ${mobileView === 'preview' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
         >
           <Eye size={14}/> プレビュー
         </button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={setUser} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
