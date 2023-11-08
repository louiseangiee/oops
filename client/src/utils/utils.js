export const getAsync = (url, token = null) => {
	const headers = token ? {Authorization: `Bearer ${token}`} : undefined;
	return fetch('http://localhost:8080/' + url, {headers});
};

export const fetchAllEndpoints = async (urls, accessToken) => {
	const headers = accessToken
		? {Authorization: `Bearer ${accessToken}`}
		: undefined;

	const fetchPromises = urls.map((url) =>
		fetch('http://localhost:8080/' + url, {headers})
	);
	const responses = await Promise.all(fetchPromises);

	const data = await Promise.all(
		responses.map(async (response) => {
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);
			return response.json();
		})
	);

	return data;
};

export const putAsync = (url, data, token = null) => {
	const headers = {
		'Content-Type': 'application/json',
		...(token ? {Authorization: `Bearer ${token}`} : undefined),
	};

	return fetch(`http://localhost:8080/${url}`, {
		method: 'PUT',
		headers,
		body: JSON.stringify(data),
	});
};

export const postAsync = (url, data, token = null) => {
	const headers = {
		'Content-Type': 'application/json',
		...(token ? {Authorization: `Bearer ${token}`} : undefined),
	};

	return fetch(`http://localhost:8080/${url}`, {
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	});
};

export const deleteAsync = (url, token = null) => {
	const headers = {
		'Content-Type': 'application/json',
		...(token ? {Authorization: `Bearer ${token}`} : undefined),
	};

	return fetch(`http://localhost:8080/${url}`, {
		method: 'DELETE',
		headers,
	});
};
