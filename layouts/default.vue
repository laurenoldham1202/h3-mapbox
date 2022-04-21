<template>
	<CloPage elevation flex full background="neutral">
		<CloSkipTo :links="links" />
		<CloPageSection padding="flush">
			<TheHeader />
		</CloPageSection>
		<main id="content"><Nuxt /></main>
		<CloPageSection padding="flush" color="black">
			<TheFooter />
		</CloPageSection>
	</CloPage>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'default',
	data() {
		return {
			links: [{ href: '#content', label: this.$t('generic.skipToContent') }],
		}
	},
})
</script>

<style lang="scss" scoped>
#content {
	min-height: 80vh;
}
.page-enter-active {
	transition: opacity 0.2s ease-in-out;
}
.page-enter,
.page-leave-active {
	opacity: 0;
}
</style>
