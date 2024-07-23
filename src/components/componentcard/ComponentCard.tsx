import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Page, SelectableCardProps, Study, StudyStep } from '../../utils/generics.types';
import { formatDateString, isStudy } from '../../utils/utils';
import './ComponentCard.css';

// TODO: I see that the StudyCard and StudyStepCard components are very similar. It might be a good idea to make a generic ComponentCard component.
// Instead of differentiating between Study, StudyStep, and Page cards, we can build custom edit buttons for each type of card.
// On second thought, each type of content can have its own FormModal component. This way, we can just pass the correct
// FormModal component to the generic ComponentCard component.

export const VerticalComponentCard: React.FC<SelectableCardProps<Study | StudyStep | Page>> = ({
	component, selected, onClick }) => {

	return (
		<Row className={`component-card d-flex align-items-center ${selected ? 'selected' : ''}`}
			onClick={() => onClick(component.id)}>
			<Col md={10}>
				<h6>{component.name}</h6>
				{isStudy(component) &&
					<p className="date">{formatDateString(component.date_created)}</p>
				}
				<p className="description">{component.description}</p>
			</Col>
			<Col md={2}>
				<Button variant="primary">Edit</Button>
			</Col>
		</Row>
	);
}

export const HorizontalComponentCard: React.FC<SelectableCardProps<Study | StudyStep | Page>> = ({ 
	component, selected, onClick }) => {
	return (
		<Row className={`horizontal-card d-flex align-items-center ${selected ? 'selected' : ''}`}
			onClick={() => onClick(component.id)}>
			<h6>{component.name}</h6>
			<p className="description">{component.description}</p>
			<Button variant="primary">Edit</Button>
		</Row>
	)
}