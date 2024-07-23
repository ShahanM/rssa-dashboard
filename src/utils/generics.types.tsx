export type Study = {
	id: string;
	name: string;
	description: string;
	date_created: string;
}

export interface OrderedComponent {
	id: string;
	order_position: number;
}

export interface StudyStep extends OrderedComponent {
	study_id: string;
	name: string;
	description: string;
	date_created: string;
}

export interface Page extends OrderedComponent {
	study_id: string;
	step_id: string;
	name: string;
	description: string;
	date_created: string;
}

export interface SelectableCardListProps<Type> {
	components: Type[];
	selected: string;
	onChangeSelection: (id: string) => void;
}

export type SelectableCardProps<Type> = {
	component: Type;
	selected: boolean;
	onClick: (id: string) => void;
}
