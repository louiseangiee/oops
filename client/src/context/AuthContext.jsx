import { createContext, useState, useContext, useEffect } from 'react';
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userEmail, setUserEmail] = useState("Log Out");
	const [userData, setUserData] = useState({});
	const [cookie, setCookie] = useCookies(["accessToken"]);
	const [emailCookie, setEmailCookie] = useCookies(["email"]);

	const signIn = async (email, password) => {
		const response = await fetch(
			'http://localhost:8080/api/v1/auth/authenticate',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			}
		);
		const data = await response.json();
		setUserEmail("another email");
		setCookie("accessToken", data.token, { path: "/", maxAge: 86400 });
		setEmailCookie("email", email, { path: "/", maxAge: 86400 });
		return data;
	}


	const register = async (fullName, email, password) => {
		const response = await fetch('http://localhost:8080/api/v1/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"fullName": fullName,
				"email": email,
				"password": password,
				"role": "ROLE_USER"
			})
		})
		const data = await response.json();
		return data;
	}



	useEffect(() => {
		const initializeUser = async () => {
			if (emailCookie.email) {
				const response = await fetch(`http://localhost:8080/users/user?email=` + emailCookie.email, {
					headers: {
						Authorization: `Bearer ${cookie.accessToken}`,
					}
				})
				if (response.ok) {
					const data = await response.json();
					setUserData(data);
					setUserEmail(data.email);
				} else {
					setUserEmail("User Email")
				}
			}
		}
		initializeUser();
	}, [cookie.accessToken]);

	const values = {
		signIn,
		register,
		userEmail,
		setUserEmail,
		userData
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};