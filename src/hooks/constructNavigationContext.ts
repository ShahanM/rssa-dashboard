import { createContext } from 'react';

interface ConstructNavigationContextType {
    setConstructDisplayName: (name: string) => void;
    setStepDisplayName: (name: string) => void;
    setPageDisplayName: (name: string) => void;
    constructDisplayName: string | null;
    stepDisplayName: string | null;
    pageDisplayName: string | null;
}

export const ConstructNavigationContext = createContext<ConstructNavigationContextType | undefined>(undefined);
