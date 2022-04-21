<template>
	<div>
		<CloPageSection color="primaryDark">
			<CloHeading level="1" reverse>eBird Portals</CloHeading>
		</CloPageSection>
		<CloPageSection>
			<CloGridFlex gutter="lg">
				<CloGridFlexCell class="u-md-size2of3">
					<p class="portal-links">
						<NLink v-for="portal in portals" :key="portal" :to="{ params: { portal: portal } }">{{ portal }}</NLink>
					</p>
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

import { portals } from '~/static/portals'

export default Vue.extend({
	name: 'portals',
	data() {
		return {
			portals: portals,
		}
	},
})
</script>

<style lang="scss">
.portal-links {
	display: flex;
	gap: $space-md;
	flex-wrap: wrap;
}
</style>
