import { SelectableCardProps } from '../../utils/generics.types';

export interface StudyPanelProps extends SelectableCardProps {
	authErrorCallback: (errorMessage: string) => void;
}