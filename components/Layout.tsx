import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

import { FloatingPaths } from './ui/background-paths';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="relative flex flex-col lg:flex-row h-screen overflow-hidden bg-transparent font-sans isolate">
            <div className="absolute inset-0 -z-10 overflow-hidden opacity-60">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>
            {children}
        </div>
    );
};
