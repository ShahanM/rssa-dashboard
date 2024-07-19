export interface Study {
	id: string;
	name: string;
	description: string;
	date_created: string;
}

export interface StudyStep {
	id: string;
	name: string;
	description: string;
	order_position: number;
	date_created: string;
}

export interface SelectableCardProps {
	selected: string;
	onChangeSelection: (id: string) => void;
}
