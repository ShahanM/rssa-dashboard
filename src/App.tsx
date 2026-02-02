import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import { ToastProvider } from './components/toast/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AuthorizedLayout from './layouts/AuthorizedLayout';
import DashboardNavigationLayout from './layouts/DashboardNavigationLayout';
import StudyComponentLayout from './layouts/StudyComponentLayout';
import DashboardHome from './views/DashboardHome';
import Landing from './views/Landing';
import MovieDatabase from './views/moviedatabase/MovieDatabase';
import Profile from './views/profile/Profile';
import PageDetails from './views/studycomponents/PageDetails';
import StepDetails from './views/studycomponents/StepDetails';
import StudyDetails from './views/studycomponents/StudyDetails';
import StudyCondition from './views/studycomponents/StudyCondition';
import StudyExplorer from './views/studycomponents/StudyExplorer';
import ConstructDetails from './views/surveyconstructs/ConstructDetails';
import ConstructLibrary from './views/surveyconstructs/ConstructLibrary';
import ScaleDetails from './views/surveyscales/ScaleDetails';
import SurveyScales from './views/surveyscales/SurveyScales';
import LocalUserList from './views/users/LocalUserList';

const App: React.FC = () => {
    return (
        <BrowserRouter basename="/rssa-dashboard/">
            <ToastProvider>
                <GlobalErrorBoundary>
                    <div id="RSSA-App" className="flex flex-col h-full">
                        <Routes>
                            <Route path="/unauthorized" element={<Landing />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<AuthorizedLayout />}>
                                    <Route index element={<DashboardHome />} />
                                    <Route path="users" element={<LocalUserList />} />
                                    <Route path="studies" element={<StudyExplorer />} />
                                    <Route path="studies/:studyId" element={<StudyComponentLayout />}>
                                        <Route index element={<StudyDetails />} />
                                        <Route path="steps/:stepId" element={<StepDetails />} />
                                        <Route path="steps/:stepId/pages/:pageId" element={<PageDetails />} />
                                        <Route path="conditions/:conditionId" element={<StudyCondition />} />
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
                                    <Route path="movies" element={<MovieDatabase />} />
                                    <Route path="profile" element={<Profile />} />
                                </Route>
                            </Route>
                        </Routes>
                    </div>
                </GlobalErrorBoundary>
            </ToastProvider>
        </BrowserRouter>
    );
};

export default App;
