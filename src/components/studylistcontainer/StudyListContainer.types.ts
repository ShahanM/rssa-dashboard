import { Study, SelectableCardProps } from "../../utils/generics.types";

export interface StudyListContainerProps extends SelectableCardProps{
	studies: Study[];
}