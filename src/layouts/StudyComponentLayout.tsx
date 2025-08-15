import React from "react";
import { Row } from "react-bootstrap";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const StudyNavigationLayout: React.FC = () => {
	// const { studyId, stepId, pageId } = useParams<{ studyId: string; stepId: string; pageId: string }>();
	const { studyId, stepId } = useParams<{ studyId: string; stepId: string; pageId: string }>();
	const location = useLocation();
	const { study, step } = useAppSelector((state) => state.studySelection);

	const studyRootPath = `/studies/${studyId}`;
	const relativePathSegments = location.pathname
		.substring(location.pathname.indexOf(studyRootPath) + studyRootPath.length)
		.split('/')
		.filter(segment => segment !== '');

	const isStudyRoot = relativePathSegments.length === 0;
	const breadcrumbItems = [];

	breadcrumbItems.push(
		<span key="dashboard-root">
			<Link to={`/studies`} className="text-purple-600 hover:underline">
				Studies
			</Link>
			<span className="mx-2 text-gray-500">&gt;</span>
		</span>
	);

	if (study) {
		breadcrumbItems.push(
			isStudyRoot ? (
				<span key="study-current" className="font-semibold text-gray-700">{study.name}</span>
			) : (
				<Link key="study-link" to={studyRootPath} className="text-purple-600 hover:underline">
					{study.name}
				</Link>
			)
		);
	} else if (studyId) {
		breadcrumbItems.push(
			<Link key="study-link" to={studyRootPath} className="text-purple-600 hover:underline">
				<span key="study-loading" className="text-gray-500">{studyId.substring(0, 8)}</span>
			</Link>
		);
	}
	let currentPathAccumulator = studyRootPath;
	relativePathSegments.forEach((segment, index) => {
		currentPathAccumulator += `/${segment}`;
		const isLast = index === relativePathSegments.length - 1;

		if (segment === 'steps' || segment === 'pages') return;

		let displayName = segment.substring(0, 8); // Default to truncated ID
		// let isClickable = !isLast;

		if (segment === stepId && step) {
			displayName = step.name;
		}
		// Add similar logic for `page` if needed
		// if (segment === pageId && page) { displayName = page.title; }

		breadcrumbItems.push(
			<React.Fragment key={currentPathAccumulator}>
				<span className="mx-2 text-gray-500">&gt;</span>
				{isLast ? (
					<span className="font-semibold text-gray-700">{displayName}</span>
				) : (
					<Link to={currentPathAccumulator} className="text-purple-600 hover:underline">
						{displayName}
					</Link>
				)}
			</React.Fragment>
		);
	});

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg">
			<Row className="box-outline">
				<div aria-label="breadcrumb" className="p-3">
					{breadcrumbItems}
				</div>
			</Row>
			<Outlet />
		</div>
	);
}

const StudyComponentLayout: React.FC = () => {
	return <StudyNavigationLayout />;
}

export default StudyComponentLayout;