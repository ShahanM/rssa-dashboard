import {
	ConstructItem,
	ConstructItemType,
	ConstructScale,
	ConstructType,
	Page,
	ParticipantType,
	Study,
	StudyStep,
	SurveyConstruct,
	SurveyConstructDetails,
	StudyCondition
} from "../utils/generics.types";
import {
	NewConstructItem,
	NewConstructItemType,
	NewConstructScale,
	NewConstructType,
	NewPage,
	NewStudy,
	NewStudyStep,
	NewSurveyConstruct,
	PageContent,
	NewParticipantType,
	NewStudyCondition
} from "./api.types";
import { authenticatedGet, authenticatedPost } from "./requests";


const RSSA_API = process.env.REACT_APP_RSSA_API!;
const RSSA_API_DEV = process.env.REACT_APP_RSSA_API_DEV!;

const API = process.env.NODE_ENV === "production" ? RSSA_API : RSSA_API_DEV;

/* 
 * GET requests to the RSSA API.
 * The following API GET requests can be copied as is to the individual study 
 * applications.
 */
export function getStudySteps(studyId: string, token: string): Promise<StudyStep[]> {
	return authenticatedGet(
		{ url: `${API}step/${studyId}`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getStepPages(stepId: string, token: string): Promise<Page[]> {
	return authenticatedGet(
		{ url: `${API}page/${stepId}`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getPageContent(pageId: string, token: string): Promise<SurveyConstruct[]> {
	return authenticatedGet(
		{ url: `${API}pagecontent/${pageId}`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

/*
 * GET requests to the meta content of the RSSA API.
 * The following API GET requests are not intended to be copied to the individual
 * study applications.
 */
export function getStudies(token: string): Promise<Study[]> {
	return authenticatedGet(
		{ url: `${API}study/`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getStudyConditions(studyId: string, token: string): Promise<StudyCondition[]> {
	return authenticatedGet(
		{ url: `${API}studycondition/${studyId}`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getSurveyConstructs(token: string): Promise<SurveyConstruct[]> {
	return authenticatedGet(
		{ url: `${API}construct/`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getSurveyConstructById(constructId: string, token: string): Promise<SurveyConstructDetails> {
	return authenticatedGet(
		{ url: `${API}construct/${constructId}`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getConstructTypes(token: string): Promise<ConstructType[]> {
	return authenticatedGet(
		{ url: `${API}constructtype/`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getConstructScales(token: string): Promise<ConstructScale[]> {
	return authenticatedGet(
		{ url: `${API}constructscale/`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getConstructItemTypes(token: string): Promise<ConstructItemType[]> {
	return authenticatedGet(
		{ url: `${API}itemtype/`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

export function getParticipantTypes(token: string): Promise<ParticipantType[]> {
	return authenticatedGet(
		{ url: `${API}participanttype/`, token: token, data: null })
		.then((res) => {
			return res;
		});
}

/* 
 * POST requests to the RSSA API.
 * The following POST requests are only for the RSSA Dashboard and require
 * the user to be authenticated with admin privileges.
 */
export function createStudy(data: NewStudy, token: string): Promise<Study> {
	return authenticatedPost(
		{ url: `${API}study/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function duplicateStudy(studyId: string, token: string): Promise<Study> {
	return authenticatedPost(
		{ url: `${API}study/${studyId}`, token: token, data: { studyId } })
		.then((res) => {
			return res;
		});
}

export function createStudyCondition(data: NewStudyCondition, token: string): Promise<StudyCondition> {
	return authenticatedPost(
		{ url: `${API}studycondition/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function createStudyStep(data: NewStudyStep, token: string): Promise<StudyStep> {
	return authenticatedPost(
		{ url: `${API}step/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function createPage(data: NewPage, token: string): Promise<Page> {
	return authenticatedPost(
		{ url: `${API}page/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function linkConstructToPage(data: PageContent, token: string): Promise<SurveyConstruct> {
	console.log(data);
	return authenticatedPost(
		{ url: `${API}pagecontent/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}


/*
* POST requests to the meta content of the RSSA API.
* The following POST requests are only for the RSSA Dashboard and require
* the user to be authenticated with admin privileges.
*/
export function createSurveyConstruct(data: NewSurveyConstruct, token: string): Promise<SurveyConstruct> {
	return authenticatedPost(
		{ url: `${API}construct/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function createConstructType(data: NewConstructType, token: string): Promise<ConstructType> {
	return authenticatedPost(
		{ url: `${API}constructtype/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function createConstructScale(data: NewConstructScale, token: string): Promise<ConstructScale> {
	return authenticatedPost(
		{ url: `${API}constructscale/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function createConstructItem(data: NewConstructItem, token: string): Promise<ConstructItem> {
	return authenticatedPost(
		{ url: `${API}item/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function createItemType(data: NewConstructItemType, token: string): Promise<ConstructItemType> {
	return authenticatedPost(
		{ url: `${API}itemtype/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}

export function createParticipantType(data: NewParticipantType, token: string): Promise<ParticipantType> {
	return authenticatedPost(
		{ url: `${API}participanttype/`, token: token, data: data })
		.then((res) => {
			return res;
		});
}