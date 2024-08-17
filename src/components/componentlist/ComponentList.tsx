import React from "react";
import { Alert } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Page, SelectableCardListProps, Study, StudyStep } from "../../utils/generics.types";
import { VerticalComponentCard, HorizontalComponentCard } from "../componentcard/ComponentCard";
import './ComponentList.css';


export const VerticalComponentList: React.FC<SelectableCardListProps<Study | StudyStep | Page>> = ({
	components, selected, onChangeSelection }) => {
	return (
		<Container>
			{components.length > 0 ? components.map((component) => (
				<VerticalComponentCard key={component.id} component={component}
					selected={selected === component.id}
					onClick={onChangeSelection} />
			)) :
				<Alert variant="warning">
					<h6>No components to show.</h6>
					<p>There are no components to show.</p>
				</Alert>}
		</Container>
	);
}


export const HorizontalComponentList: React.FC<SelectableCardListProps<Study | StudyStep | Page>> = ({
	components, selected, onChangeSelection }) => {
	return (
		<Container className="horizontal-list">
			{components.length > 0 ? components.map((component) => (
				<HorizontalComponentCard key={component.id} component={component}
					selected={selected === component.id}
					onClick={onChangeSelection} />
			)) :
				<Alert variant="warning">
					<h6>No components to show.</h6>
					<p>There are no components to show.</p>
				</Alert>}
		</Container>
	);
}
