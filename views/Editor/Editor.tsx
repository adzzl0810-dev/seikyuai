import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Download, History as HistoryIcon, X, Trash2,
    ShieldCheck, Eye, Edit3, Loader2, Mail, BookOpen
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { Layout } from '../../components/Layout';
import { AdUnit } from '../../components/AdUnit';
import { TipsCard } from '../../components/TipsCard';
import { SEOContent } from '../../components/SEOContent';
import ItemsTab from '../../components/Sidebar/Tabs/ItemsTab';
import ClientTab from '../../components/Sidebar/Tabs/ClientTab';
import IssuerTab from '../../components/Sidebar/Tabs/IssuerTab';
import SettingsTab from '../../components/Sidebar/Tabs/SettingsTab';
import GuideTab from '../../components/Sidebar/Tabs/GuideTab';
import { InvoiceData, TaxRate, LineItem, InvoiceTotals, TaxSummary, TemplateId, UserProfile, SavedInvoice } from '../../types';
import { InvoicePreview } from '../../components/InvoicePreview';
import { fetchAddressByZip } from '../../services/addressService';
import {
    getCurrentUser, logoutUser, saveDraft, loadDraft,
    saveUserPreferences, getUserPreferences,
    saveInvoiceToHistory, getInvoiceHistory, deleteInvoiceFromHistory
} from '../../services/storageService';
import { AuthModal } from '../../components/AuthModal';
import { TermsModal } from '../../components/TermsModal';
import { GuideModal } from '../../components/GuideModal';
import { PrivacyPolicyModal } from '../../components/PrivacyPolicyModal';
import { ContactModal } from '../../components/ContactModal';
import { ConversionModal } from '../../components/ConversionModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '../../services/supabase';

const TEMPLATES: { id: TemplateId, label: string }[] = [
    { id: 'modern', label: 'モダン' }, { id: 'classic', label: 'クラシック' }, { id: 'simple', label: 'シンプル' },
    { id: 'bold', label: '太字強調' }, { id: 'elegant', label: 'エレガント' }, { id: 'tech', label: 'テック' },
    { id: 'nature', label: 'ネイチャー' }, { id: 'grid', label: 'グリッド' }, { id: 'corporate', label: 'コーポレート' },
    { id: 'monochrome', label: 'モノクロ' }, { id: 'warm', label: 'ウォーム' }, { id: 'cool', label: 'クール' },
    { id: 'compact', label: 'コンパクト' }, { id: 'playful', label: 'プレイフル' }, { id: 'shadow', label: 'シャドウ' },
    { id: 'borderless', label: '枠なし' }, { id: 'sharp', label: 'シャープ' }, { id: 'soft', label: 'ソフト' },
    { id: 'vintage', label: 'ビンテージ' }, { id: 'studio', label: 'スタジオ' }, { id: 'receipt', label: 'レシート (感熱紙)' }
];

const UNIT_SUGGESTIONS = ['式', '個', '月', 'h', '日', '件'];
const DOCUMENT_TITLES = ['御請求書', '御見積書', '納品書', '領収書', 'INVOICE', 'QUOTATION'];

export const Editor: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(getCurrentUser());
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isConversionOpen, setIsConversionOpen] = useState(false);
    const [history, setHistory] = useState<SavedInvoice[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [themeColor, setThemeColor] = useState('#4f46e5');
    const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
        const saved = loadDraft();
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

        if (saved) {
            return { ...defaultData, ...saved };
        }
        return defaultData;
    });

    const [template, setTemplate] = useState<TemplateId>((searchParams.get('template') as TemplateId) || 'modern');
    const [activeTab, setActiveTab] = useState<'items' | 'client' | 'issuer' | 'settings' | 'guide'>('items');
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => { saveDraft(invoiceData); }, [invoiceData]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const userProfile: UserProfile = {
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    email: session.user.email || '',
                    avatarUrl: session.user.user_metadata.avatar_url,
                };
                setUser(userProfile);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const userProfile: UserProfile = {
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    email: session.user.email || '',
                    avatarUrl: session.user.user_metadata.avatar_url,
                };
                setUser(userProfile);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            getInvoiceHistory(user.email, user.id).then(hist => setHistory(hist));
            const prefs = getUserPreferences(user.email);
            if (prefs) setInvoiceData(prev => ({ ...prev, issuer: prefs }));
        } else {
            setHistory([]);
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

    const handleConvert = (targetTitle: string) => {
        setInvoiceData(prev => {
            const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const newNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;

            const newData = {
                ...prev,
                title: targetTitle,
                invoiceNumber: newNumber,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };

            if (targetTitle.includes('見積')) {
                newData.invoiceNumber = newData.invoiceNumber.replace('INV', 'EST');
            } else if (targetTitle.includes('納品')) {
                newData.invoiceNumber = newData.invoiceNumber.replace('INV', 'DEL');
            } else if (targetTitle.includes('領収')) {
                newData.invoiceNumber = newData.invoiceNumber.replace('INV', 'RCT');
            } else if (targetTitle.includes('検収')) {
                newData.invoiceNumber = newData.invoiceNumber.replace('INV', 'ACP');
            }

            return newData;
        });
        alert(`${targetTitle}として複製を作成しました！`);
    };

    const downloadPdf = async () => {
        if (!previewRef.current || isGeneratingPdf) return;
        setIsGeneratingPdf(true);

        try {
            const scale = 1.5;

            const canvas = await html2canvas(previewRef.current, {
                scale: scale,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: 1280,
                windowHeight: 3000,
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.querySelector('.print-area') as HTMLElement;
                    if (el) {
                        if (template === 'receipt') {
                            el.style.width = '80mm';
                            el.style.minHeight = 'auto';
                            el.style.height = 'auto';
                            el.style.padding = '0';
                            el.style.margin = '0 auto';
                        } else {
                            el.style.width = '210mm';
                            el.style.minHeight = '297mm';
                            el.style.height = 'auto';
                            el.style.padding = '10mm';
                            el.style.margin = '0';
                        }
                        el.style.overflow = 'visible';
                        el.style.transform = 'none';
                        el.style.boxSizing = 'border-box';
                        el.style.borderRadius = '0';
                        el.style.boxShadow = 'none';
                        el.style.position = 'static';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.90);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();

            const ratio = pdfPageWidth / imgProps.width;
            const finalWidth = pdfPageWidth;
            const finalHeight = imgProps.height * ratio;

            let heightLeft = finalHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, finalWidth, finalHeight);
            heightLeft -= pdfPageHeight;

            while (heightLeft > 0) {
                position -= pdfPageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, finalWidth, finalHeight);
                heightLeft -= pdfPageHeight;
            }

            pdf.save(`${invoiceData.title}_${invoiceData.invoiceNumber}.pdf`);

            if (user) {
                const saved: SavedInvoice = { ...invoiceData, id: crypto.randomUUID(), createdAt: Date.now(), templateId: template };
                saveInvoiceToHistory(user.email, saved, user.id);
                setHistory(prev => [saved, ...prev]);
            }

            // Redirect to thank you page would go here in the new version
            navigate('/download/complete');
            // alert("PDFをダウンロードしました！✨\n※いかなる損害についても当サービスは責任を負いません。");

            // We will modify this part later to use the router navigation

        } catch (e: any) {
            console.error(e);
            alert(`PDF作成に失敗しました。\nエラー内容: ${e.message || e}\nメモリ不足や画像読込エラーの可能性があります。`);
        } finally {
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
                    onLogoutClick={() => {
                        supabase.auth.signOut();
                        logoutUser();
                        setUser(null);
                    }}
                    onHistoryClick={() => setShowHistory(!showHistory)}
                    onConvertClick={() => setIsConversionOpen(true)}
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

                    <div className="mt-auto pt-4 space-y-4">
                        <TipsCard />
                        <AdUnit
                            slot="8901234567"
                            format="rectangle"
                            responsive={true}
                            className="min-h-[250px] bg-slate-50 rounded-2xl flex items-center justify-center text-xs text-slate-300"
                        />
                    </div>
                </div>

                <div className="px-3 py-2 bg-white border-t shrink-0">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-300 uppercase leading-none mb-0.5">合計（税込）</span>
                            <span className="text-lg font-black text-slate-800 tracking-tighter leading-none">{totals.grandTotal.toLocaleString()}<span className="text-[9px] ml-0.5 text-slate-400 font-bold">円</span></span>
                        </div>
                        <div className="flex items-center gap-1 mb-0.5">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[8px] font-black text-slate-300 tracking-widest uppercase scale-90 origin-right">Secured</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex flex-col gap-1.5 items-center">
                        <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsPrivacyOpen(true)} className="text-[8px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">Privacy</button>
                            <span className="text-[8px] text-slate-200">•</span>
                            <button onClick={() => setIsTermsOpen(true)} className="text-[8px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">Terms</button>
                            <span className="text-[8px] text-slate-200">•</span>
                            <button onClick={() => setIsContactOpen(true)} className="text-[8px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">Contact</button>
                        </div>
                        <div className="flex items-center gap-2 justify-center w-full">
                            <button onClick={() => setIsGuideOpen(true)} className="text-[8px] font-black text-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 px-2 py-1 rounded w-full transition-all text-center">使い方ガイド</button>
                        </div>
                        <p className="text-[7px] font-bold text-slate-200 text-center uppercase tracking-widest scale-75 origin-bottom">© 2024 Seikyu AI.</p>
                    </div>
                </div>
            </aside>

            <main className={`${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'} flex-1 flex-col items-center overflow-y-auto p-4 lg:p-12 relative custom-scrollbar h-full`}>

                <div className="w-full max-w-[210mm] mb-6 hidden lg:block no-print">
                    <AdUnit
                        slot="1234567890"
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
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                deleteInvoiceFromHistory(user!.email, item.id, user!.id)
                                                    .then(() => setHistory(prev => prev.filter(h => h.id !== item.id)));
                                            }} className="absolute top-4 right-4 bg-white text-slate-200 hover:text-red-500 shadow-sm p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-slate-100"><Trash2 size={16} /></button>
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
            <ConversionModal
                isOpen={isConversionOpen}
                onClose={() => setIsConversionOpen(false)}
                onConvert={handleConvert}
                currentTitle={invoiceData.title}
            />

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
