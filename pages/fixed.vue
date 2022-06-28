<template>
	<CloFixedPanels :showText="$t('app.showOptions')" :hideText="$t('app.hideOptions')">
		<!-- Header and toolbar -->
		<template v-slot:header>
			<CloSkipTo :links="[{ href: '#content', label: $t('generic.skipToContent') }]" />
			<TheHeader />
			<TheToolbar id="content" />
		</template>
		<!-- Main -->
		<template v-slot:mainContent>
			<div class="u-inset-md">
<!--                <Map></Map>-->
                <MapCleaned></MapCleaned>
            </div>
		</template>
		<!-- Sidebar -->
		<template v-slot:mainSubBody>
			<div class="sidebar">
				<TheSidebar />
			</div>
		</template>
		<!-- Footer -->
		<template v-slot:footer>
			<TheFooter />
		</template>
	</CloFixedPanels>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'fixed',
	layout: 'fixed',
})
</script>

<style lang="scss" scoped>
.sidebar {
	@include bg-neutral-light;
	height: 100%;
}
</style>
