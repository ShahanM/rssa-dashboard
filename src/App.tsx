import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/navbar/Navbar';
import Dashboard from './views/dashboard/Dashboard';
import Profile from './views/profile/Profile';
import Landing from './views/landing/Landing';


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
					<Route path="/rssa-dashboard" element={<Dashboard />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App;