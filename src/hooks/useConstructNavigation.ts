import { useContext } from 'react';
import { ConstructNavigationContext } from './constructNavigationContext';

export const useConstructNavigation = () => {
    const context = useContext(ConstructNavigationContext);
    if (context === undefined) {
        throw new Error('useStudyNavigation must be used within a StudyNavigationProvider');
    }
    return context;
};
