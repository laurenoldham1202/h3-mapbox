<template>
	<CloHeader :reverse="theme !== 'ebird'">
		<template #identity>
			<NLink v-if="theme !== 'ebird'" :to="localePath('/')" v-slot="{ href, navigate }" custom>
				<CloHeaderIdentity :href="href" label="Lichen" @click.native="navigate">
					<div class="Heading Heading--h3 Heading--reverse u-margin-none">
						<span class="Heading-icon u-inline-sm">
							<CloLogoLabSapsucker reverse size="xs" />
						</span>
						<span class="Heading-main">Lichen</span>
					</div>
				</CloHeaderIdentity>
			</NLink>
			<CloHeaderIdentity v-else :href="ebirdWebPortalBase" label="eBird">
				<CloLogoEbird v-if="!$route.params.portal || !portals.includes($route.params.portal)" />
				<img v-else :src="'/logos/' + $route.params.portal + '.svg'" />
			</CloHeaderIdentity>
		</template>
		<template #main>
			<CloHeaderList v-if="theme !== 'ebird'" :label="$t('nav.mainMenu')">
				<NLink :to="localePath('user')" v-slot="{ href, navigate, isActive }" custom>
					<CloHeaderListItem color="neutral" :href="href" label="User data" :active="isActive" @click.native="navigate" />
				</NLink>
				<NLink :to="localePath('fetch')" v-slot="{ href, navigate, isActive }" custom>
					<CloHeaderListItem color="neutral" :href="href" label="Fetching data" :active="isActive" @click.native="navigate" />
				</NLink>
				<NLink :to="localePath('/ebird')" v-slot="{ href, navigate, isActive }" custom>
					<CloHeaderListItem color="neutral" :href="href" label="Portals" :active="isActive" @click.native="navigate" />
				</NLink>
				<NLink :to="localePath('fixed')" v-slot="{ href, navigate, isActive }" custom>
					<CloHeaderListItem color="neutral" :href="href" label="Fixed layout" :active="isActive" @click.native="navigate" />
				</NLink>
				<CloHeaderListItem color="neutral" href="https://support.ebird.org/support/solutions/48000450606" :label="$t('nav.help')" />
			</CloHeaderList>
			<CloHeaderList v-else :label="$t('nav.mainMenu')">
				<CloHeaderListItem bold :href="ebirdWebPortalBase + 'submit'" :label="$t('nav.submit')" />
				<CloHeaderListItem active bold :href="ebirdWebPortalBase + 'explore'" :label="$t('nav.explore')" />
				<CloHeaderListItem bold :href="ebirdWebPortalBase + 'myebird'" :label="$t('nav.myEbird', ['eBird'])" />
				<CloHeaderListItem bold :href="ebirdWebPortalBase + 'science'" :label="$t('nav.science')" />
				<CloHeaderListItem :href="ebirdWebPortalBase + 'about'" :label="$t('nav.about')" />
				<CloHeaderListItem :href="ebirdWebPortalBase + 'news'" :label="$t('nav.news')" />
				<CloHeaderListItem href="https://support.ebird.org/support/solutions/48000298808" :label="$t('nav.help')" />
			</CloHeaderList>
			<CloHeaderGroup right>
				<CloHeaderList :label="$t('nav.donate')">
					<CloHeaderListItem size="sm" color="buttonAlert" href="#" :label="$t('nav.donate')" />
				</CloHeaderList>
				<CloHeaderList v-if="!user || user.anonymous" :label="$t('nav.signIn')" hideLabel hideLabelMedium>
					<CloHeaderListItem
						size="sm"
						color="buttonSecondary"
						:href="env.casBase + '/account/create?service=' + serviceUrl"
						:label="$t('nav.createAccount')"
					/>
					<CloHeaderListItem
						size="sm"
						color="buttonPrimary"
						:href="env.casBase + '/login?service=' + serviceUrl"
						:label="$t('nav.signIn')"
					/>
				</CloHeaderList>
				<CloHeaderList v-else dropdown icon="user" :label="user.fullName + ' (' + user.username + ')'">
					<CloHeaderListItem color="neutral" :href="ebirdWebPortalBase + 'profile'" :label="$t('nav.profile')" />
					<CloHeaderListItem color="neutral" :href="ebirdWebPortalBase + 'manage/contacts'" :label="$t('nav.contacts')" />
					<CloHeaderListItem color="neutral" :href="ebirdWebPortalBase + 'prefs'" :label="$t('nav.preferences')" />
					<CloHeaderListItem color="neutral" :href="env.casBase + '/account/edit'" :label="$t('nav.account')" />
					<CloHeaderListItem color="neutral" :href="logoutUrl" :label="$t('nav.signOut')" />
				</CloHeaderList>
				<CloHeaderList dropdown hideLabel icon="language" :label="$t('nav.language')">
					<template v-for="locale in $i18n.locales">
						<NLink
							v-if="!locale.hidden"
							:key="locale.code"
							:to="switchLocalePath(locale.code)"
							custom
							v-slot="{ href, navigate }"
						>
							<CloHeaderListItem color="neutral" :href="href" @click="navigate" :label="locale.name" />
						</NLink>
					</template>
				</CloHeaderList>
			</CloHeaderGroup>
		</template>
	</CloHeader>
</template>

<script lang="ts">
import Vue from 'vue'

import { portals } from '~/static/portals'
import { UserModel } from '~/models/UserModel'

export default Vue.extend({
	data() {
		return {
			env: this.$config,
			portals: portals,
		}
	},
	computed: {
		user() {
			const store: any = this.$store
			return store.state.session.user as UserModel
		},
		taxaLocale(): string {
			if (this.user && !this.user.anonymous) {
				return this.user.prefs.COMMON_NAME_LOCALE
			} else {
				return 'en_US'
			}
		},
		serviceUrl(): string {
			let queryString = Object.keys(this.$route.query)
				.map((key) => key + '=' + this.$route.query[key])
				.join('&')
			if (queryString.length) {
				queryString = '&' + queryString
			}
			return encodeURIComponent(this.$store.getters.baseUrl + '/login?path=' + this.$route.path + queryString)
		},
		logoutUrl(): string {
			let queryString = Object.keys(this.$route.query)
				.map((key) => key + '=' + this.$route.query[key])
				.join('&')
			if (queryString.length) {
				queryString = '&' + queryString
			}
			return this.$store.getters.baseUrl + '/logout?path=' + this.$route.path + queryString
		},
		theme(): string | null {
			if (this.$route.path.indexOf('/ebird') !== -1) {
				return 'ebird'
			} else {
				return null
			}
		},
		ebirdWebPortalBase(): string {
			if (this.$route.params.portal) {
				return this.$config.ebirdWebBase + this.$route.params.portal + '/'
			} else {
				return this.$config.ebirdWebBase
			}
		},
	},
	mounted() {
		// close language menu when switching language
		this.$nuxt.$options.i18n.onLanguageSwitched = () => {
			const el = this.$el as HTMLElement
			el.focus()
		}
	},
})
</script>

<style></style>
