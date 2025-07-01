import React, { createContext, useContext, useState } from 'react';


interface StudyNavigationContextType {
	setStudyDisplayName: (name: string) => void;
	setStepDisplayName: (name: string) => void;
	setPageDisplayName: (name: string) => void;
	studyDisplayName: string | null;
	stepDisplayName: string | null;
	pageDisplayName: string | null;
}

const StudyNavigationContext = createContext<StudyNavigationContextType | undefined>(undefined);


export const useStudyNavigation = () => {
	const context = useContext(StudyNavigationContext);
	if (context === undefined) {
		throw new Error('useStudyNavigation must be used within a StudyNavigationProvider');
	}
	return context;
}

interface StudyNavigationProviderProps {
	children: React.ReactNode;
}

export const StudyNavidationProvider: React.FC<StudyNavigationProviderProps> = ({ children }) => {
	const [studyDisplayName, setStudyDisplayName] = useState<string | null>(null);
	const [stepDisplayName, setStepDisplayName] = useState<string | null>(null);
	const [pageDisplayName, setPageDisplayName] = useState<string | null>(null);

	const value = {
		setStudyDisplayName,
		setStepDisplayName,
		setPageDisplayName,
		studyDisplayName,
		stepDisplayName,
		pageDisplayName
	}


	return (
		<StudyNavigationContext.Provider value={value}>
			{children}
		</StudyNavigationContext.Provider>
	)
}