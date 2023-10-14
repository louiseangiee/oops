import {useState} from 'react';
import {ColorModeContext, useMode} from './theme';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {Routes, Route} from 'react-router-dom';
import Topbar from './pages/global/Topbar';
import Dashboard from './pages/dashboard';
import Home from './pages/home';
import Portfolio from './pages/portfolio';
import Sidebar from './pages/global/Sidebar';
import Team from './pages/team';
import Invoices from './pages/invoices';
import Contacts from './pages/contacts';
import Bar from './pages/bar';
import Form from './pages/form';
import Line from './pages/line';
import Pie from './pages/pie';
import FAQ from './pages/faq';
import Geography from './pages/geography';
import Login from './pages/login';
import Analytics from './pages/analytics_dashboard';
// import Calendar from "./pages/calendar/calendar";

function App() {
	// access to the theme and the color mode
	const [theme, colorMode] = useMode();
	const [isSidebar, setIsSidebar] = useState(true);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<div className="app">
					<Sidebar isSidebar={isSidebar} />
					<main className="content">
						<Topbar setIsSidebar={setIsSidebar} />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/portfolio" element={<Portfolio />} />
							<Route path="/login" element={<Login />} />
							<Route path="/team" element={<Team />} />
							<Route path="/contacts" element={<Contacts />} />
							<Route path="/invoices" element={<Invoices />} />
							<Route path="/form" element={<Form />} />
							<Route path="/bar" element={<Bar />} />
							<Route path="/pie" element={<Pie />} />
							<Route path="/line" element={<Line />} />
							<Route path="/faq" element={<FAQ />} />
							{/* <Route path="/calendar" element={<Calendar />} /> */}
							<Route path="/geography" element={<Geography />} />
							<Route path="/analytics" element = {<Analytics/>} />
						</Routes>
					</main>
				</div>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
