import { Outlet } from 'react-router-dom';
import NavBar from '../components/Navbar';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AuthorizedLayout: React.FC = () => {
    useDocumentTitle('Control Panel');
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
};

export default AuthorizedLayout;
