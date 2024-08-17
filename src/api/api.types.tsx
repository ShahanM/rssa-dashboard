import { ScaleLevel } from "../utils/generics.types";

export type NewStudy = {
	name: string;
	description: string;
}

export type NewStudyCondition = {
	study_id: string;
	name: string;
	description: string;
}

export type NewStudyStep = {
	study_id: string;
	name: string;
	description: string;
	order_position: number;
}

export type NewPage = {
	study_id: string;
	step_id: string;
	name: string;
	description: string;
	order_position: number;
}

export type NewSurveyConstruct = {
	name: string;
	desc: string;
	type_id?: string;
	scale_id?: string;
}

export type NewConstructType = {
	type: string;
}

export type NewConstructScale = {
	name: string;
	levels: number;
	scale_levels: ScaleLevel[];
}

export type NewConstructItem = {
	construct_id: string;
	text: string;
	order_position: number;
	item_type: string;
}

export type NewConstructItemType = {
	type: string;
}

export type PageContent = {
	page_id: string;
	construct_id: string;
	order_position: number;
}

export type NewParticipantType = {
	type: string;
}