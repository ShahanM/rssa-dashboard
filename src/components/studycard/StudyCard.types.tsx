import { Study } from "../../utils/generics.types";

export interface StudyCardProps {
	study: Study;
	selected: boolean;
	onClick: (studyId: string) => void;
}