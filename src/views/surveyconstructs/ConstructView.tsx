import React from 'react';
import { Button, Container, Nav, Row } from 'react-bootstrap';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { ConstructNavigationProvider, useConstructNavigation } from '../../hooks/ConstructNavigationContext';
import ConstructSummaryView from './ConstructSummary';


const ConstructContent: React.FC = () => {
	const { constructId } = useParams<{ constructId: string }>();
	const location = useLocation();
	const { studyDisplayName, stepDisplayName, pageDisplayName } = useConstructNavigation();

	// const rootPath = `/survey-constructs/${constructId}`;
	// const relativePathSegments = location.pathname
	// 	.substring(location.pathname.indexOf(rootPath) + rootPath.length)
	// 	.split('/')
	// 	.filter(segment => segment !== '');

	// const isStudyRoot = relativePathSegments.length === 0;

	// const breadcrumbItems = [];
	// if (studyDisplayName) {
	// 	const isStudyNameClickable = !isStudyRoot;
	// 	breadcrumbItems.push(
	// 		<React.Fragment key="construct-root">
	// 			{isStudyNameClickable ? (
	// 				<Link to={`/studies/${constructId}`} className="breadcrumb-link">
	// 					{studyDisplayName}
	// 				</Link>
	// 			) : (
	// 				<span className="breadcrumb-current">{studyDisplayName} &gt;</span>
	// 			)}
	// 		</React.Fragment>
	// 	);
	// } else {
	// 	breadcrumbItems.push(<span key="study-loading" className="breadcrumb-current">Loading Construct...</span>);
	// }
	// let currentPathAccumulator = rootPath;

	// relativePathSegments.forEach((segment, index) => {
	// 	currentPathAccumulator += `/${segment}`;

	// 	const isLast = index === relativePathSegments.length - 1;

	// 	let displayName = segment;
	// 	let isClickable = false;

	// 	if (!(segment === 'steps' || segment === 'pages')) {
	// 		if (segment === stepId) {
	// 			displayName = stepDisplayName || `${stepId.substring(0, 8)}`;
	// 			isClickable = true;
	// 		} else if (segment === pageId) {
	// 			displayName = pageDisplayName || `${pageId.substring(0, 8)}`;
	// 			isClickable = false;
	// 		}
	// 		breadcrumbItems.push(
	// 			<React.Fragment key={currentPathAccumulator}>
	// 				<span className="breadcrumb-separator"> / </span>
	// 				{isLast || !isClickable ? (
	// 					<span className="breadcrumb-current">{displayName}</span>
	// 				) : (
	// 					<Link to={currentPathAccumulator} className="breadcrumb-link">
	// 						{displayName}
	// 					</Link>
	// 				)}
	// 			</React.Fragment>
	// 		);
	// 	}

	// });
	return (
		<Container className="mt-4">
			<Row className="box-outline">
				<div className="container-header-content">
					<Link to={"/survey-constructs"}><Button>&lt; Go Back</Button></Link>
				</div>
				<div className="container-header-content">
					<h2>{studyDisplayName ? studyDisplayName : constructId?.substring(0, 8)}</h2>
				</div>
			</Row>
			<Row className="box-outline">
				<ConstructSummaryView constructId={constructId} authErrorCallback={() => { }} />
			</Row>
			{/* <Row className="box-outline">
				<Nav aria-label="breadcrumb" className="breadcrumb">
					{breadcrumbItems}
				</Nav>
			</Row> */}
			<Row className="box-outline">
				<Outlet />
			</Row>
		</Container>
	)
}

const ConstructView: React.FC = () => (
	<ConstructNavigationProvider>
		<ConstructContent />
	</ConstructNavigationProvider>
);

export default withAuthenticationRequired(ConstructView, {
	onRedirecting: () => <div>Loading...</div>,
});