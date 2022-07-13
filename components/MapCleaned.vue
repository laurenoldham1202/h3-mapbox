<template>
	<span>
		<div id="map-2"></div>
		<button @click="selectMode = !selectMode">select mode: {{ selectMode }}</button>
		<button @click="rangeOnly = !rangeOnly">show new range only {{ rangeOnly }}</button>
		<!--		<button @click="adjust">adjust</button>-->
	</span>
</template>

<script lang="ts">
import Vue from 'vue'
import * as M from 'mapbox-gl'
import geojson2h3 from 'geojson2h3'
import * as h3 from 'h3-js'
import { GeoJSON } from 'GeoJSON'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import FreehandMode from 'mapbox-gl-draw-freehand-mode'
import intersect from '@turf/intersect'
import bbox from '@turf/bbox'
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'

import { USA, range } from '~/assets/us'

export default Vue.extend({
	data: () => ({
		map: undefined as any,
		coords: { lng: -96.35, lat: 37 } as M.LngLat,
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
		selected: [] as any[],
		selectMode: false,
		rangeOnly: false,
		ids: [] as any[],
	}),
	watch: {
		selected(selected) {
			// TODO Only push to array if not already in array?
			// console.log(Array.from(new Set(selected)))
		},
		rangeOnly() {
            console.log(this.selected)

            // // TODO Account for no ids selected
			// // if (this.rangeOnly) {
			// this.map.setLayoutProperty('base-hex', 'visibility', this.rangeOnly ? 'none' : 'visible')
			// console.log(this.ids.length, this.rangeOnly)
			// // this.map.getFeatureState()
			// if (this.ids.length > 0) {
			// 	// this.map.setLayoutProperty('children', 'visibility', this.rangeOnly ? 'visible' : 'none')
			// 	this.map.setLayoutProperty('children', 'visibility', 'visible')
			//
			// 	this.map.setFilter(
			// 		'children',
			// 		this.rangeOnly ? ['match', ['get', 'index'], Array.from(new Set(this.ids)), true, false] : null
			// 	)
			// } else {
			// 	this.map.setLayoutProperty('children', 'visibility', this.rangeOnly ? 'none' : 'visible')
			// }
			// // }
		},
	},
	mounted(): void {
		;(M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
		this.map = new M.Map({
			container: 'map-2',
			style: 'mapbox://styles/mapbox/streets-v11', // style URL
			center: this.coords,
			zoom: 3,
			doubleClickZoom: false,
		})

		const Draw = new MapboxDraw({
			displayControlsDefault: false,
			// defaultMode: 'draw_polygon',
			controls: {
				polygon: true,
				trash: true,
			},
			modes: Object.assign(MapboxDraw.modes, {
				draw_polygon: FreehandMode,
				// draw_polygon: DrawRectangle,
			}),
		})
		this.map.addControl(Draw, 'top-left')

		this.map.on('load', () => {
			this.map.addSource('base-hex', {
				type: 'vector',
				promoteId: 'h3_address',
				tiles: ['http://localhost:8081/data/r4/{z}/{x}/{y}.pbf'],
				maxzoom: 4,
			})

			this.map.addLayer({
				id: 'base-hex',
				source: 'base-hex',
				'source-layer': 'hex',
				type: 'fill',
				paint: {
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'green', 'black'],
					// 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'green', 'blue'],
					'fill-opacity': 0.3,
				},
			})

			// FIXME this method doesn't allow deselection of original range boundaries
			this.map.addSource('species-range', {
				type: 'vector',
				tiles: ['http://localhost:8082/data/range-outline-2/{z}/{x}/{y}.pbf'],
				maxzoom: 7,
			})
			this.map.addLayer({
				id: 'species-range',
				source: 'species-range',
				'source-layer': 'hex',
				type: 'fill',
				// filter: ['>', ['get', 'resident'], 0],
				paint: {
					'fill-color': 'green',
					'fill-opacity': 0.3,
					// 'fill-outline-color': 'purple',
				},
			})

			this.map.addSource('children', {
				type: 'geojson',
				data: {},
				promoteId: 'h3_address',
			})

			this.map.addLayer({
				id: 'children',
				source: 'children',
				type: 'fill',
				paint: {
					'fill-opacity': 0.3,
					'fill-outline-color': 'black',
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'green', 'black'],
				},
				layout: {
					'fill-sort-key': ['+', ['get', 'h3_address']],
				},
			})

			const childFeatures: any[] = []
			const filteredParents: string[] = []

			this.map.on('click', ['base-hex', 'children'], (e: any) => {
				const feature = e.features[0]
				if (!this.selectMode) {
					const res = parseInt(feature.id[1]) + 1
					const children = h3.h3ToChildren(feature.id, res > 6 ? 6 : res)
					if (res <= 6) {
						filteredParents.push(feature.id)
						const geojson = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ h3_address: hex }))
						// console.log(geojson)
						childFeatures.push(...geojson.features)

						this.map.getSource('children').setData({
							type: 'FeatureCollection',
							features: childFeatures,
						})

						// console.log(filteredParents)
						// console.log(childFeatures)
						this.map.setFilter(feature.source, [
							'match',
							['get', 'h3_address'],
							this.uniqueValues(filteredParents),
							false,
							true,
						])

                        if (this.selected.includes(feature.id)) {
                            this.selected.splice(this.selected.indexOf(feature.id), 1)
                        }
					}
				} else {
				    if (this.selected.includes(feature.id)) {
				        this.selected.splice(this.selected.indexOf(feature.id), 1)
                    } else {
				        this.selected.push(feature.id)
                    }
					this.map.setFeatureState(
						{ source: feature.source, ...(feature.sourceLayer === 'hex' && { sourceLayer: 'hex' }), id: feature.id },
						{ selected: !feature.state.selected }
					)
				}

			})

			this.map.on('click', 'children', (e: any) => {
				const feature = e.features[0]
				// console.log(feature)
			})
		})
	},
	methods: {
		// Workflow:
		// 1. Draw shape, zoom to shape extent
		// 2. Button click to refine hex resolution (check # of hex first) - compact?
		// #. Button click to select all, otherwise
		// TODO Need to intersect and not use outright bbox
		bboxToPixel(polygon: any) {
			// TODO type
			// generate bounding box from polygon the user drew
			const box = bbox(polygon)
			// convert geographic coordinates to pixel coordinates on the map for `queryRenderedFeatures` formatting
			// https://docs.mapbox.com/mapbox-gl-js/api/map/#map#project
			const nePixel = this.map.project([box[2], box[3]])
			const swPixel = this.map.project([box[0], box[1]])
			// formatted as [{x: 10, y: 10}, {x: 20, y: 20}]
			return [swPixel, nePixel]
		},
		deselectParent(childrenOfParents: string[], parent: string) {
			const childrenStatus = childrenOfParents.map(
				(child) => this.map.getFeatureState({ source: 'base-hex', sourceLayer: 'hex', id: child }).selected
			)
			const childrenDefined = childrenStatus.filter((status) => status !== undefined)
			const deselectParent = childrenDefined.includes(false) && !childrenDefined.includes(true)

			this.map.setFeatureState({ source: 'base-hex', sourceLayer: 'hex', id: parent }, { selected: !deselectParent })

			if (deselectParent) {
				this.selected.splice(this.selected.indexOf([parent]), 1)
			} else {
				this.selected.push(parent)
			}
		},
		getChildrenHexIndices(parentHexArray: string[], res: number): string[] {
			const children: string[] = []
			parentHexArray.forEach((parent) => {
				children.push(...h3.h3ToChildren(parent, res))
			})
			return children
		},
		getParents(children: any[], res: number) {
			const parents: string[] = []
			children.forEach((child) => {
				parents.push(h3.h3ToParent(child, res))
			})
			return Array.from(new Set(parents))
		},
		uniqueValues(array: any[]) {
			return Array.from(new Set(array))
		},
	},
})
</script>

<style lang="scss">
#map-2 {
	width: 1000px;
	height: 800px;
	background: purple;
}

.mapboxgl-ctrl-group button {
	color: black;
}
button {
	border: 1px solid black;
	padding: 0.5rem;
}
</style>
