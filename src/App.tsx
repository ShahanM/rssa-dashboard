import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/navbar/Navbar';
import ConstructLibrary from './views/constructlibrary/ConstructLibrary';
import Dashboard from './views/dashboard/Dashboard';
import Landing from './views/landing/Landing';
import MetaInfoControl from './views/metainfocontrol/MetaInfoControl';
import Profile from './views/profile/Profile';
import Study from './views/Study';
import StudyDetails from './views/StudyDetails';
import StepDetails from './views/StepDetails';
import PageDetails from './views/PageDetails';


const App: React.FC = () => {
	const { isLoading, error } = useAuth0();

	if (error) {
		return <div>Oops... {error.message}</div>;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Router>
			<div id="RSSA-App" className="d-flex flex-column h-100">
				<NavBar />
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/studies" element={<Dashboard />} />
					<Route path="/studies/:studyId" element={<Study />}>
						<Route index element={<StudyDetails />} />
						<Route path="steps/:stepId" element={<StepDetails />} />
						<Route path="steps/:stepId/pages/:pageId" element={<PageDetails />} />
						{/* </Route> */}
						<Route path="data-dashboard" element={<h1>Data Dashboard</h1>} />
					</Route>
					<Route path="/survey-construct-library" element={<ConstructLibrary />} />
					<Route path="/metainfo-control" element={<MetaInfoControl />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App;