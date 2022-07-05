const path = require('path')
import languages from './lang/languages.js'

export default {
	server: {
		port: '8080',
	},

	gtm: {
		// Google Tag Manager
		id: 'GTM-XXXXXXX',
	},

	// environmental variables
	publicRuntimeConfig: {
		baseUrl: process.env.BASE_URL,
		casBase: process.env.CAS_BASE,
		ebirdApiBase: process.env.EBIRD_API_BASE,
		ebirdApiKey: process.env.EBIRD_API_KEY,
		mlDownloadBase: process.env.ML_DOWNLOAD_BASE,
		ebirdWebBase: process.env.EBIRD_WEB_BASE,
	},
	privateRuntimeConfig: {
		//serverSideOnly: process.env.SERVER_SIDE_ONLY
	},

	// api routes on server only
	serverMiddleware: [
		{ path: '/login', handler: '~/auth/login.js' },
		{ path: '/logout', handler: '~/auth/logout.js' },
	],

	router: {
		// comment out the gateway middleware to disable auto-login
		middleware: 'gateway',
		prefetchLinks: false,
	},

	// Global page headers: https://go.nuxtjs.dev/config-head
	head() {
		return {
			htmlAttrs: {
				lang: this._i18n._vm.locale,
				dir: ['ar', 'he', 'iw'].indexOf(this._i18n._vm.locale) >= 0 ? 'rtl' : 'ltr',
			},
			title: this.$t('app.title'),
			meta: [
				{ charset: 'utf-8' },
				{ 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'description', name: 'description', content: this.$t('app.description') },
				{ hid: 'og:title', property: 'og:title', content: this.$t('app.title') },
				{ hid: 'og:url', property: 'og:url', content: '' },
				{ hid: 'og:description', property: 'og:description', content: this.$t('app.description') },
				{ property: 'og:type', content: 'non_profit' },
				{ hid: 'og:image', property: 'og:image', content: '' },
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ hid: 'twitter:site', property: 'twitter:site', content: '' },
				{ hid: 'twitter:title', name: 'twitter:title', content: this.$t('app.title') },
				{ hid: 'twitter:description', name: 'twitter:description', content: this.$t('app.description') },
				{ hid: 'twitter:image', name: 'twitter:image', content: '' },
				{ name: 'msapplication-TileColor', content: '#2d89ef' },
				{ name: 'theme-color', content: '#ffffff' },
			],
			link: [
				//{ hid: 'canonical', rel: 'canonical', href: process.env.BASE_URL },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' },
				{ rel: 'icon', type: 'image/ico', sizes: '16x16', href: '/images/favicon.ico' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon-16x16.png' },
				{ rel: 'manifest', href: '/images/manifest.json' },
				{ rel: 'mask-icon', href: '/images/safari-pinned-tab.svg', color: '#ffffff' },
			],
		}
	},

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{ src: './node_modules/@lichen/lichen/base/global-js/GoToTop.js', mode: 'client' },
		{ src: './node_modules/@lichen/lichen/base/global-js/InputType.js', mode: 'client' },
		{ src: './node_modules/@lichen/lichen/base/global-js/LazyImage.js', mode: 'client' },
		{ src: './node_modules/@lichen/lichen/base/global-js/LazyTrigger.js', mode: 'client' },
		{ src: './node_modules/@lichen/lichen/base/global-js/ResizeListener.js', mode: 'client' },
		{ src: './node_modules/@lichen/lichen/base/global-js/Tooltip.js', mode: 'client' },
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: [
		{
			path: '~/components',
		},
	],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		'@nuxt/typescript-build',
		'@lichen/lichen/nuxt',
		//'@nuxtjs/gtm',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'@nuxtjs/style-resources',
		[
			'~/modules/session',
			{
				// express cookie-session options:
				name: 'is-lichen-session',
				secret: 'IgMugAqTKPiRtBrYaGFYsvzBzIA2uvKk52O6Q97g', // IMPORTANT! Set this to a random string
				maxAge: 1000 * 60 * 60 * 24 * 7, // cookie expires in 7 days
			},
		],
		// i18n
		[
			'@nuxtjs/i18n',
			{
				locales: languages,
				defaultLocale: 'en',
				lazy: true,
				langDir: 'lang/',
				vueI18n: {
					fallbackLocale: {
						'es': ['es-419', 'es-ES'],
						'es-419': ['es-ES'],
						'es-ES': ['es-419'],
						'pt-BR': ['pt-PT'],
						'pt-PT': ['pt-BR'],
						'pt': ['pt-PT', 'pt-BR'],
						'default': ['en']
					},
					silentTranslationWarn: true,
				},
				detectBrowserLanguage: {
					useCookie: false,
					//cookieKey: 'i18n_redirected',
					//alwaysRedirect: false,
					//cookieCrossOrigin: true,
					redirectOn: 'no prefix'
				},
				// no_prefix means language code won't be added to path in URL
				strategy: 'prefix'
			},
		],
		// https://github.com/gaven/nuxt-svg-sprite-module#readme
		// for server-side sprite injection
		[
			'nuxt-svg-sprite-module',
			{
				directory: '~/node_modules/@lichen/lichen/icons/svg',
				// Optional template location: defaults to __dirname + /app.html
				templateLocation: '~/app.html',
				options: {
					// Configuration options:
					shape: {
						generator: function (name) {
							return '%s'
						},
					},
					svg: {
						rootAttributes: {
							display: 'none',
						},
					},
				},
			},
		]
	],

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['./node_modules/@lichen/lichen/base/global-css/_classes.scss'],

	styleResources: {
		scss: ['./node_modules/@lichen/lichen/base/global-css/_sass-includes.scss'],
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		transpile: ['mapbox-gl-draw-freehand-mode', '@mapbox/mapbox-gl-draw'],
		extend(config, ctx) {
			// tell webpack where to find files if the import starts with @
			config.resolve.alias = {
				...config.resolve.alias,
				'@': path.resolve('node_modules/@lichen/lichen'),
			}

			// Don't process .svg files in default image rule
			const svgRulePredicate = (rule) => rule.test && rule.test.test('.svg')
			const imageLoaderRule = config.module.rules.find(svgRulePredicate)
			if (!imageLoaderRule) {
				console.dir('Could not modify image loader rule!')
				return
			}
			imageLoaderRule.test = /\.(png|jpe?g|gif|webp)$/

			// find SVG files and put them in a sprite
			config.module.rules.push({
				test: /\.svg$/,
				include: [path.resolve('node_modules/@lichen/lichen/icons')],
				use: 'null-loader',
			})

			// Uncomment line below to view webpack rules
			//console.dir(config.module.rules)
			//console.dir(config.resolve)
		},
	},
}
