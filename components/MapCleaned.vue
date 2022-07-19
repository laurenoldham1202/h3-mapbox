<template>
	<span>
        Draw Menu:

		<button @click="adjustRes(true)" :disabled="resolution >= 6">+</button>
		<button @click="adjustRes(false)" :disabled="resolution <= 4">-</button>
        <!-- TODO Disable until shape is drawn -->
		<button @click="selectAll">Select all</button>
		<button>Deselect all</button>

		<div id="map-2"></div>
		<!-- TODO Add button to reset hexes, add button to 'smooth' range -->
		<button @click="selectMode = !selectMode">select mode: {{ selectMode }}</button>
		<button @click="rangeOnly = !rangeOnly" :class="{alert: updateRequired}">show new range only: {{ rangeOnly }}</button>


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
// import FreehandMode from 'mapbox-gl-draw-freehand-mode'
import intersect from '@turf/intersect'
import bbox from '@turf/bbox'
// @ts-ignore
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
		filtered: [] as any[],
		resolution: 4,
		draw: undefined as any,
		childFeatures: [] as any[],
		drawModeActive: false, // TODO MATCH WITH DEFAULT DRAW SETTING
        updateRequired: false,
        selectAllDrawn: false,
	}),
	watch: {
	    // TODO Have a separate toggle for selecting while shape is drawn
	    // TODO Check condition where you have elements selected and then change res
	    selectMode(selectMode) {
	        // // console.log(selectMode, this.childFeatures)
            // // TODO Handle if parent elements only, handle selections at different resolutions
            //
            // this.childFeatures.forEach(feat => {
            //     this.map.setFeatureState({source: 'children', id: feat.id}, {selected: selectMode})
            // })
        },
		resolution(res) {
		    // console.log(res)
            // console.log(this.childFeatures)
			// TODO Adjust for map extent, restricted to # of features and zoom level
			const layers = ['base-hex', 'children']
			// const all = this.draw.getAll()
			// const feat = all.features[0]
			//
			// // TODO Restrict to res 6, disable button ranges
			// // console.log(feat)
			// // console.log(res)
			// if (res <= 6) {
			//
			//     // TODO If select mode false, automatically drill down res when shape is drawn
			//     const hexes = h3.polyfill(feat.geometry.coordinates, res, true)
			//     // console.log(hexes)
			//     const geojson = geojson2h3.h3SetToFeatureCollection(hexes, (hex) => ({ h3_address: hex }))
			//     console.log(geojson)
			//     this.childFeatures.push(...geojson.features)
			//     this.map.getSource('children').setData({
			//         type: 'FeatureCollection',
			//         features: this.childFeatures,
			//     })
			// }
		},
		rangeOnly() {
			// console.log(this.selected)
			const layers = ['base-hex', 'children']
			if (this.selected.length && this.rangeOnly) {
				console.log('features selected and range only mode active')
				layers.forEach((layer) => {
					this.map.setLayoutProperty(layer, 'visibility', 'visible')

					this.map.setFilter(layer, ['match', ['get', 'h3_address'], this.selected, true, false])
				})
			} else if (this.selected.length && !this.rangeOnly) {
				console.log('features selected but range turned off')
				// console.log(this.filtered)
				layers.forEach((layer) => {
					this.map.setLayoutProperty(layer, 'visibility', 'visible')
					// if no features are filtered out (i.e. no hexes exploded) and range mode turned off, undo filter
					this.map.setFilter(layer, this.filtered.length ? ['match', ['get', 'h3_address'], this.filtered, false, true] : null)
					// this.map.setFilter(layer, ['match', ['get', 'h3_address'], this.filtered, false, true])
				})

				// TODO Handle trying to explode polygons in range only view
				// TODO HAndle when features selected/deselected in rangeOnly mode - should this be allowed?
			} else if (!this.selected.length && this.rangeOnly) {
				console.log('NO features selected and range turned on')
				layers.forEach((layer) => {
					this.map.setLayoutProperty(layer, 'visibility', 'none')
					// this.map.setFilter(layer, this.rangeOnly ? ['!', ['has', 'h3_address']] : ['has', 'h3_address'])
				})
			} else {
				layers.forEach((layer) => {
					this.map.setLayoutProperty(layer, 'visibility', 'visible')
					// this.map.setFilter(layer, this.rangeOnly ? ['!', ['has', 'h3_address']] : ['has', 'h3_address'])
				})

				console.log('NO features selected and range turned OFF')
			}
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

		this.draw = new MapboxDraw({
			displayControlsDefault: false,
			// defaultMode: 'draw_polygon',
			controls: {
				polygon: true,
				trash: true,
			},
            // @ts-ignore
			modes: Object.assign(MapboxDraw.modes, {
				// draw_polygon: FreehandMode,
				draw_polygon: DrawRectangle,
			}),
		})
		this.map.addControl(this.draw, 'top-left')

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
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'black'],
					// 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'blue'],
					'fill-opacity': 0.3,
				},
			})

			// FIXME this method doesn't allow deselection of original range boundaries
			// TODO Return json with bounding box to use 'within' exp to filter out base-hex layer?
			// TODO Return single feature outline?
			this.map.addSource('species-range', {
				type: 'vector',
				tiles: ['http://localhost:8082/data/range-outline-max-6/{z}/{x}/{y}.pbf'],
				maxzoom: 7,
			})
			this.map.addLayer({
				id: 'species-range',
				source: 'species-range',
				'source-layer': 'hex',
				type: 'fill',
				// filter: ['>', ['get', 'resident'], 0],
				paint: {
					'fill-color': 'deeppink',
					'fill-opacity': 0.3,
					// 'fill-outline-color': 'purple',
				},
			})

			// console.log(this.map.getSource('species-range'))
			// this.map.setFilter('base-hex', [])

			this.map.addSource('children', {
				type: 'geojson',
				data: {
				    type: 'FeatureCollection',
                    features: [],
                },
				promoteId: 'h3_address',
			})

			this.map.addLayer({
				id: 'children',
				source: 'children',
				type: 'fill',
				paint: {
					'fill-opacity': 0.3,
					// 'fill-outline-color': 'black',
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'black'],
				},
				layout: {
					'fill-sort-key': ['+', ['get', 'h3_address']],
				},
			})

			// const childFeatures: any[] = []
			const filteredParents: string[] = []

			this.map.on('click', ['base-hex', 'children'], (e: any) => {
				if (!this.drawModeActive) {
					// console.log(this.draw.getMode())
					const feature = e.features[0]
					if (!this.selectMode) {
						// TODO Replace with getResolution everywhere
						const res = parseInt(feature.id[1]) + 1
						const children = h3.h3ToChildren(feature.id, res > 6 ? 6 : res)
						if (res <= 6) {
							filteredParents.push(feature.id)
							const geojson = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ h3_address: hex }))
							// console.log(geojson)
							this.childFeatures.push(...geojson.features)

							this.map.getSource('children').setData({
								type: 'FeatureCollection',
								features: this.childFeatures,
							})

							// this.filtered = this.uniqueValues(filteredParents)
							this.filtered.push(...filteredParents)
							this.filtered = this.uniqueValues(this.filtered)

							console.log(this.filtered)
							// console.log(filteredParents)
							// console.log(childFeatures)
							// TODO Consider selecting children features on if parent feature is selected and then exploded
							this.map.setFilter(feature.source, ['match', ['get', 'h3_address'], this.filtered, false, true])

							if (this.selected.includes(feature.id)) {
								this.selected.splice(this.selected.indexOf(feature.id), 1)
							}
						}
					} else {
						if (this.selected.includes(feature.id)) {
						    console.log('doot')
                            if (this.rangeOnly) {
                                // TODO Need to turn this off and update
                                this.updateRequired = true
                            }
							this.selected.splice(this.selected.indexOf(feature.id), 1)
						} else {
							this.selected.push(feature.id)
						}

						console.log(this.selected)

						this.map.setFeatureState(
							{
								source: feature.source,
								...(feature.sourceLayer === 'hex' && { sourceLayer: 'hex' }),
								id: feature.id,
							},
							{ selected: !feature.state.selected }
						)
					}
				}
			})

            // TODO Handle drawing multiple shapes
			this.map.on('draw.create', (e: any) => {
				const feat = e.features[0]

                if (!this.selectMode) {

                    this.filtered.push(...this.uniqueValues(h3.polyfill(feat.geometry.coordinates, this.resolution, true)))
                    // console.log(this.filtered)

                    // FIXME Drawing second shape shouldn't increase res for both shapes
                    // TODO Should res always be uniform, or should diff shapes allow diff res?
                    this.resolution++
                    const res = this.resolution

                    // TODO disable button ranges
                    // console.log(feat)
                    // console.log(res)
                    if (res <= 6) {
                        // TODO If select mode false, automatically drill down res when shape is drawn
                        // const h = h3.polyfill(feat.geometry.coordinates, res, true)
                        // console.log(h)
                        const hexes = this.getChildrenHexIndices(this.filtered, this.resolution)
                        // console.log(hexes)
                        const geojson = geojson2h3.h3SetToFeatureCollection(hexes, (hex) => ({ h3_address: hex }))
                        // console.log(geojson)
                        this.childFeatures.push(...geojson.features)
                        this.map.getSource('children').setData({
                            type: 'FeatureCollection',
                            features: this.childFeatures,
                        })




                        // TODO Differ between base and children
                        this.map.setFilter('base-hex', ['match', ['get', 'h3_address'], this.filtered, false, true])
                    }
                    // this.draw.delete(feat.id)
                } else {

                    console.log()
                }



			})

			this.map.on('draw.modechange', (e: any) => {
				// console.log(e)
				// TODO HAndle this better so that final click doesn't select hex
				setTimeout(() => {
					this.drawModeActive = e.mode === 'draw_polygon'
				}, 10)
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
        // FIXME When feature states are set for selectAll and then single hex is clicked, weird stuff happens
        // TODO Handle drawing over hexes that have already been exploded
        adjustRes(increase: boolean) {
		    // console.log(this.resolution, increase, this.childFeatures)
            if (increase && this.resolution <= 5) {
                this.resolution++
            } else if (!increase && this.resolution >= 5) {
                this.resolution--
            }
            const hexes = increase ? this.getChildrenHexIndices(this.filtered, this.resolution) : this.uniqueValues(this.getParents(this.childFeatures.map(x => x.id), this.resolution))
            const geojson = geojson2h3.h3SetToFeatureCollection(hexes, (hex) => ({ h3_address: hex }))
            this.childFeatures = geojson.features
            this.map.getSource('children').setData({
                type: 'FeatureCollection',
                features: this.childFeatures,
            })
            if (this.selectAllDrawn) {
                this.childFeatures.map(feat => this.map.setFeatureState({source: 'children', id: feat.id}, {selected: true}))
            }
        },
        selectAll() {
		    this.selectAllDrawn = true
		    // console.log(this.filtered)
            console.log(this.childFeatures)
            this.childFeatures.map(feat => this.map.setFeatureState({source: 'children', id: feat.id}, {selected: true}))
        }
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
    button:disabled {
        border-color: #7f828b;
        color: #7f828b;
    }

    .alert {
        background: red
    }
</style>
