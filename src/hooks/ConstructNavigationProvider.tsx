import { useState } from 'react';
import { ConstructNavigationContext } from './constructNavigationContext';

interface ConstructNavigationProviderProps {
    children: React.ReactNode;
}

export const ConstructNavigationProvider: React.FC<ConstructNavigationProviderProps> = ({ children }) => {
    const [constructDisplayName, setConstructDisplayName] = useState<string | null>(null);
    const [stepDisplayName, setStepDisplayName] = useState<string | null>(null);
    const [pageDisplayName, setPageDisplayName] = useState<string | null>(null);

    const value = {
        setConstructDisplayName,
        setStepDisplayName,
        setPageDisplayName,
        constructDisplayName,
        stepDisplayName,
        pageDisplayName,
    };

    return <ConstructNavigationContext.Provider value={value}>{children}</ConstructNavigationContext.Provider>;
};
