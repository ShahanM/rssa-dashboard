import React, { createContext, useContext, useState } from 'react';


interface ConstructNavigationContextType {
	setStudyDisplayName: (name: string) => void;
	setStepDisplayName: (name: string) => void;
	setPageDisplayName: (name: string) => void;
	studyDisplayName: string | null;
	stepDisplayName: string | null;
	pageDisplayName: string | null;
}

const ConstructNavigationContext = createContext<ConstructNavigationContextType | undefined>(undefined);


export const useConstructNavigation = () => {
	const context = useContext(ConstructNavigationContext);
	if (context === undefined) {
		throw new Error('useStudyNavigation must be used within a StudyNavigationProvider');
	}
	return context;
}

interface ConstructNavigationProviderProps {
	children: React.ReactNode;
}

export const ConstructNavigationProvider: React.FC<ConstructNavigationProviderProps> = ({ children }) => {
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
		<ConstructNavigationContext.Provider value={value}>
			{children}
		</ConstructNavigationContext.Provider>
	)
}