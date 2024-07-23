import React from "react";
import { Alert } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Page, SelectableCardListProps, Study, StudyStep } from "../../utils/generics.types";
import { StudyCard, StudyStepCard, PageCard } from "../componentcard/ComponentCard";
import './ComponentList.css';

// TODO: I see that the StudyList and StudyStepList components are very similar. It might be a good idea to make a generic ComponentList component.
// Each type of content can have its own FormModal component. This way, we can just pass the correct FormModal component to the generic ComponentList component.

export const StudyList: React.FC<SelectableCardListProps<Study>>
	= ({ components, selected, onChangeSelection }) => {

		return (
			<Container>
				{components.length > 0 ? components.map((study) => (
					<StudyCard key={study.id} component={study}
						selected={selected === study.id}
						onClick={onChangeSelection} />
				)) :
					<Alert variant="warning">
						<h6>No studies to show.</h6>
						<p>There were no studies associated with this.</p>
					</Alert>
				}
			</Container>
		);
	}


export const StudyStepList: React.FC<SelectableCardListProps<StudyStep>>
	= ({ components, selected, onChangeSelection }) => {
		return (
			<Container>
				{components.length > 0 ? components.map((step) => (
					<StudyStepCard key={step.id} component={step}
						selected={selected === step.id}
						onClick={onChangeSelection} />
				)) :
					<Alert variant="warning">
						<h6>No steps to show.</h6>
						<p>There are no steps or no study was selected.</p>
					</Alert>}
			</Container>
		);
	}


export const PageList: React.FC<SelectableCardListProps<Page>>
	= ({ components, selected, onChangeSelection }) => {
		return (
			<Container className="horizontal-list">
				{components.length > 0 ? components.map((page) => (
					<PageCard key={page.id} component={page}
						selected={selected === page.id}
						onClick={onChangeSelection} />
				)) :
					<Alert variant="warning">
						<h6>No pages to show.</h6>
						<p>There are no pages or no step was selected.</p>
					</Alert>}
			</Container>
		);
	}