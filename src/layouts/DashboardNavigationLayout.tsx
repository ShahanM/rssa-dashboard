import { Outlet } from 'react-router-dom';

const DashboardNavigationLayout: React.FC = () => {
    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg">
            <div aria-label="breadcrumb" className="p-3">
                {/* {breadcrumbItems} */}
            </div>
            <Outlet />
        </div>
    );
};

export default DashboardNavigationLayout;
