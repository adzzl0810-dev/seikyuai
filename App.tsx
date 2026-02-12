import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Download, History as HistoryIcon, X, Trash2,
  ShieldCheck, Eye, Edit3, Loader2, Mail, BookOpen
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import { Layout } from './components/Layout';
import { AdUnit } from './components/AdUnit';
import { TipsCard } from './components/TipsCard';
import { SEOContent } from './components/SEOContent';
import ItemsTab from './components/Sidebar/Tabs/ItemsTab';
import ClientTab from './components/Sidebar/Tabs/ClientTab';
import IssuerTab from './components/Sidebar/Tabs/IssuerTab';
import SettingsTab from './components/Sidebar/Tabs/SettingsTab';
import GuideTab from './components/Sidebar/Tabs/GuideTab';
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
import { ContactModal } from './components/ContactModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TEMPLATES: { id: TemplateId, label: string }[] = [
  { id: 'modern', label: 'モダン' }, { id: 'classic', label: 'クラシック' }, { id: 'simple', label: 'シンプル' },
  { id: 'bold', label: '太字強調' }, { id: 'elegant', label: 'エレガント' }, { id: 'tech', label: 'テック' },
  { id: 'nature', label: 'ネイチャー' }, { id: 'grid', label: 'グリッド' }, { id: 'corporate', label: 'コーポレート' },
  { id: 'monochrome', label: 'モノクロ' }, { id: 'warm', label: 'ウォーム' }, { id: 'cool', label: 'クール' },
  { id: 'compact', label: 'コンパクト' }, { id: 'playful', label: 'プレイフル' }, { id: 'shadow', label: 'シャドウ' },
  { id: 'borderless', label: '枠なし' }, { id: 'sharp', label: 'シャープ' }, { id: 'soft', label: 'ソフト' },
  { id: 'vintage', label: 'ビンテージ' }, { id: 'studio', label: 'スタジオ' }
];

const UNIT_SUGGESTIONS = ['式', '個', '月', 'h', '日', '件'];
const DOCUMENT_TITLES = ['御請求書', '御見積書', '納品書', '領収書', 'INVOICE', 'QUOTATION'];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [history, setHistory] = useState<SavedInvoice[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [themeColor, setThemeColor] = useState('#4f46e5');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    const saved = loadDraft();
    // Default data with empty fields for better UX (placeholders will be shown)
    const defaultData: InvoiceData = {
      title: '御請求書',
      invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-001`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuer: {
        name: "",
        registrationNumber: "",
        address: "",
        zipCode: "",
        phone: "",
        email: "",
        bankInfo: "",
        enableStamp: true
      },
      client: { name: "", address: "", zipCode: "" },
      items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, unit: '式', taxRate: TaxRate.STANDARD }],
      notes: ""
    };

    // Merge saved data with default data to ensure all properties (like title) exist
    if (saved) {
      return { ...defaultData, ...saved };
    }
    return defaultData;
  });

  const [template, setTemplate] = useState<TemplateId>('modern');
  const [activeTab, setActiveTab] = useState<'items' | 'client' | 'issuer' | 'settings' | 'guide'>('items');
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

  const downloadPdf = async () => {
    if (!previewRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      // Determine device to adjust scale
      // Optimize scale for size/quality balance (Scale 2 is approx 200dpi)
      const scale = 2;

      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1123;

      const canvas = await html2canvas(previewRef.current, {
        scale: scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        // Force desktop viewport for consistent layout (Increase height to avoid clipping)
        windowWidth: 1280,
        windowHeight: 3000,
        // Enable logging for debug
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.print-area') as HTMLElement;
          if (el) {
            // Ensure consistency during capture
            el.style.width = '210mm';
            el.style.minHeight = '297mm';
            el.style.height = 'auto'; // Allow expansion
            el.style.overflow = 'visible'; // Prevent clipping
            el.style.padding = '10mm'; // Reduce padding to fit more content without shrinking
            el.style.margin = '0';
            el.style.transform = 'none';
            el.style.boxSizing = 'border-box';
            el.style.borderRadius = '0';
            el.style.boxShadow = 'none';
            el.style.position = 'static';
          }
        }
      });

      // Use JPEG with 0.95 quality for better text clarity while keeping size small
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Initialize jsPDF with compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      // Fit to width (Priority: Fill viewport width)
      const ratio = pdfPageWidth / imgProps.width;

      const finalWidth = pdfPageWidth;
      const finalHeight = imgProps.height * ratio;

      // Top align
      const y = 0;

      // Check if height exceeds page and we need to handle it?
      // For now, we assume single page A4. If content is slightly larger, it might clip bottom,
      // but usually 'min-height: 297mm' ensures it matches A4 ratio if content is short.

      pdf.addImage(imgData, 'JPEG', 0, y, finalWidth, finalHeight);
      pdf.save(`${invoiceData.title}_${invoiceData.invoiceNumber}.pdf`);

      if (user) {
        const saved: SavedInvoice = { ...invoiceData, id: crypto.randomUUID(), createdAt: Date.now(), templateId: template };
        saveInvoiceToHistory(user.email, saved);
        setHistory(getInvoiceHistory(user.email));
      }
      alert("PDFをダウンロードしました！✨\n※いかなる損害についても当サービスは責任を負いません。");
    } catch (e) {
      console.error(e);
      alert("PDF作成に失敗しました。スマホの場合はメモリ不足の可能性があります。");
    }
    finally {
      setIsGeneratingPdf(false);
    }
  };

  const isRegNumValid = (num: string) => /^T[0-9]{13}$/.test(num);

  return (
    <Layout>
      <aside className={`${mobileView === 'edit' ? 'flex' : 'hidden lg:flex'} w-full lg:w-[480px] xl:w-[520px] bg-white border-r shadow-2xl flex-col z-20 overflow-hidden shrink-0 h-full`}>

        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogoutClick={() => { logoutUser(); setUser(null); }}
          onHistoryClick={() => setShowHistory(!showHistory)}
        />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 bg-white custom-scrollbar">
          {activeTab === 'items' && (
            <ItemsTab
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              documentTitles={DOCUMENT_TITLES}
              unitSuggestions={UNIT_SUGGESTIONS}
              duplicateItem={duplicateItem}
            />
          )}

          {activeTab === 'client' && (
            <ClientTab
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              handleZipLookup={handleZipLookup}
            />
          )}

          {activeTab === 'issuer' && (
            <IssuerTab
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              handleStampUpload={handleStampUpload}
              isRegNumValid={isRegNumValid}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              themeColor={themeColor}
              setThemeColor={setThemeColor}
              template={template}
              setTemplate={setTemplate}
              templates={TEMPLATES}
            />
          )}

          {activeTab === 'guide' && (
            <GuideTab setActiveTab={setActiveTab} />
          )}

          {/* AdSense Unit: Sidebar Bottom */}
          <div className="mt-auto pt-4 space-y-4">
            <TipsCard />
            <AdUnit
              slot="8901234567" // TODO: Replace with actual Sidebar Ad Slot ID
              format="rectangle"
              responsive={true}
              className="min-h-[250px] bg-slate-50 rounded-2xl flex items-center justify-center text-xs text-slate-300"
            />
          </div>
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
              <button onClick={() => setIsContactOpen(true)} className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 uppercase tracking-tighter">お問い合わせ <Mail size={8} /></button>
            </div>
            <div className="flex justify-center">
              <button onClick={() => setIsGuideOpen(true)} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full transition-all hover:bg-indigo-100 flex items-center gap-1.5 shadow-sm active:scale-95"><BookOpen size={12} /> 使い方ガイド</button>
            </div>
            <p className="text-[8px] font-bold text-slate-300 text-center uppercase tracking-widest">© 2024 Seikyu AI. All rights reserved.</p>
          </div>
        </div>
      </aside>

      <main className={`${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'} flex-1 flex-col items-center overflow-y-auto p-4 lg:p-12 relative custom-scrollbar h-full`}>

        {/* AdSense Unit: Top Banner */}
        <div className="w-full max-w-[210mm] mb-6 hidden lg:block no-print">
          <AdUnit
            slot="1234567890" // TODO: Replace with actual Top Banner Ad Slot ID
            format="horizontal"
            responsive={true}
            className="min-h-[90px] bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-300"
          />
        </div>

        <div className="w-full max-w-[210mm] mb-12 hidden lg:flex justify-between items-center no-print">
          <div className="flex items-center gap-5 bg-white px-7 py-4 rounded-[2rem] shadow-xl border border-white">
            <div className="bg-green-100 text-green-600 p-2 rounded-full"><ShieldCheck size={24} /></div>
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
            className="bg-indigo-600 text-white p-2.5 rounded-full shadow-2xl active:scale-90 transition-transform disabled:opacity-70 disabled:bg-indigo-400"
            title="PDFを保存"
          >
            {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
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

        <SEOContent />

        {showHistory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-10 shrink-0">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4"><HistoryIcon className="text-indigo-600" size={32} /> 作成履歴</h2>
                <button onClick={() => setShowHistory(false)} className="p-4 hover:bg-slate-50 rounded-3xl transition-all"><X size={28} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-40 text-slate-200">
                    <HistoryIcon size={80} className="mb-6 opacity-20" />
                    <p className="font-black text-xl">履歴はありません</p>
                  </div>
                ) : (
                  history.sort((a, b) => b.createdAt - a.createdAt).map(item => (
                    <div key={item.id} className="group p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden" onClick={() => { setInvoiceData(item); setTemplate(item.templateId); setShowHistory(false); setMobileView('edit'); }}>
                      <div className="text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-widest">{new Date(item.createdAt).toLocaleString()}</div>
                      <div className="font-black text-slate-800 text-lg mb-1 truncate">{item.client.name}</div>
                      <div className="text-sm font-bold text-slate-400">#{item.invoiceNumber}</div>
                      <button onClick={(e) => { e.stopPropagation(); deleteInvoiceFromHistory(user!.email, item.id); setHistory(getInvoiceHistory(user!.email)); }} className="absolute top-4 right-4 bg-white text-slate-200 hover:text-red-500 shadow-sm p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-slate-100"><Trash2 size={16} /></button>
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
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] transition-all ${mobileView === 'edit' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
        >
          <Edit3 size={14} /> 入力
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] transition-all ${mobileView === 'preview' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
        >
          <Eye size={14} /> プレビュー
        </button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={setUser} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

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
    </Layout>
  );
};

export default App;
