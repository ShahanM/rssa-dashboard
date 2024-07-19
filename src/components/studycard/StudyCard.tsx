import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import "./StudyCard.css";
import { StudyCardProps } from "./StudyCard.types";

const StudyCard: React.FC<StudyCardProps> = ({ study, selected, onClick }) => {

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	}).format(new Date(study.date_created));


	return (
		<Row className={`study-card d-flex align-items-center ${selected ? 'selected' : ''}`}
			onClick={() => onClick(study.id)}>
			<Col md={9}>
				<h6>{study.name}</h6>
				<p className="study-card-date">{formattedDate}</p>
				<p>{study.description}</p>
			</Col>
			<Col md={1}>
				<Button variant="primary">Edit</Button>
			</Col>
		</Row>
	);
}

export default StudyCard;