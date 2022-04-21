<template>
	<div>
		<footer v-if="theme === 'ebird'" class="u-inset-lg">
			<CloGridFlex gutter="responsive" class="u-colorReverse">
				<CloGridFlexCell class="u-ms-size1of2 u-md-size1of4">
					<CloHeading level="2" size="5">
						<a :href="ebirdWebPortalBase + 'explore'">{{ $t('nav.explore') }}</a>
					</CloHeading>
					<CloUnorderedList flat class="u-text-3">
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'map'">{{ $t('nav.speciesMaps') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'explore'">{{ $t('nav.exploreRegions') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'hotspots'">{{ $t('nav.exploreHotspots') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'media'">{{ $t('nav.searchPhotosAndSounds') }}</a>
						</CloUnorderedListItem>
					</CloUnorderedList>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-ms-size1of2 u-md-size1of4">
					<CloHeading level="2" size="5">
						<a :href="ebirdWebPortalBase + 'science'">{{ $t('nav.science') }}</a>
					</CloHeading>
					<CloUnorderedList flat class="u-text-3">
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'science/status-and-trends'">{{ $t('nav.ebirdStatusAndTrends', ['eBird']) }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'science/conservationimpacts'">{{ $t('nav.conservationImpacts') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'science/publications'">{{ $t('nav.publications') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="env.ebirdWebBase + 'data/download'">{{ $t('nav.requestData') }}</a>
						</CloUnorderedListItem>
					</CloUnorderedList>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-ms-size1of2 u-md-size1of4">
					<CloHeading level="2" size="5">
						<a :href="ebirdWebPortalBase + 'about'">{{ $t('nav.about') }}</a>
					</CloHeading>
					<CloUnorderedList flat class="u-text-3">
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'about/resources'">{{ $t('nav.resources') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'about/portals'">{{ $t('nav.regionalPortalsAndCollaborators') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'about/staff'">{{ $t('nav.staff') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a :href="ebirdWebPortalBase + 'about/jobs'">{{ $t('nav.jobs') }}</a>
						</CloUnorderedListItem>
					</CloUnorderedList>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-ms-size1of2 u-md-size1of4">
					<CloHeading level="2" size="5">
						<a href="https://support.ebird.org/support/solutions/48000298808">{{ $t('nav.help') }}</a>
					</CloHeading>
					<CloUnorderedList flat class="u-text-3">
						<CloUnorderedListItem>
							<a href="https://support.ebird.org/support/solutions/articles/48000957911">{{
								$t('nav.gettingStartedWithEbird', ['eBird'])
							}}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a href="https://support.ebird.org/support/solutions/articles/48000948757-ebird-faqs">{{
								$t('nav.frequentlyAskedQuestions')
							}}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a href="https://www.birds.cornell.edu/home/web-accessibility-assistance">{{
								$t('nav.webAccessibilityAssistance')
							}}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a href="http://www.birds.cornell.edu/Page.aspx?pid=1635">{{ $t('nav.privacyPolicy') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a href="http://www.birds.cornell.edu/Page.aspx?pid=1636">{{ $t('nav.termsOfUse') }}</a>
						</CloUnorderedListItem>
						<CloUnorderedListItem>
							<a href="https://support.ebird.org/support/tickets/new">{{ $t('nav.contact') }}</a>
						</CloUnorderedListItem>
					</CloUnorderedList>
				</CloGridFlexCell>
			</CloGridFlex>

			<hr style="opacity: 0.25" />

			<CloGridFlex gutter="responsive" verticalAlignment="alignMiddle">
				<CloGridFlexCell class="GridFlex-cell--middle u-ms-size1of2 u-md-size1of4 u-lg-sizeFit">
					<CloLogoEbird class="LogoEbird LogoEbird--xl LogoEbird--reverse u-stack-sm" id="footer" />
				</CloGridFlexCell>
				<CloGridFlexCell class="u-ms-size1of2 u-md-size1of4 u-lg-sizeFit">
					<a href="https://itunes.apple.com/us/app/ebird-by-cornell-lab-ornithology/id988799279">
						<img src="/badges/ios.svg" alt="Download on the App Store" />
					</a>
					<a href="https://play.google.com/store/apps/details?id=edu.cornell.birds.ebird">
						<img src="/badges/android.svg" alt="Get it on Google Play" />
					</a>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-ms-size1of2 u-md-size1of4 u-lg-sizeFit">
					<a
						href="https://join.birds.cornell.edu/ea-action/action?ea.client.id=1806&amp;ea.campaign.id=39939&amp;ea.tracking.id=EBR"
						class="Button Button--alert u-stack-sm"
						data-footer-donate=""
						>{{ $t('nav.donate') }}</a
					>
				</CloGridFlexCell>
				<CloGridFlexCell class="u-ms-size1of2 u-md-size1of4 u-lg-sizeFit">
					<span class="u-inline-md">
						<a
							href="https://www.facebook.com/ebird/"
							class="Button u-stack-sm u-inset-sm"
							title="Find us on Facebook"
							aria-label="Find us on Facebook"
						>
							<CloIcon symbol="socialFacebook" />
						</a>
						<a
							href="https://twitter.com/team_ebird/"
							class="Button u-stack-sm u-inset-sm"
							title="Follow us on Twitter"
							aria-label="Follow us on Twitter"
						>
							<CloIcon symbol="socialTwitter" />
						</a>
						<a
							href="https://instagram.com/team_ebird/"
							class="Button u-stack-sm u-inset-sm"
							title="Follow us on Instagram"
							aria-label="Follow us on Instagram"
						>
							<CloIcon symbol="socialInstagram" />
						</a>
					</span>
					<a href="https://shorepromotions.com/ebird_store/" class="Button Button--icon u-stack-sm">
						<CloIcon symbol="gift" />
						<span>{{ $t('nav.ebirdStore', ['eBird']) }}</span>
					</a>
				</CloGridFlexCell>
			</CloGridFlex>
		</footer>
		<footer v-else class="footer--minimal">
			<a href="https://birds.cornell.edu"><CloLogoLabShort reverse size="xs" /></a>
			<CloInlineList divided reverse>
				<CloInlineListItem>
					<a href="https://www.birds.cornell.edu/home/web-accessibility-assistance">{{ $t('nav.webAccessibilityAssistance') }}</a>
				</CloInlineListItem>
				<CloInlineListItem>
					<a href="http://www.birds.cornell.edu/Page.aspx?pid=1635">{{ $t('nav.privacyPolicy') }}</a>
				</CloInlineListItem>
				<CloInlineListItem>
					<a href="http://www.birds.cornell.edu/Page.aspx?pid=1636">{{ $t('nav.termsOfUse') }}</a>
				</CloInlineListItem>
				<CloInlineListItem>
					<a href="https://support.ebird.org/support/tickets/new">{{ $t('nav.contact') }}</a>
				</CloInlineListItem>
			</CloInlineList>
		</footer>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloButton from '@/base/CloButton/CloButton.vue'

export default Vue.extend({
	components: {
		CloButton,
	},
	data() {
		return {
			env: this.$config,
		}
	},
	computed: {
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
})
</script>

<style lang="scss" scoped>
.Button:not(.Button--icon) .Icon {
	width: 24px;
	height: 24px;
}
.footer--minimal {
	@include inset-squish-md;
	@include text(2);
	background-color: $color-black;
	display: flex;
	column-gap: $space-md;
	row-gap: $space-xs;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
}
</style>
