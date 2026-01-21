import { Outlet } from 'react-router';
import Settings from '../pages/Settings';
import './Layout.scss';

const Layout = () => {
    return (
        <div className="layout">
            <Outlet />
            <Settings />
        </div>
    );
};

export default Layout;
