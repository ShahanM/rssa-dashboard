import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Page, SelectableCardProps, Study, StudyStep } from '../../utils/generics.types';
import './ComponentCard.css';

// TODO: I see that the StudyCard and StudyStepCard components are very similar. It might be a good idea to make a generic ComponentCard component.
// Instead of differentiating between Study, StudyStep, and Page cards, we can build custom edit buttons for each type of card.
// On second thought, each type of content can have its own FormModal component. This way, we can just pass the correct
// FormModal component to the generic ComponentCard component.
export const StudyCard: React.FC<SelectableCardProps<Study>>
	= ({ component, selected, onClick }) => {

		const formattedDate = new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "2-digit",
		}).format(new Date(component.date_created));


		return (
			<Row className={`component-card d-flex align-items-center ${selected ? 'selected' : ''}`}
				onClick={() => onClick(component.id)}>
				<Col md={10}>
					<h6>{component.name}</h6>
					<p className="date">{formattedDate}</p>
					<p className="description">{component.description}</p>
				</Col>
				<Col md={2}>
					{/* TODO: Added Edit feature. It might be a good idea to make a EditStudy component. */}
					<Button variant="primary">Edit</Button>
				</Col>
			</Row>
		);
	}


export const StudyStepCard: React.FC<SelectableCardProps<StudyStep>>
	= ({ component, selected, onClick }) => {

		return (
			<Row className={`component-card d-flex align-items-center ${selected ? 'selected' : ''}`}
				onClick={() => onClick(component.id)}>
				<Col md={10}>
					<h6>{component.name}</h6>
					<p className="description">{component.description}</p>
				</Col>
				<Col md={2}>
					<Button variant="primary">Edit</Button>
				</Col>
			</Row>
		);
	}


export const PageCard: React.FC<SelectableCardProps<Page>>
	= ({ component, selected, onClick }) => {
		return (
			<Row className={`component-card d-flex align-items-center ${selected ? 'selected' : ''}`}
				onClick={() => onClick(component.id)}>
				<Col md={10}>
					<h6>{component.name}</h6>
					<p className="description">{component.description}</p>
				</Col>
				<Col md={2}>
					<Button variant="primary">Edit</Button>
				</Col>
			</Row>
		)
	}