export interface Study {
	id: string;
	name: string;
	description: string;
	date_created: string;
}

export interface StudyStep {
	id: string;
	study_id: string;
	name: string;
	description: string;
	order_position: number;
	date_created: string;
}

export interface Page {
	id: string;
	study_id: string;
	step_id: string;
	name: string;
	description: string;
	order_position: number;
	date_created: string;
}

export interface SelectableCardListProps<Type> {
	components: Type[];
	selected: string;
	onChangeSelection: (id: string) => void;
}

export interface SelectableCardProps<Type> {
	component: Type;
	selected: boolean;
	onClick: (id: string) => void;
}

export interface InputFormModalProps {
	show: boolean;
	showHideCallback: (show: boolean) => void;
	requestToken: () => Promise<string>;
	onSuccess: (response: any) => void; // TODO: Define response type
	onAuthError: (error: any) => void; // TODO: Define error type	
}

export interface OrderedInputFormModalProps extends InputFormModalProps {
	maxEmptyPosition: number;
}