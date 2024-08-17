import { ConstructScale, ConstructType, SurveyConstruct, SurveyConstructDetails } from "./generics.types";


export const emptyConstructType: ConstructType = {
	id: "",
	type: ""
};

export const emptyConstructScale: ConstructScale = {
	id: "",
	levels: 0,
	name: "",
	scale_levels: []
};

export const emptyConstruct: SurveyConstruct = {
	id: "",
	name: "",
	desc: "",
	typeId: "",
	scaleId: ""
}

export const emptyConstructDetails: SurveyConstructDetails = {
	id: "",
	name: "",
	desc: "",
	type: emptyConstructType,
	scale: emptyConstructScale,
	items: []
};