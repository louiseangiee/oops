import {CookiesProvider} from 'react-cookie';
import {ColorModeContext, useMode} from './theme';
import {CssBaseline, ThemeProvider} from '@mui/material';
import RequireAuth from './components/RequireAuth';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Portfolio from './pages/portfolio';
import Login from './pages/login';
import Layout from './Layout';
import Profile from './pages/profile';
import AccessLog from './pages/access_log';
import StockMarketPage from './pages/stockMarketpage';
import OTP from './pages/otp';
import ComparePortfolio from './pages/comparePortfolio';

function App() {
	// access to the theme and the color mode
	const [theme, colorMode] = useMode();

	return (
		<CookiesProvider>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<div className="app">
						<Routes>
							{/* <Route element={<AutoRefreshOnRouteChange />} /> */}
							<Route path="/login" element={<Login />} />
							<Route path="/otp" element={<OTP />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/" element={<Layout />}>
								{/* Routes that require authentication */}
								<Route element={<RequireAuth />}>
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
										path="stock-market"
										element={<StockMarketPage />}
									/>
									<Route
										path="compare-portfolio"
										element={<ComparePortfolio />}
									/>
								</Route>
							</Route>
						</Routes>
					</div>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</CookiesProvider>
	);
}

export default App;
