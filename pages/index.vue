<template>
	<div>
		<CloPageSection padding="flush" color="primaryDark">
			<CloGridFlex class="u-colorReverse">
				<CloGridFlexCell class="u-md-size1of3 u-inset-responsive heroText">
					<div>
						<CloHeading level="1">{{ $t('app.title') }}</CloHeading>
						<p class="u-margin-none">A starter configuration with examples for creating Lichen-based web applications</p>
					</div>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-md-size2of3">
					<CloMedia overlap class="u-margin-none">
						<template #content>
							<CloImageAspectRatio shape="twentyOneByNine" reverse>
								<template #image>
									<img
										class="heroImage"
										alt="Long-billed Curlew"
										:src="env.mlDownloadBase + heroAssetId + '/640'"
										:srcset="
											env.mlDownloadBase +
											heroAssetId +
											'/160 160w,' +
											env.mlDownloadBase +
											heroAssetId +
											'/320 320w,' +
											env.mlDownloadBase +
											heroAssetId +
											'/480 480w,' +
											env.mlDownloadBase +
											heroAssetId +
											'/640 640w,' +
											env.mlDownloadBase +
											heroAssetId +
											'/900 900w,' +
											env.mlDownloadBase +
											heroAssetId +
											'/1200 1200w,' +
											env.mlDownloadBase +
											heroAssetId +
											'/1800 1800w,' +
											env.mlDownloadBase +
											heroAssetId +
											'/2400 2400w'
										"
										sizes="(min-width: 768px) 67vw, 100vw"
									/>
								</template>
							</CloImageAspectRatio>
						</template>
						<template #caption>
							<CloMediaCredit
								inline
								overlay
								reverse
								commonName="Long-billed Curlew"
								sciName="Numenius americanus"
								copyright="Dorian Anderson"
								ebirdChecklistId="S76993419"
								:citationUrl="'https://macaulaylibrary.org/asset/' + heroAssetId"
							/>
						</template>
					</CloMedia>
				</CloGridFlexCell>
			</CloGridFlex>
		</CloPageSection>
		<CloPageSection>
			<CloGridFlex gutter="lg">
				<CloGridFlexCell class="u-md-size2of3">
					<p>The Lichen Starter Nuxt Application has examples of:</p>
					<ul>
						<li>Docker configuration</li>
						<li>Environmental variables (including server-only secrets)</li>
						<li>Internationalization</li>
						<li>Authentication with CAS (stateless), authorization with is-auth-api, eBird user preferences</li>
						<li>Server-side data fetching and server-side rendering</li>
						<li>Typescript configuration</li>
						<li>Examples of using services and models (as in Angular architecture)</li>
						<li>SEO and social sharing configuration</li>
						<li>Google tag manager</li>
						<li>Examples of common Lichen layouts and components</li>
						<li>eBird Portal configuration</li>
					</ul>
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
	name: 'home',
	data() {
		return {
			env: this.$config,
			heroAssetId: '294584391',
		}
	},
})
</script>

<style lang="scss">
.heroText {
	display: grid;
	align-items: end;
}
</style>
