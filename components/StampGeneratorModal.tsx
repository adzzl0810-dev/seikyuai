import React, { useState, useRef, useEffect } from 'react';
import { X, Stamp, Check } from 'lucide-react';

interface StampGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (dataUrl: string) => void;
}

export const StampGeneratorModal: React.FC<StampGeneratorModalProps> = ({ isOpen, onClose, onGenerate }) => {
    const [text, setText] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            drawStamp();
        }
    }, [isOpen, text]);

    const drawStamp = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 300;
        canvas.width = size;
        canvas.height = size;

        // Clear
        ctx.clearRect(0, 0, size, size);

        if (!text) return;

        // Stamp Settings
        const color = '#DC2626'; // Red-600
        const borderWidth = 6; // Thin border for realism
        const radius = (size - borderWidth) / 2;
        const center = size / 2;

        ctx.strokeStyle = color;
        ctx.lineWidth = borderWidth;
        ctx.fillStyle = color;

        // Draw Circle (Double circle effect usually looks outdated, simple single bold is modern)
        ctx.beginPath();
        ctx.arc(center, center, radius - 4, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Dynamic font sizing and vertical layout simulation based on length
        let fontSize = size * 0.45;
        let font = `700 ${fontSize}px "Hiragino Mincho ProN", "Yu Mincho", serif`;

        if (text.length === 1) {
            fontSize = size * 0.6;
            font = `700 ${fontSize}px "Hiragino Mincho ProN", "Yu Mincho", serif`;
            ctx.font = font;
            ctx.fillText(text, center, center + (fontSize * 0.1)); // optical correction
        } else if (text.length === 2) {
            // Vertical 2 chars
            font = `700 ${fontSize}px "Hiragino Mincho ProN", "Yu Mincho", serif`;
            ctx.font = font;
            const lineHeight = fontSize * 0.9;
            ctx.fillText(text[0], center, center - (lineHeight * 0.5));
            ctx.fillText(text[1], center, center + (lineHeight * 0.5));
        } else if (text.length === 3) {
            // Vertical 3 chars
            fontSize = size * 0.33;
            font = `700 ${fontSize}px "Hiragino Mincho ProN", "Yu Mincho", serif`;
            ctx.font = font;
            const lineHeight = fontSize * 0.85;
            ctx.fillText(text[0], center, center - lineHeight);
            ctx.fillText(text[1], center, center);
            ctx.fillText(text[2], center, center + lineHeight);
        } else if (text.length === 4) {
            // 2x2 Grid
            fontSize = size * 0.35;
            font = `700 ${fontSize}px "Hiragino Mincho ProN", "Yu Mincho", serif`;
            ctx.font = font;
            const offset = fontSize * 0.55;
            // Top Right
            ctx.fillText(text[0], center + (offset * 0.6), center - (offset * 0.6));
            // Bottom Right
            ctx.fillText(text[1], center + (offset * 0.6), center + (offset * 0.6));
            // Top Left
            ctx.fillText(text[2], center - (offset * 0.6), center - (offset * 0.6));
            // Bottom Left
            ctx.fillText(text[3], center - (offset * 0.6), center + (offset * 0.6));
        } else {
            // 5+ chars: Horizontal condensed or scaling down
            fontSize = size / text.length * 1.4;
            font = `700 ${fontSize}px "Hiragino Mincho ProN", "Yu Mincho", serif`;
            ctx.font = font;
            // Horizontal for long names
            ctx.fillText(text, center, center);
        }

        // Add "Gritty" Texture for Realism
        // Requires globalCompositeOperation or manual noise. Simple noise is good.
        ctx.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const noiseSize = Math.random() * 2;
            ctx.beginPath();
            ctx.arc(x, y, noiseSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    };

    const handleApply = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            onGenerate(dataUrl);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                        <Stamp size={20} className="text-red-500" /> 電子印鑑を作成
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center gap-6">
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            className="w-40 h-40 border border-slate-200 rounded-xl bg-white shadow-inner pattern-grid-lg text-red-500"
                        />
                        {!text && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none text-xs font-bold">
                                プレビュー
                            </div>
                        )}
                    </div>

                    <div className="w-full space-y-2">
                        <label className="text-xs font-bold text-slate-500">印鑑の文字 (最大4文字推奨)</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value.slice(0, 6))}
                            placeholder="田中、山田、佐藤..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={!text}
                        className="flex-1 py-3 px-4 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        <Check size={18} /> 作成する
                    </button>
                </div>
            </div>
        </div>
    );
};
