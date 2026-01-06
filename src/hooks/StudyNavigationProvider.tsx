import { useState } from 'react';
import { StudyNavigationContext } from './studyNavigationContext';

interface StudyNavigationProviderProps {
    children: React.ReactNode;
}

export const StudyNavigationProvider: React.FC<StudyNavigationProviderProps> = ({ children }) => {
    const [studyDisplayName, setStudyDisplayName] = useState<string | null>(null);
    const [stepDisplayName, setStepDisplayName] = useState<string | null>(null);
    const [pageDisplayName, setPageDisplayName] = useState<string | null>(null);

    const value = {
        setStudyDisplayName,
        setStepDisplayName,
        setPageDisplayName,
        studyDisplayName,
        stepDisplayName,
        pageDisplayName,
    };

    return <StudyNavigationContext.Provider value={value}>{children}</StudyNavigationContext.Provider>;
};
