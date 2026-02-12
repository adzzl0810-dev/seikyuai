import React from 'react';
import { ShieldCheck, Heart, Zap, FileText } from 'lucide-react';

export const SEOContent: React.FC = () => {
    return (
        <div className="w-full max-w-[210mm] mt-24 mb-16 space-y-16 no-print">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-600">
                <div className="space-y-3 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="bg-indigo-50 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-indigo-600"><Zap size={24} /></div>
                    <h3 className="font-bold text-slate-800">登録不要・完全無料</h3>
                    <p className="text-xs leading-relaxed">面倒な会員登録やログインは一切不要。ブラウザを開いたらすぐに請求書の作成を始められます。すべての機能を無料で利用可能です。</p>
                </div>
                <div className="space-y-3 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="bg-green-50 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-green-600"><ShieldCheck size={24} /></div>
                    <h3 className="font-bold text-slate-800">インボイス制度対応</h3>
                    <p className="text-xs leading-relaxed">適格請求書発行事業者の登録番号や、税率ごとの消費税額計算など、日本のインボイス（適格請求書）制度の要件を完全に満たしています。</p>
                </div>
                <div className="space-y-3 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="bg-rose-50 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-rose-600"><Heart size={24} /></div>
                    <h3 className="font-bold text-slate-800">プライバシー重視</h3>
                    <p className="text-xs leading-relaxed">入力されたデータはブラウザ内でのみ処理され、サーバーに保存されることはありません。個人情報や取引データが外部に漏れる心配はありません。</p>
                </div>
            </div>

            {/* Rich Text Content */}
            <div className="prose prose-slate prose-sm max-w-none">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3 tracking-tighter">
                    <FileText className="text-indigo-600" />
                    Seikyu AI について
                </h2>
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-indigo-500 pl-4">このツールでできること</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 list-none pl-0">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>インボイス制度（適格請求書）に対応した請求書の作成</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>PDF形式でのダウンロード・保存</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>会社印（角印）の電子印影作成・画像アップロード</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>20種類以上のプロ仕様テンプレート切り替え</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>消費税（10%・軽減8%）の自動計算・再計算</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>取引先情報の郵便番号検索</li>
                        </ul>
                    </section>

                    <section className="bg-slate-50 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-3">よくある質問</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm mb-1">Q. 本当に無料ですか？</h4>
                                <p className="text-xs text-slate-600">A. はい、すべての機能を完全無料でご利用いただけます。将来的に有料化する予定も現時点ではありません。</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm mb-1">Q. データは保存されますか？</h4>
                                <p className="text-xs text-slate-600">A. 入力データはお客様のブラウザ（ローカルストレージ）にのみ一時保存されます。当社のサーバーには一切送信・保存されないため、セキュリティ面でも安心してご利用いただけます。</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm mb-1">Q. スマートフォンで作れますか？</h4>
                                <p className="text-xs text-slate-600">A. はい、レスポンシブデザインに対応しているため、スマートフォンやタブレットからでも快適に作成・PDF保存が可能です。</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
