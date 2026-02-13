import { TaxRate } from '../types';

export interface PresetItem {
    description: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    taxRate: TaxRate;
}

export interface IndustryPreset {
    id: string;
    label: string;
    icon: string; // Emoji or Lucide icon name
    items: PresetItem[];
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
    {
        id: 'engineer',
        label: 'エンジニア',
        icon: '💻',
        items: [
            {
                description: 'システム開発費（○○機能実装）',
                quantity: 1,
                unitPrice: 300000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: 'サーバー構築・設定費',
                quantity: 1,
                unitPrice: 50000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: '要件定義・設計費',
                quantity: 1,
                unitPrice: 100000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
        ],
    },
    {
        id: 'designer',
        label: 'デザイナー',
        icon: '🎨',
        items: [
            {
                description: 'Webデザイン制作費（TOPページ）',
                quantity: 1,
                unitPrice: 150000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: '下層ページデザイン制作費',
                quantity: 4,
                unitPrice: 30000,
                unit: 'ページ',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: 'バナー制作費',
                quantity: 2,
                unitPrice: 10000,
                unit: '点',
                taxRate: TaxRate.STANDARD,
            },
        ],
    },
    {
        id: 'writer',
        label: 'ライター',
        icon: '✒️',
        items: [
            {
                description: '記事執筆費（取材・構成費含む）',
                quantity: 1,
                unitPrice: 30000,
                unit: '本',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: 'インタビュー取材費',
                quantity: 1,
                unitPrice: 10000,
                unit: '回',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: '交通費（実費）',
                quantity: 1,
                unitPrice: 1200,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
        ],
    },
    {
        id: 'construction',
        label: '建設・工事',
        icon: '🔨',
        items: [
            {
                description: '工事一式（材料費含む）',
                quantity: 1,
                unitPrice: 500000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: '人工（作業員2名×3日）',
                quantity: 6,
                unitPrice: 20000,
                unit: '人工',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: '諸経費・運搬費',
                quantity: 1,
                unitPrice: 30000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
        ],
    },
    {
        id: 'ubereats',
        label: '配達員',
        icon: '🚴',
        items: [
            {
                description: '配達報酬（○○期間分）',
                quantity: 1,
                unitPrice: 120000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
            {
                description: 'クエスト達成報酬',
                quantity: 1,
                unitPrice: 15000,
                unit: '式',
                taxRate: TaxRate.STANDARD,
            },
        ],
    },
];
