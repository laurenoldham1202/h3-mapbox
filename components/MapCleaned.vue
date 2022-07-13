<template>
	<span>
		<div id="map-2"></div>
		<button @click="selectMode = !selectMode">select mode: {{ selectMode }}</button>
		<button @click="rangeOnly = !rangeOnly">show new range only {{ rangeOnly }}</button>
		<button @click="adjust">adjust</button>
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
			console.log(Array.from(new Set(selected)))
		},
		rangeOnly() {
		    // TODO Account for no ids selected
			// if (this.rangeOnly) {
			    this.map.setLayoutProperty('base-hex', 'visibility', this.rangeOnly ? 'none' : 'visible')
				// console.log(this.ids)
				// this.map.getFeatureState()
				this.map.setFilter('children', this.rangeOnly ? ['match', ['get', 'index'], Array.from(new Set(this.ids)), true, false] : null)
			// }
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
				promoteId: 'index',
			})

			const ch = []
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
					'fill-sort-key': ['+', ['get', 'index']],
				},
			})

			this.map.addSource('x', {
				type: 'geojson',
				data: {},
				promoteId: 'index',
			})

			this.map.addLayer({
				id: 'x',
				source: 'x',
				type: 'fill',
				paint: {
					// 'fill-opacity': 0.3,
					// 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'blue'],
					'fill-color': 'transparent',
					'fill-outline-color': 'blue',
				},
			})

			this.map.on('draw.create', (e) => {
				// 	if (!this.selectMode) {
				// 		const selected = this.map.queryRenderedFeatures(this.bboxToPixel(e.features[0].geometry), {
				// 			layers: ['base-hex', 'children'],
				// 		})
				// 		// console.log(selected)
				//
				console.log(JSON.stringify(e.features[0]))
				//
				// 		// TODO Create different custom buttons for select and deselect?
				// 		selected.forEach((hex) => {
				// 			// console.log(hex.id)
				// 			// TODO filter out base layer and create new deeper hex layer?
				// 			// this.map.setFeatureState({ source: 'base-hex', id: hex.id }, { selected: true })
				//
				// 			//parseInt(hex.id[1]) + 1
				// 			const res = parseInt(hex.id[1]) + 1
				// 			const children = h3.h3ToChildren(hex.id, res > 8 ? 8 : res)
				// 			// console.log(children)
				//
				// 			const geo2 = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ index: hex }))
				// 			ch.push(...geo2.features)
				// 		})
				//
				// 		// console.log(ch)
				// 		this.map.getSource('children').setData({
				// 			type: 'FeatureCollection',
				// 			features: Array.from(new Set(ch)),
				// 		})
				// 		this.map.setLayoutProperty('children', 'fill-sort-key', ['+', ['get', 'index']])
				// 		Draw.delete(e.features[0].id)
				//
				// 		setTimeout(() => {
				// 			Draw.changeMode(Draw.modes.DRAW_POLYGON)
				// 		}, 10)
				// 	} else {
				// 	    // TODO Add button to increase resolution instead of redrawing concentric shapes
				// 		// console.log('select!')
				// 		const selected = this.map.queryRenderedFeatures(this.bboxToPixel(e.features[0].geometry), { layers: ['children'] })
				// 		const sorted = Array.from(new Set(selected.map((x) => x.id).sort()))
				// 		const res = sorted[sorted.length - 1][1]
				// 		// console.log(res)
				// 		selected.forEach((hex) => {
				// 			// console.log(hex.id)
				// 			// TODO filter out base layer and create new deeper hex layer?
				// 			// this.map.setFeatureState({ source: 'base-hex', id: hex.id }, { selected: true })
				//             if (hex.id[1] === res) {
				//                 this.ids.push(hex.id)
				//
				//                 this.map.setFeatureState({ source: 'children', id: hex.id }, { selected: true })
				//             }
				// 		})
				// 	}
			})

            const filteredChildren = []
			this.map.on('click', ['base-hex', 'children'], (e: any) => {
				// console.log(e.features[0])
				const feature = e.features[0]
				// console.log(feature)

                // TODO Allow selection of base-hex
				if (!this.selectMode) {
					const res = parseInt(feature.id[1]) + 1
					const children = h3.h3ToChildren(feature.id, res > 6 ? 6 : res)
					if (res <= 6) {
						const geo2 = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ index: hex }))
						ch.push(...geo2.features)

						this.map.getSource('children').setData({
							type: 'FeatureCollection',
							features: Array.from(new Set(ch)),
						})
						this.map.setLayoutProperty('children', 'fill-sort-key', ['+', ['get', 'index']])

                        // TODO Deselect parent if selected but then exploded down
                        filteredChildren.push(feature.id)
                        // if (!this.ids.includes(feature.id)) {
                        //     // console.log('includes')
                        //
                        //     filteredChildren.push(feature.id)
                        // } else {
                        //     console.log('doesnt', feature.id)
                        //     console.log(this.ids, this.ids.indexOf(feature.id))
                        //     this.ids.splice(this.ids.indexOf(feature.id), 1)
                        //     this.map.setFeatureState({ source: 'children', id: feature.id }, { selected: !feature.state.selected })
                        //
                        // }

                        // this.ids.push(feature.id)
						this.map.setFilter('base-hex', ['match', ['get', 'h3_address'], filteredChildren, false, true])

						this.map.setFilter('children', ['match', ['get', 'index'], filteredChildren, false, true])
                        // console.log('filtered out:', filteredChildren)
                        // console.log('selected:', this.ids)

					}
				} else {
				    // TODO Update filter if range only mode on and feature deselected
				    // TODO Remove ids and filter
					// console.log(feature)
					// TODO Allow deselect
					this.map.setFeatureState({ source: 'children', id: feature.id }, { selected: !feature.state.selected })
                    if (!feature.state.selected) {

                        this.ids.push(feature.id)
                    } else {
                        // console.log('remove id')
                        this.ids.splice(this.ids.indexOf(feature.id), 1)
                        // this.map.setLayoutProperty('base-hex', 'visibility', this.rangeOnly ? 'none' : 'visible')
                        // // console.log(this.ids)
                        // // this.map.getFeatureState()
                        // this.map.setFilter('children', this.rangeOnly ? ['match', ['get', 'index'], Array.from(new Set(this.ids)), true, false] : null)
                    }


				}
			})

			this.map.on('click', 'children', (e: any) => {
				// console.log(e.features[0])
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
		adjust() {
			const feats = this.map.queryRenderedFeatures({ layers: ['base-hex'] })
			// TODO Add restriction on number of ids
			const ids = feats.map((x) => x.id)
			console.log(parseInt(ids[0][1] + 1))
			const c = Array.from(new Set(this.getChildrenHexIndices(ids, parseInt(ids[0][1]) + 1)))
			const geo = geojson2h3.h3SetToFeatureCollection(c, (hex) => ({ index: hex }))

			console.log(geo)
			// TODO This erases any previously plotted adjustments
			this.map.getSource('x').setData(geo)
		},
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
