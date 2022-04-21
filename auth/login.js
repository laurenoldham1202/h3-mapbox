import axios from 'axios'

import AuthorizationService from '../services/AuthorizationService'
import PrefsService from '../services/PrefsService'
import { authorizationConfig } from './authorizationConfig'

import { parseString } from 'xml2js'
const app = require('express')()

app.get('/', (req, res, next) => {
	const casBase = process.env.CAS_BASE
	const baseUrl = process.env.BASE_URL

	let queryString = Object.keys(req.query)
		.filter((key) => key !== 'ticket')
		.map((key) => key + '=' + req.query[key])
		.join('&')
	if (queryString.length) {
		queryString = '?' + queryString
	}
	const serviceUrl = encodeURIComponent(baseUrl + 'login' + queryString)

	const queryPath = req.query.path || ''

	let queryStringWithoutPath = Object.keys(req.query)
		.filter((key) => key !== 'ticket' && key !== 'path')
		.map((key) => key + '=' + req.query[key])
		.join('&')

	// this is crazy
	if (queryStringWithoutPath.length) {
		if (queryPath.indexOf('?') === -1) {
			queryStringWithoutPath = '?' + queryStringWithoutPath
		} else {
			queryStringWithoutPath = '&' + queryStringWithoutPath
		}
	}

	const returnUrl = baseUrl.slice(0, -1) + queryPath + queryStringWithoutPath

	// validate ticket
	if (req.query.ticket) {
		// service URL needs to match previous service URL (/login)
		const url = casBase + '/serviceValidate?ticket=' + req.query.ticket + '&service=' + serviceUrl

		axios
			.get(url)
			.then((response) => {
				const xml = response.data

				parseString(xml, { trim: true, explicitArray: false }, (err, result) => {
					// was validation successful?
					if (result['cas:serviceResponse'].hasOwnProperty('cas:authenticationSuccess')) {
						const casUser = result['cas:serviceResponse']['cas:authenticationSuccess']['cas:attributes']
						const user = {
							userId: casUser['cas:user_id'],
							username: casUser['cas:username'],
							firstName: casUser['cas:first_name'],
							lastName: casUser['cas:last_name'],
							fullName: casUser['cas:first_name'] + ' ' + casUser['cas:last_name'],
							roles: ['user'],
						}

						// get user prefs and roles
						const prefsUrl = process.env.EBIRD_PREFS_URL
						const rolesUrl = process.env.IS_AUTH_URL
						axios
							.all([
								PrefsService(prefsUrl, user.userId),
								AuthorizationService(rolesUrl, user.userId, authorizationConfig.projId, authorizationConfig.count),
							])
							.then(
								axios.spread((prefs, roles) => {
									user.prefs = prefs
									user.roles = roles

									// start session
									req.session.user = user

									// redirect away from /login
									res.redirect(returnUrl)
								})
							)
							.catch((err) => {
								// start session
								req.session.user = user

								// redirect away from /login
								res.redirect(returnUrl)
							})
					} else {
						// not authenticated with CAS
						req.session.user = {
							anonymous: true,
						}
						res.redirect(returnUrl)
					}
				})
			})
			.catch((err) => {
				//console.log('redirect for CAS validation error', err)
				req.session.user = {
					anonymous: true,
				}
				res.redirect(returnUrl)
			})
	} else {
		//console.log('redirect for no CAS ticket')
		req.session.user = {
			anonymous: true,
		}
		res.redirect(returnUrl)
	}
})

module.exports = app
