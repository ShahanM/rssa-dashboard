import React from "react";
import Container from "react-bootstrap/Container";
import StudyCard from "../studycard/StudyCard";
import { StudyListContainerProps } from "./StudyListContainer.types";


const StudyListContainer: React.FC<StudyListContainerProps> = ({ studies, selected, onChangeSelection }) => {

	return (
		<Container>
			{studies.map((study) => (
				<StudyCard key={study.id} study={study}
					selected={selected === study.id}
					onClick={onChangeSelection} />
			))}
		</Container>
	);
}

export default StudyListContainer;