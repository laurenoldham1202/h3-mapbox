export const state = () => ({
	session: {},
	//baseUrl: 'unset',
})

export const mutations = {
	setSession(state, session) {
		state.session = session
	},
	setBaseUrl(state, baseUrl) {
		state.baseUrl = baseUrl
	},
}

export const actions = {
	async nuxtServerInit({ dispatch, commit }, { req }) {
		// set initial session state:
		if (req.session) {
			commit('setSession', req.session)
		}
		commit('setBaseUrl', req.protocol + '://' + req.headers.host)
	},
}

export const getters = {
	baseUrl: (state) => state.baseUrl,
}
