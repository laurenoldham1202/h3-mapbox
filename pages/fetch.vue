<template>
	<div>
		<CloPageSection color="primaryDark">
			<CloHeading level="1" reverse>Fetching data</CloHeading>
		</CloPageSection>
		<CloPageSection>
			<CloGridFlex gutter="lg">
				<CloGridFlexCell class="u-md-size2of3">
					<p>
						This is an example of using Nuxt's $fetch method to get data needed for a page. Note how the species common name
						appears in the browser's tab title. This fetching is also an example of using a shared service, and this page has
						examples of using CloSuggest and CloDialog.
					</p>
					<CloButton @click.native="showDialog">Why use $fetch?</CloButton>

					<CloSuggest
						:url="env.ebirdApiBase + 'ref/taxon/find/?cat=species&key=jfekjedvescr&locale=en&q=%QUERY'"
						label="Change species"
						placeholder="Species name"
						:minLength="3"
						v-on:selection="handleSelection"
					/>

					<p>
						Taxonomy data for <strong>{{ $route.query.speciesCode }}</strong> fetched and rendered on the
						<strong>{{ renderMode }}</strong
						>.
					</p>
					<pre>{{ taxonomyData }}</pre>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-md-size1of3">
					<TheSidebar />
				</CloGridFlexCell>
			</CloGridFlex>
		</CloPageSection>
		<CloDialog v-if="dialogOpen" id="whyFetch" @close="closeDialog">
			<template #header>
				<CloHeading level="1" size="2">Why use $fetch?</CloHeading>
			</template>
			<template #body>
				<p>
					In this example, we start with a species code in the URL. It is important for SEO and social sharing for the title of
					the html document to be set by the server, and include the translated species common name.
				</p>
				<p>
					On the first request, the fetch (and content rendering) happen on the server. After that, when the speciesCode query
					parameter changes, the requests happen on the client. To force the fetch to always happen on the server, use a
					serverMiddleware endpoint.
				</p>
			</template>
			<template #footer>
				<button class="Button" @click="closeDialog">Close dialog</button>
			</template>
		</CloDialog>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import TaxonomyService from '~/services/TaxonomyService'
import { TaxonomyModel } from '~/models/TaxonomyModel'
import { SuggestionModel } from '~/models/SuggestionModel'
import { UserModel } from '~/models/UserModel'

export default Vue.extend({
	name: 'fetch',
	data() {
		return {
			env: this.$config,
			taxonomyData: [] as TaxonomyModel[],
			renderMode: process.server ? 'server' : 'client',
			title: this.$t('app.title'),
			dialogOpen: false,
			dialogButton: null as HTMLElement | null,
		}
	},
	computed: {
		user() {
			const store: any = this.$store
			return store.state.session.user as UserModel
		},
	},
	head(): any {
		return {
			title: this.title,
			meta: [
				{ hid: 'og:title', property: 'og:title', content: this.title },
				{ hid: 'twitter:title', name: 'twitter:title', content: this.title },
			],
		}
	},
	watch: {
		$route() {
			this.$fetch()
		},
	},
	mounted() {
		this.$fetch()
	},
	async fetch() {
		let speciesCode = this.$route.query.speciesCode as string
		// provide a default species just so something happens in the server side example
		if (!this.$route.query.speciesCode) {
			speciesCode = 'lobcur'
			this.$router.replace({ query: { speciesCode: speciesCode } })
		}
		const taxaLocale = this.user && !this.user.anonymous ? this.user.prefs.COMMON_NAME_LOCALE : 'en_US'
		await TaxonomyService(this.env.ebirdApiBase, this.env.ebirdApiKey, speciesCode, taxaLocale)
			.then((res) => {
				//console.log(res)
				if (res.length) {
					this.taxonomyData = res
					this.title = [this.taxonomyData[0].comName, this.$t('app.title')].join(' - ')
				}
			})
			.catch((err) => {
				console.log(err)
			})
	},
	methods: {
		handleSelection(suggestion: SuggestionModel) {
			this.$router.push({ query: { speciesCode: suggestion.code } })
			this.renderMode = 'client'
		},
		showDialog(e: Event) {
			this.dialogOpen = true
			const el = e.target as HTMLElement
			this.dialogButton = el
		},
		closeDialog() {
			this.dialogOpen = false
			// important: put focus back on element that triggered the dialog
			if (this.dialogButton) {
				const el = this.dialogButton
				el.focus()
			}
		},
	},
})
</script>

<style lang="scss"></style>
