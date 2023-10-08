import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState("");
	const [userEmail, setUserEmail] = useState("");

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
		localStorage.setItem('accessToken', data.token);
		setToken(data.token);
		setUserEmail(email);
		console.log(data.token);
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
			})
		})
		const data = await response.json();
		console.log(data.token);
		setToken(data.token);
		localStorage.setItem('accessToken', data.token);
		setUserEmail(email);
	}

	const values = {
		signIn,
		register,
		userEmail,
		token
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};