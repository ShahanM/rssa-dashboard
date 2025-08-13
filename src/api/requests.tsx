function getHeaders(token: string) {
	let headers = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Allow-Methods': 'OPTIONS,PUT,POST,GET',
		'Authorization': `Bearer ${token}`
	};
	return headers;
}

export type RequestProps = {
	url: string;
	token: string;
	data: any|null;
}

export const authenticatedPost = async (params: RequestProps) => {
	const response = await fetch(params.url, {
		method: "POST",
		body: JSON.stringify(params.data),
		headers: getHeaders(params.token)
	});
	if (response.status !== 200) {
		throw new Error(response.statusText);
	}
	return await response.json();
}

export const authenticatedGet = async (params: RequestProps) => {
	const headers = getHeaders(params.token);
	console.log("Fetching:", params.url, "with headers:", headers);
	const response = await fetch(params.url, {
		method: 'GET',
		headers: headers,
	});
	if (response.status !== 200) {
		throw new Error(response.statusText);
	}
	return await response.json();
}