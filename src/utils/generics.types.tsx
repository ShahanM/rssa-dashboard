export type Study = {
	id: string;
	name: string;
	description: string;
	date_created: string;
}

export type StudyCondition = {
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
	pages?: Page[];
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
	selected: string | undefined;
	onChangeSelection: (id: string) => void;
}

export type SelectableCardProps<Type> = {
	component: Type;
	selected: boolean;
	onClick: (id: string) => void;
}

export type ConstructType = {
	id: string;
	type: string;
}

export type SurveyConstruct = {
	id: string;
	name: string;
	desc: string;
	// typeId?: string;
	type: ConstructType;
	scaleId?: string;
}

export type CreateSurveyConstruct = {
	name: string;
	desc: string;
	typeId: string;
	scaleId?: string;
}

export type ConstructScale = {
	id: string;
	levels: number;
	name: string;
	scale_levels: ScaleLevel[];
}

export type ScaleLevel = {
	level: number;
	label: string;
}

export type SurveyConstructDetails = {
	id: string;
	name: string;
	desc: string;
	type: ConstructType;
	scale: ConstructScale;
	items: ConstructItem[];
}

export type ConstructItem = {
	id: string;
	construct_id: string;
	text: string;
	order_position: number;
	item_type: string;
}

export type ConstructItemType = {
	id: string;
	type: string;
}

export type ParticipantType = {
	id: string;
	type: string;
}

export type ConditionCount = {
	condition_id: string
	condition_name: string
	participant_count: number
}

export type StudySummary = {
	id: string
	name: string
	description: string
	date_created: Date
	created_by?: string
	owner?: string
	total_participants: number
	participants_by_condition: ConditionCount[]
}

export type StudyDetail = {
	id: string
	name: string
	description: string
	date_created: Date
	created_by?: string
	owner?: string
	steps: StudyStep[]
	conditions: StudyCondition[]

}