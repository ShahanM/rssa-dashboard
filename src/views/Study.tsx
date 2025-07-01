import React from 'react';
import { Button, Container, Nav, Row } from 'react-bootstrap';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { StudyNavidationProvider, useStudyNavigation } from '../hooks/StudyNavigationContext';
import StudySummaryView from './StudySummary';


const StudyContent: React.FC = () => {
	const { studyId, stepId, pageId } = useParams<{ studyId: string; stepId: string; pageId: string }>();
	const location = useLocation();
	const { studyDisplayName, stepDisplayName, pageDisplayName } = useStudyNavigation();

	const studyRootPath = `/studies/${studyId}`;
	const relativePathSegments = location.pathname
		.substring(location.pathname.indexOf(studyRootPath) + studyRootPath.length)
		.split('/')
		.filter(segment => segment !== '');

	const isStudyRoot = relativePathSegments.length === 0;

	const breadcrumbItems = [];
	if (studyDisplayName) {
		const isStudyNameClickable = !isStudyRoot;
		breadcrumbItems.push(
			<React.Fragment key="study-root">
				{isStudyNameClickable ? (
					<Link to={`/studies/${studyId}`} className="breadcrumb-link">
						{studyDisplayName}
					</Link>
				) : (
					<span className="breadcrumb-current">{studyDisplayName} &gt;</span>
				)}
			</React.Fragment>
		);
	} else {
		breadcrumbItems.push(<span key="study-loading" className="breadcrumb-current">Loading Study...</span>);
	}
	let currentPathAccumulator = studyRootPath;

	relativePathSegments.forEach((segment, index) => {
		currentPathAccumulator += `/${segment}`;

		const isLast = index === relativePathSegments.length - 1;

		let displayName = segment;
		let isClickable = false;

		if (!(segment === 'steps' || segment === 'pages')) {
			if (segment === stepId) {
				displayName = stepDisplayName || `${stepId.substring(0, 8)}`;
				isClickable = true;
			} else if (segment === pageId) {
				displayName = pageDisplayName || `${pageId.substring(0, 8)}`;
				isClickable = false;
			}
			breadcrumbItems.push(
				<React.Fragment key={currentPathAccumulator}>
					<span className="breadcrumb-separator"> / </span>
					{isLast || !isClickable ? (
						<span className="breadcrumb-current">{displayName}</span>
					) : (
						<Link to={currentPathAccumulator} className="breadcrumb-link">
							{displayName}
						</Link>
					)}
				</React.Fragment>
			);
		}

	});
	return (
		<Container className="mt-4">
			<Row className="box-outline">
				<div className="container-header-content">
					<Link to={"/studies"}><Button>&lt; Go Back</Button></Link>
				</div>
				<div className="container-header-content">
					<h2>{studyDisplayName ? studyDisplayName : studyId?.substring(0, 8)}</h2>
				</div>
			</Row>
			<Row className="box-outline">
				<StudySummaryView studyId={studyId} authErrorCallback={() => { }} />
			</Row>
			<Row className="box-outline">
				<Nav aria-label="breadcrumb" className="breadcrumb">
					{breadcrumbItems}
				</Nav>
			</Row>
			<Row className="box-outline">
				<Outlet />
			</Row>
		</Container>
	)
}

const Study: React.FC = () => (
	<StudyNavidationProvider>
		<StudyContent />
	</StudyNavidationProvider>
);

export default Study;