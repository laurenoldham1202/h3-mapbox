<template>
	<div class="center">
		<CloHeading level="1">{{ text }}</CloHeading>
		<p v-if="error.statusCode !== 404">{{ $t('app.errorText') }}</p>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'Error',
	props: ['error'],
	data() {
		return {
			text: '' as string | null,
		}
	},
	beforeMount() {
		if (this.error.statusCode === 404) {
			this.text = this.$t('generic.notFound').toString()
		} else {
			this.text = this.$t('app.errorOccurred').toString()
		}
	},
	head(): any {
		return {
			title: this.text + ' - ' + this.$t('app.title'),
		}
	},
})
</script>

<style lang="scss" scoped>
#content {
	min-height: 80vh;
}
.center {
	margin: $space-xl 0;
	display: grid;
	place-items: center;
}
</style>
