import { useContext } from 'react';
import { StudyNavigationContext } from './studyNavigationContext';

export const useStudyNavigation = () => {
    const context = useContext(StudyNavigationContext);
    if (context === undefined) {
        throw new Error('useStudyNavigation must be used within a StudyNavigationProvider');
    }
    return context;
};
