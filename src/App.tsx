// import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedAuthorizedLayout from './layouts/AuthorizedLayout';
import DashboardNavigationLayout from './layouts/DashboardNavigationLayout';
import StudyComponentLayout from './layouts/StudyComponentLayout';
import Landing from './views/Landing';
import Profile from './views/profile/Profile';
import PageDetails from './views/studycomponents/PageDetails';
import StepDetails from './views/studycomponents/StepDetails';
import StudyDetails from './views/studycomponents/StudyDetails';
import StudyExplorer from './views/studycomponents/StudyExplorer';
import ConstructDetails from './views/surveyconstructs/ConstructDetails';
import ConstructLibrary from './views/surveyconstructs/ConstructLibrary';
import ScaleDetails from './views/surveyscales/ScaleDetails';
import SurveyScales from './views/surveyscales/SurveyScales';


const App: React.FC = () => {

	return (
		<BrowserRouter basename='/rssa-dashboard'>
			<div id="RSSA-App" className="d-flex flex-column h-100">
				<Routes>
					<Route path="/unauthorized" element={<Landing />} />
					<Route path="/" element={<ProtectedAuthorizedLayout />}>
						<Route path="studies" element={<StudyExplorer />} />
						<Route path="studies/:studyId" element={<StudyComponentLayout />}>
							<Route index element={<StudyDetails />} />
							<Route path="steps/:stepId" element={<StepDetails />} />
							<Route path="steps/:stepId/pages/:pageId" element={<PageDetails />} />
							<Route path="data-dashboard" element={<h1>Data Dashboard</h1>} />
						</Route>
						<Route path="constructs" element={<ConstructLibrary />} />
						<Route path="constructs/:constructId" element={<DashboardNavigationLayout />}>
							<Route index element={<ConstructDetails />} />
						</Route>
						<Route path="scales" element={<SurveyScales />} />
						<Route path="scales/:scaleId" element={<DashboardNavigationLayout />}>
							<Route index element={<ScaleDetails />} />
						</Route>
						<Route path="profile" element={<Profile />} />
					</Route>
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App;