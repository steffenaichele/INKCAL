import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import './Layout.scss';

const Layout = () => {
    return (
        <div className="layout">
            <main className="layout__main">
                <Outlet />
            </main>
            <Sidebar />
        </div>
    );
};

export default Layout; 