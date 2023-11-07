export const getAsync = (url, token = null) => {
	const headers = token ? {Authorization: `Bearer ${token}`} : undefined;
	return fetch('http://localhost:8080/' + url, {headers});
};

export const fetchAllEndpoints = async (endpoints, token) => {
    const fetchPromises = endpoints.map(endpoint => getAsync(endpoint, token));
  
    try {
        const responses = await Promise.all(fetchPromises);
        const invalidResponse = responses.find(response => !response.ok);
        if (invalidResponse) {
            throw new Error(`API call failed: ${invalidResponse.statusText}`);
        }
        return await Promise.all(responses.map(response_1 => response_1.json()));
    } catch (error) {
        console.error("Error fetching data from endpoints:", error);
        throw error;
    }
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

export const postAsync = (url, data, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : undefined),
    };

    return fetch(`http://localhost:8080/${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
}

export const deleteAsync = (url, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : undefined),
    };

    return fetch(`http://localhost:8080/${url}`, {
        method: 'DELETE',
        headers,
    });
}

