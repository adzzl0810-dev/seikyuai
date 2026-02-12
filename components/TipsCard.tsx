import React, { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

const TIPS = [
    "消費税の端数処理は、1つの適格請求書につき税率ごとに1回ずつ行うルールです。",
    "適格請求書発行事業者の登録番号は T + 13桁 の数字です。",
    "電子印鑑は法的な効力を持ちませんが、商習慣として信頼性を高める効果があります。",
    "PDFをダウンロードしたら、必ず内容に誤りがないか確認しましょう。",
    "請求書の保存期間は、原則として7年間（欠損金の繰越控除を受ける場合は10年間）です。",
    "インボイス制度では、3万円未満の取引でも領収書や請求書の保存が必要な場合があります。",
    "適格返還請求書（返還インボイス）は、値引きや返品があった場合に交付が必要です。",
    "端数処理は「切り捨て」「四捨五入」「切り上げ」のいずれでも構いませんが、統一して運用しましよう。"
];

export const TipsCard: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [tip, setTip] = useState("");

    useEffect(() => {
        // Random tip on mount
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 relative animate-in fade-in slide-in-from-bottom-2">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-amber-400 hover:text-amber-600 transition-colors p-1"
            >
                <X size={14} />
            </button>
            <div className="flex gap-3">
                <div className="bg-amber-100 text-amber-500 p-2 rounded-xl shrink-0 h-fit">
                    <Lightbulb size={18} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">One Point Tip</h4>
                    <p className="text-xs font-bold text-amber-700 leading-relaxed">
                        {tip}
                    </p>
                </div>
            </div>
        </div>
    );
};
