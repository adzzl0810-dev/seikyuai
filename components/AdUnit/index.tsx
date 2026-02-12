import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
    layout?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({
    slot,
    format = 'auto',
    responsive = true,
    className = '',
    style,
    layout
}) => {
    const adInit = useRef(false);

    useEffect(() => {
        // Prevent double initialization in React Strict Mode
        if (adInit.current) return;
        adInit.current = true;

        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className={`ad-unit-container overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-3080048643511723"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
                {...(layout ? { "data-ad-layout": layout } : {})}
            />
        </div>
    );
};
