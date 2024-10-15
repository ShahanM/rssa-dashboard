import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Page, SelectableCardProps, Study, StudyStep, SurveyConstruct } from '../../utils/generics.types';
import { formatDateString, isPage, isStudy } from '../../utils/utils';
import LinkConstructButton from '../linkconstructbutton/LinkConstructButton';
import './ComponentCard.css';
import { getPageContent } from '../../api/endpoints';
import { useAuth0 } from '@auth0/auth0-react';

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
	const [linkingEnabled, setLinkingEnabled] = useState<boolean>(false);
	const [pageContent, setPageContent] = useState<SurveyConstruct[]>([]);
	const { getAccessTokenSilently } = useAuth0();
	const handlePageContentLinking = (construct: SurveyConstruct) => {
		setPageContent([...pageContent, construct]);
	}

	useEffect(() => {
		const fetchPageContent = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getPageContent(component.id, token);
				setPageContent(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (isPage(component)) fetchPageContent();

	}, [component, getAccessTokenSilently]);

	useEffect(() => {
		// Right now we only allow one construct to be linked to a page
		if (pageContent.length > 3) {
			setLinkingEnabled(false);
		} else {
			setLinkingEnabled(true);
		}
	}, [pageContent]);

	return (
		<Row className={`horizontal-card d-flex align-items-center ${selected ? 'selected' : ''}`}
			onClick={() => onClick(component.id)}>
			<h6>{component.name}</h6>
			<p className="description">{component.description}</p>

			{isPage(component) ?
				<>
					{pageContent.length > 0 &&
						pageContent.map((construct) => (
							<p key={construct.id} className="linked-construct">
								{construct.name}
							</p>
						))
					}
					<LinkConstructButton
						component={component}
						linkCallback={handlePageContentLinking}
						enabled={linkingEnabled}
					/>
				</>
				:
				<Button variant="primary">Edit</Button>
			}
		</Row>
	)
}