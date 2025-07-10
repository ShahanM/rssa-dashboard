import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/Navbar';
import Landing from './views/Landing';
import MetaInfoControl from './views/metacomponents/MetaInfoControl';
import Profile from './views/profile/Profile';
import PageDetails from './views/studycomponents/PageDetails';
import StepDetails from './views/studycomponents/StepDetails';
import Study from './views/studycomponents/Study';
import StudyDetails from './views/studycomponents/StudyDetails';
import ConstructDetails from './views/surveyconstructs/ConstructDetails';
import ConstructLibrary from './views/surveyconstructs/ConstructLibrary';
import ConstructView from './views/surveyconstructs/ConstructView';
import StudyExplorer from './views/studycomponents/StudyExplorer';


const App: React.FC = () => {
	const { isLoading, error } = useAuth0();

	if (error) {
		return <div>Oops... {error.message}</div>;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Router basename='/rssa-dashboard'>
			<div id="RSSA-App" className="d-flex flex-column h-100">
				<NavBar />
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/studies" element={<StudyExplorer />} />
					<Route path="/studies/:studyId" element={<Study />}>
						<Route index element={<StudyDetails />} />
						<Route path="steps/:stepId" element={<StepDetails />} />
						<Route path="steps/:stepId/pages/:pageId" element={<PageDetails />} />
						<Route path="data-dashboard" element={<h1>Data Dashboard</h1>} />
					</Route>
					<Route path="/survey-constructs" element={<ConstructLibrary />} />
					<Route path="/constructs/:constructId" element={<ConstructView />}>
						<Route index element={<ConstructDetails />} />
					</Route>
					<Route path="/metainfo-control" element={<MetaInfoControl />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App;