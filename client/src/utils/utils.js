export const getAsync = (url, token = null) => {
	const headers = token ? {Authorization: `Bearer ${token}`} : undefined;
	return fetch('http://localhost:8080/' + url, {headers});
};

export const putAsync = (url, data, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : undefined),
    };

    return fetch(`http://localhost:8080/${url}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });
};

