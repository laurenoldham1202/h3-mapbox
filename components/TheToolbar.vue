<template>
	<CloToolbar reverse color="primary">
		<CloToolbarGroup>
			<CloHeading level="1" size="3" reverse utilityClasses="u-margin-none u-inset-md">Page Heading</CloHeading>
		</CloToolbarGroup>
		<CloToolbarGroup>
			<CloToolbarItem label="Filter" icon="filter" dropdown id="changeRegion">Filters</CloToolbarItem>
		</CloToolbarGroup>
		<CloToolbarGroup align="right">
			<CloToolbarItem :label="$t('generic.Previous')" href="prev" previous divider />
			<CloToolbarItem :label="$t('generic.Next')" href="next" next />
		</CloToolbarGroup>
	</CloToolbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss"></style>
