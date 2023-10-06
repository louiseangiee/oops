export const getAsync = (url, token = null) => {
	const headers = token ? {Authorization: `Bearer ${token}`} : undefined;
	return fetch('http://localhost:8080/' + url, {headers});
};
