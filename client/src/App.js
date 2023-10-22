import {useState} from 'react';
import {CookiesProvider, useCookies} from 'react-cookie';
import {ColorModeContext, useMode} from './theme';
import {CssBaseline, ThemeProvider} from '@mui/material';
import RequireAuth from './components/RequireAuth';
import {Routes, Route} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Home from './pages/home';
import Portfolio from './pages/portfolio';
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
import Layout from './Layout';
import Analytics from './pages/analytics_dashboard';
import Profile from './pages/profile';
import AccessLog from './pages/access_log';
import AutoRefreshOnRouteChange from './AutoRefreshOnRouteChange';

function App() {
	// access to the theme and the color mode
	const [theme, colorMode] = useMode();
	const [isSidebar, setIsSidebar] = useState(true);
	return (
		<CookiesProvider>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<div className="app">
						<Routes>
							{/* <Route element={<AutoRefreshOnRouteChange />} /> */}
							<Route path="/login" element={<Login />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/" element={<Layout />}>
								{/* Routes that require authentication */}
								<Route element={<RequireAuth />}>
									<Route
										path="/dashboard"
										element={<Dashboard />}
									/>
									<Route
										path="/portfolio/:portfolioId"
										element={<Portfolio />}
									/>
									<Route path="/" element={<Home />} />
									<Route
										path="access_log"
										element={<AccessLog />}
									/>
									<Route
										path="analytics"
										element={<Analytics />}
									/>
								</Route>

								<Route path="team" element={<Team />} />
								<Route path="contacts" element={<Contacts />} />
								<Route path="invoices" element={<Invoices />} />
								<Route path="form" element={<Form />} />
								<Route path="bar" element={<Bar />} />
								<Route path="pie" element={<Pie />} />
								<Route path="line" element={<Line />} />
								<Route path="faq" element={<FAQ />} />
								{/* <Route path="/calendar" element={<Calendar />} /> */}
								<Route
									path="/geography"
									element={<Geography />}
								/>
							</Route>
						</Routes>
					</div>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</CookiesProvider>
	);
}

export default App;
