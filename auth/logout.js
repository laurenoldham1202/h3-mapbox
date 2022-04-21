export default (req, res) => {
	const baseUrl = process.env.BASE_URL

	// end session
	req.session.user = null

	// TODO: remove cookie???

	// redirect away from /logout

	let queryStringWithoutPath = Object.keys(req.query)
		.filter((key) => key !== 'path')
		.map((key) => key + '=' + req.query[key])
		.join('&')
	if (queryStringWithoutPath.length) {
		queryStringWithoutPath = '?' + queryStringWithoutPath
	}
	const returnUrl = baseUrl.slice(0, -1) + req.query.path + queryStringWithoutPath

	res.redirect(returnUrl)
}
