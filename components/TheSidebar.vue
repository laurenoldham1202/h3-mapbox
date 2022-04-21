<template>
	<div class="sidebar">
		<CloSectionMenu>
			<CloSectionMenuSection :heading="{ title: 'Examples' }" class="u-margin-none">
				<NLink :to="localePath('/')" v-slot="{ href, navigate, isActiveExact }" custom>
					<CloSectionMenuItem :url="href" title="Home" :current="isActiveExact" @click.native="navigate" />
				</NLink>
				<NLink :to="localePath('user')" v-slot="{ href, navigate, isActive }" custom>
					<CloSectionMenuItem :url="href" title="User data" :current="isActive" @click.native="navigate" />
				</NLink>
				<NLink :to="localePath('fetch')" v-slot="{ href, navigate, isActive }" custom>
					<CloSectionMenuItem :url="href" title="Fetching data" :current="isActive" @click.native="navigate" />
				</NLink>
				<NLink :to="localePath('/ebird')" v-slot="{ href, navigate, isActive }" custom>
					<CloSectionMenuItem :url="href" title="Portals" :current="isActive" @click.native="navigate" />
				</NLink>
				<NLink :to="localePath('fixed')" v-slot="{ href, navigate, isActive }" custom>
					<CloSectionMenuItem :url="href" title="Fixed layout" :current="isActive" @click.native="navigate" />
				</NLink>
			</CloSectionMenuSection>
		</CloSectionMenu>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.sidebar {
	@include bg-neutral-light;
}
</style>
