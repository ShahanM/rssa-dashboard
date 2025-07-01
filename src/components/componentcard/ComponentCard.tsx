import React, { useEffect, useState, useMemo } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Page, SelectableCardProps, Study, StudyStep, SurveyConstruct } from '../../utils/generics.types';
import { formatDateString, isPage, isStudy } from '../../utils/utils';
import LinkConstructButton from '../linkconstructbutton/LinkConstructButton';
import './ComponentCard.css';
import { getPageContent } from '../../api/endpoints';
import { useAuth0 } from '@auth0/auth0-react';


const LinkedConstructList: React.FC<{ constructs: SurveyConstruct[] }> = ({ constructs }) => {
	return (
		<div>
			{constructs.map((construct) => (
				<p key={construct.id} className="linked-construct">
					{construct.name}
				</p>
			))}
		</div>
	);
};


export const VerticalComponentCard: React.FC<SelectableCardProps<Study | StudyStep | Page>> = ({
	component, selected, onClick }) => {

	return (
		<Card className={`component-card ${selected ? 'selected' : ''}`} onClick={() => onClick(component.id)}>
			<Card.Header>
				<Card.Title>{component.name}</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">
					{isStudy(component) && formatDateString(component.date_created)}
				</Card.Subtitle>
			</Card.Header>
			<Card.Body>
				<Card.Text className="description">
					{component.description ? component.description : "No description available."}
				</Card.Text>
			</Card.Body>
			<Card.Footer>
				<Button variant="primary">Edit</Button>
			</Card.Footer>
		</Card>
	);
}


export const HorizontalComponentCard: React.FC<SelectableCardProps<Study | StudyStep | Page>> = ({
	component, selected, onClick,
}) => {
	const [pageContent, setPageContent] = useState<SurveyConstruct[]>([]);
	const { getAccessTokenSilently } = useAuth0();

	const linkingEnabled = useMemo(() => pageContent.length <= 3, [pageContent]);

	const handlePageContentLinking = (construct: SurveyConstruct) => {
		setPageContent((prev) => [...prev, construct]);
	};

	const handleCardClick = () => {
		onClick(component.id);
	};

	useEffect(() => {
		const fetchPageContent = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getPageContent(component.id, token);
				setPageContent(response);
			} catch (error) {
				console.error("Failed to fetch page content:", error);
				alert("Failed to load page content.");
			}
		};

		if (isPage(component)) {
			fetchPageContent();
		}
	}, [component, getAccessTokenSilently]);

	return (
		<Card className={`component-card ${selected ? 'selected' : ''}`} onClick={handleCardClick}>
			<Card.Header>
				<Card.Title>{component.name}</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">
					{isStudy(component) && formatDateString(component.date_created)}
				</Card.Subtitle>
			</Card.Header>
			<Card.Body>
				<Card.Text className="description">
					{component.description ? component.description : "No description available."}
				</Card.Text>
				{isPage(component) ? (
					<>
						{pageContent.length > 0 && <LinkedConstructList constructs={pageContent} />}
						{/* <LinkConstructButton component={component} linkCallback={handlePageContentLinking} enabled={linkingEnabled} /> */}
					</>
				) : (
					<Button variant="primary">Edit</Button>
				)}
			</Card.Body>
			<Card.Footer>
				<Button variant="primary" onClick={handleCardClick}>Edit</Button>
			</Card.Footer>
		</Card>
	);
};