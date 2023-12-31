import {Outlet} from 'react-router-dom';
import {useState} from 'react';
import Sidebar from './pages/global/Sidebar';
import Topbar from './pages/global/Topbar';
import {useAuth} from './context/AuthContext';

const Layout = () => {
	const [isSidebar, setIsSidebar] = useState(true);

	return (
		<>
			<Sidebar isSidebar={isSidebar} />
			<main className="content">
				<Topbar setIsSidebar={setIsSidebar} invisible/>
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
