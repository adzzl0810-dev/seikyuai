import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    path?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title = 'Seikyu AI | 無料・登録不要のインボイス対応請求書作成サービス',
    description = 'ブラウザだけで完結する、完全無料の請求書作成ツール。インボイス制度対応、美しいテンプレート、電子帳簿保存法対応。PDFダウンロードもメール送信もこれひとつで。',
    keywords = '請求書, 無料, インボイス, PDF, テンプレート, エクセル, 領収書, 見積書, 個人事業主, フリーランス',
    path = ''
}) => {
    const baseUrl = 'https://seikyuai.vercel.app'; // Production URL
    const url = `${baseUrl}${path}`;
    const siteTitle = title.includes('Seikyu AI') ? title : `${title} | Seikyu AI`;

    return (
        <Helmet>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${baseUrl}/og-image.png`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={`${baseUrl}/og-image.png`} />

            <link rel="canonical" href={url} />
        </Helmet>
    );
};
