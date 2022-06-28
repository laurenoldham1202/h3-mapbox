<template>
	<div id="map-2"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as M from 'mapbox-gl'
import geojson2h3 from 'geojson2h3'
import * as h3 from 'h3-js'
import { GeoJSON } from 'GeoJSON'

export interface HexObject {
	[key: string]: number
}

interface HexConfigOptions {
	lat: number
	lng: number
	res: number
	rings: number
}

interface HexLayerOptions {
	geojson: GeoJSON.FeatureCollection
	id: string
	color?: string
	minzoom?: number
	maxzoom?: number
}

export default Vue.extend({
	data: () => ({
		map: undefined as any,
		coords: { lng: -91.35, lat: 37 } as M.LngLat,
		// coords: { lng: -76.486729, lat: 42.47949 } as M.LngLat,
		centerCoords: { lng: -100.486729, lat: 36.47949 } as M.LngLat,
		bbox: [
			[-104.6527823561, 36.3116770845],
			[-94.7570348445, 36.3116770845],
			[-94.7570348445, 42.9637944979],
			[-104.6527823561, 42.9637944979],
			[-104.6527823561, 36.3116770845],
		] as any,
		bboxRev: [
			[36.3116770845, -104.6527823561],
			[36.3116770845, -94.7570348445],
			[42.9637944979, -94.7570348445],
			[42.9637944979, -104.6527823561],
			[36.3116770845, -104.6527823561],
		] as any,
	}),
	mounted(): void {
		;(M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
		this.map = new M.Map({
			container: 'map-2',
			style: 'mapbox://styles/mapbox/streets-v11', // style URL
			center: this.coords,
			zoom: 12,
			doubleClickZoom: false,
		})

		this.map.on('load', () => {
			// this.map.on('zoom', () => {
			//     console.log(this.map.getZoom())
			// })

			this.map.addSource('tiles', {
				type: 'vector',
				promoteId: 'h3_address',
				tiles: ['http://localhost:8081/data/test/{z}/{x}/{y}.pbf'],
				maxzoom: 9,
				// tiles: ['http://localhost:8081/data/join-new-ids/{z}/{x}/{y}.pbf']
			})

			this.map.addLayer({
				id: 'tiles',
				source: 'tiles',
				'source-layer': 'hex',
				type: 'fill',
				paint: {
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'blue'],
					'fill-opacity': 0.3,
				},
			})

			const parents = []
			const count = {}
			this.map.on('click', 'tiles', (e) => {
				// console.log(e.features[0])
				const feature = e.features[0]

				// TODO Make each res have a different source-layer?
				this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: feature.id }, { selected: !feature.state.selected })

				const pa = this.getParents([feature.properties.h3_address], feature.properties.h3_resolution - 1)
				// console.log(pa)
				const ch = this.getChildrenHexIndices(pa, feature.properties.h3_resolution)
				const y = ch
					.map((c) => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }).selected)
					.filter((x) => x !== undefined)
				// console.log(y, Array.from(new Set(y)))
				const deselectParent = y.includes(false) && !y.includes(true)
				// console.log(ch)

				const resOptions = [5, 6, 7, 8]
				resOptions.forEach((res) => {
					// console.log(feature.properties.h3_resolution)
					const c = this.getChildrenHexIndices([feature.properties.h3_address], res)
					// console.log('CHILDREN RES', res, c)
					c.forEach((i) => {
						this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }, { selected: !feature.state.selected })
					})



					const p = this.getParents([feature.properties.h3_address], res)

					p.forEach((i) => {
					    console.log(this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }).selected)
						// if (res !== feature.properties.h3_resolution) {

						if ((res === feature.properties.h3_resolution - 1) || this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }).selected === undefined) {
						    // console.log(res, i, !deselectParent)
							this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }, { selected: !deselectParent })
						}
					})

				})



				// const c = this.getChildrenHexIndices([e.features[0].properties.index], 8)
				// // console.log(c)
				// c.forEach((i) => {
				// 	this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }, { selected: true })
				// })
				//
				// // TODO Handle deselections - hardcoding true for parents is interfering w first feature state setting
				// // TODO Handle partially selected parents
				// // TODO Test multiple selections with shape draws
				// const p = this.getParents([e.features[0].properties.index], 7)
				// // console.log(p)
				// p.forEach((i) => {
				// 	console.log(this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }).selected)
				//
				// 	// TODO Need to handle parents conditionally to not overwrite initial feature state
				// 	// this.map.setFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}, {selected: this.map.getFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}).selected})
				// })
				//
				// // const t = this.map.queryRenderedFeatures(e.point, {layers: ['tiles']})
				// // console.log(t)
			})
		})
	},
	methods: {
		getChildrenHexIndices(parentHexArray: string[], res: number): string[] {
			const children: string[] = []
			parentHexArray.forEach((parent) => {
				children.push(...h3.h3ToChildren(parent, res))
			})
			return children
		},
		getParents(children, res) {
			const parents: string[] = []
			children.forEach((child) => {
				parents.push(h3.h3ToParent(child, res))
			})
			return Array.from(new Set(parents))
		},
	},
})
</script>

<style lang="scss" scoped>
#map-2 {
	width: 1000px;
	height: 800px;
	background: purple;
}
</style>
