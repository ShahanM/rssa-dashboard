import { createContext } from 'react';

interface StudyNavigationContextType {
    setStudyDisplayName: (name: string) => void;
    setStepDisplayName: (name: string) => void;
    setPageDisplayName: (name: string) => void;
    studyDisplayName: string | null;
    stepDisplayName: string | null;
    pageDisplayName: string | null;
}

export const StudyNavigationContext = createContext<StudyNavigationContextType | undefined>(undefined);
