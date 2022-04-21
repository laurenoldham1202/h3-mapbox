import isbot from 'isbot'

export default function ({ req, res, next, redirect }) {
	const casBase = process.env.CAS_BASE
	const baseUrl = process.env.BASE_URL

	if (process.client) {
		return
	}

	// if session exists (could be anonymous or logged in), do not redirect to CAS
	if (req.session.user) {
		return
	}

	// if user came from same host, do not redirect to CAS
	const referer = req.get('Referrer')
	if (referer && referer.indexOf(req.headers.host) !== -1) {
		return
	}

	// do not redirect embeds to CAS
	if (req.url.indexOf('embed') !== -1) {
		return
	}

	if (req.url.indexOf('login') !== -1) {
		return
	}

	if (req.url.indexOf('logout') !== -1) {
		return
	}

	// bots should not be redirected to CAS
	const userAgent = req.get('user-agent')
	if (isbot(userAgent)) {
		return
	}

	// keep track of the current URL so we can return after the redirects
	let queryString = Object.keys(req.query)
		.map((key) => key + '=' + req.query[key])
		.join('&')
	if (queryString.length) {
		queryString = '?' + queryString
	}

	const serviceUrl = encodeURIComponent(baseUrl + 'login?path=' + req.path + queryString)

	const redirectUrl = casBase + '/login?gateway=true&service=' + serviceUrl

	redirect(redirectUrl)
}
