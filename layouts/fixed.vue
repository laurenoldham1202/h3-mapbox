<template>
	<Nuxt />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'fixed',
})
</script>

<style lang="scss">
.page-enter-active {
	transition: opacity 0.2s ease-in-out;
}
.page-enter,
.page-leave-active {
	opacity: 0;
}
</style>
