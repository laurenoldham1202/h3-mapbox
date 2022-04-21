<template>
	<div>
		<CloPageSection color="primaryDark">
			<CloHeading level="1" reverse>User data</CloHeading>
		</CloPageSection>
		<CloPageSection>
			<CloGridFlex gutter="lg">
				<CloGridFlexCell class="u-md-size2of3">
					<p v-if="!user">Sign in to see user data</p>
					<template v-else>
						<p>
							This data comes from CAS, is-auth-api, and eBird preferences. It is encoded and stored in a cookie, and sent
							with each request to the Nuxt node server, which decodes the data, and makes it available to pages and
							components.
						</p>
						<pre>{{ user }}</pre>
					</template>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-md-size1of3">
					<TheSidebar />
				</CloGridFlexCell>
			</CloGridFlex>
		</CloPageSection>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'user',
	computed: {
		user() {
			const store: any = this.$store
			return store.state.session.user
		},
	},
})
</script>

<style lang="scss"></style>
