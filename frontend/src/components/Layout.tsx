import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import './Layout.scss';

const Layout = () => {
    return (
        <div className="root">
            <div className="layout">
                <Sidebar />
                <main className="layout__main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout; 