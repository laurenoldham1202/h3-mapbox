<template>
	<span>
		<div id="map-2"></div>
		<button @click="selectMode = !selectMode">select mode: {{ selectMode }}</button>
		<button @click="rangeOnly = !rangeOnly">show new range only {{ rangeOnly }}</button>
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
        ids: [] as any[]
	}),
	watch: {
		selected(selected) {
			// TODO Only push to array if not already in array?
			console.log(Array.from(new Set(selected)))
		},
        rangeOnly() {
		    if (this.rangeOnly) {
		        console.log(this.ids)
		        // this.map.getFeatureState()
                this.map.setFilter('children', ['match', ['get', 'index'], Array.from(new Set(this.ids)), true, false])
            }
        }
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
			this.map.addSource('tiles', {
				type: 'vector',
				promoteId: 'h3_address',
				tiles: ['http://localhost:8081/data/range-test/{z}/{x}/{y}.pbf'],
				maxzoom: 9,
				// tiles: ['http://localhost:8081/data/join-new-ids/{z}/{x}/{y}.pbf']
			})

			this.map.on('zoom', () => {
				// console.log(this.map.getZoom())
			})

			// this.map.addLayer({
			// 	id: 'tiles',
			// 	source: 'tiles',
			// 	'source-layer': 'hex',
			// 	type: 'fill',
			// 	paint: {
			// 		'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'blue'],
			// 		'fill-opacity': 0.3,
			// 	},
			// })

			// const shp = {"id":"e541903ac62aa1867de7f3cad8e9ae70","type":"Feature","properties":{},"geometry":{"coordinates":[[[-95.20742187499955,44.384407236660934],[-97.49257812499935,44.32156135607303],[-101.44765624999951,41.55552975462436],[-104.87539062499943,41.35791954134666],[-106.0179687499995,40.96089425396141],[-106.89687499999947,39.890427476779905],[-107.33632812499944,38.528478441103516],[-107.24843749999953,36.223971656062346],[-106.54531249999941,35.1532323637759],[-103.5570312499995,33.92247743491963],[-97.66835937499957,33.7764905296592],[-95.11953124999927,32.525594402240415],[-90.72499999999948,32.969122198383786],[-89.75820312499923,33.99537726897219],[-87.9124999999994,38.04557392217728],[-88.00039062499934,39.41675145008787],[-89.14296874999941,40.96089425396141],[-88.9671874999992,41.94894273855695],[-90.02187499999937,42.728526362280434],[-95.20742187499955,44.384407236660934],[-95.20742187499955,44.384407236660934]]],"type":"Polygon"}}
			const shp = {
				id: 'c55b82b34100d2c2d7eb2e060f42331b',
				type: 'Feature',
				properties: {},
				geometry: {
					coordinates: [
						[
							[-112.8926778080454, 46.496417563973324],
							[-119.36422658381149, 46.55658712767425],
							[-120.2387602021586, 45.03233987189347],
							[-120.2387602021586, 42.828340710824364],
							[-118.31478624179552, 42.44231676179456],
							[-111.31851729502111, 42.37774669466478],
							[-110.79379712401311, 43.719742554748535],
							[-110.70634376217814, 46.31550893768946],
							[-112.8926778080454, 46.496417563973324],
							[-112.8926778080454, 46.496417563973324],
						],
					],
					type: 'Polygon',
				},
			}

			// this.map.addSource('shp', {
			// 	type: 'geojson',
			// 	data: shp,
			// })
			// this.map.addLayer({
			// 	id: 'shp',
			// 	source: 'shp',
			// 	type: 'fill',
			// 	paint: {
			// 		'fill-color': 'transparent',
			// 		'fill-outline-color': 'purple',
			// 	},
			// })

			this.map.addSource('grpchi', {
				type: 'vector',
				tiles: ['http://localhost:8081/data/range-outline/{z}/{x}/{y}.pbf'],
                maxzoom: 7,
			})
			this.map.addLayer({
				id: 'grpchi',
				source: 'grpchi',
                'source-layer': 'hex',
				type: 'fill',
                // filter: ['>', ['get', 'resident'], 0],
				paint: {
					// 'fill-color': 'transparent',
					// 'fill-outline-color': 'purple',
				},
			})

			const hex = geojson2h3.featureToH3Set(range, 3)
			const geo = geojson2h3.h3SetToFeatureCollection(hex, (hex) => ({ index: hex }))

            // const geojson = {"id":"8eb25ba70d452d97e1ddfcce5dd3c509","type":"Feature","properties":{},"geometry":{"coordinates":[[[-99.33506625318147,45.13314712628562],[-101.00487955708923,45.13314712628562],[-101.56148399172514,42.683079866666105],[-102.36546817508791,41.62863803346093],[-103.66421185590485,40.9782147291387],[-103.91159160463224,39.65795874143228],[-103.23129729563291,39.1322398894163],[-101.49963905454342,38.84381654664111],[-100.57196499681673,38.3119933246779],[-97.17049345181951,37.971513567475],[-97.04680357745609,36.84165053422949],[-96.6757339543653,36.49440699140514],[-94.6348510273673,36.792140282626605],[-93.58348709527718,38.36050350728348],[-95.68621495945743,38.55421925672027],[-95.50068014791177,39.61032990250396],[-96.98495864027439,40.791188855481806],[-96.73757889154703,41.44346493969201],[-96.18097445691163,41.90540315049239],[-96.49019914282017,43.000506465552206],[-96.79942382872926,43.3612818895958],[-98.28370232109134,43.496022931319146],[-98.84030675572728,44.29816727163572],[-98.77846181854555,45.00210923171318],[-99.08768650445464,45.08950120560945],[-99.33506625318147,45.13314712628562],[-99.33506625318147,45.13314712628562]]],"type":"Polygon"}}
            // const h = geojson2h3.featureToH3Set(geojson, 8)
            // // console.log(h)
			// const g = geojson2h3.h3SetToFeature(h, (hex) => ({ index: hex }))
            // console.log(g)

			this.map.addSource('usa', {
				type: 'geojson',
				data: geo,
				promoteId: 'index',
			})

			this.map.addLayer({
				id: 'usa',
				source: 'usa',
				type: 'fill',
				paint: {
					'fill-opacity': 0.3,
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'blue'],
				},
			})

			setTimeout(() => {
				//
				// console.log(shp.geometry, this.bboxToPixel(shp.geometry))
				const int = this.map.queryRenderedFeatures(this.bboxToPixel(shp.geometry), { layers: ['usa'] })
				const sel = int.map((x) => x.id)
				sel.forEach((hex) => {
					// this.map.setFeatureState({ source: 'usa', id: hex }, { selected: true })
				})
			}, 100)

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
					'fill-outline-color': 'blue',
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'transparent'],
				},
				layout: {
					'fill-sort-key': ['+', ['get', 'index']],
				},
			})


			this.map.on('draw.create', (e) => {
			// 	if (!this.selectMode) {
			// 		const selected = this.map.queryRenderedFeatures(this.bboxToPixel(e.features[0].geometry), {
			// 			layers: ['usa', 'children'],
			// 		})
			// 		// console.log(selected)
            //
					console.log(JSON.stringify(e.features[0]))
            //
			// 		// TODO Create different custom buttons for select and deselect?
			// 		selected.forEach((hex) => {
			// 			// console.log(hex.id)
			// 			// TODO filter out base layer and create new deeper hex layer?
			// 			// this.map.setFeatureState({ source: 'usa', id: hex.id }, { selected: true })
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
			// 			// this.map.setFeatureState({ source: 'usa', id: hex.id }, { selected: true })
            //             if (hex.id[1] === res) {
            //                 this.ids.push(hex.id)
            //
            //                 this.map.setFeatureState({ source: 'children', id: hex.id }, { selected: true })
            //             }
			// 		})
			// 	}
			})

			this.map.on('click', ['usa', 'children'], (e: any) => {
				// console.log(e.features[0])
				const feature = e.features[0]
                // console.log(feature)

                if (!this.selectMode) {
                    const res = parseInt(feature.id[1]) + 1
                    const children = h3.h3ToChildren(feature.id, res > 8 ? 8 : res)
                    const geo2 = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ index: hex }))
                    ch.push(...geo2.features)

                    this.map.getSource('children').setData({
                        type: 'FeatureCollection',
                        features: Array.from(new Set(ch)),
                    })
                    this.map.setLayoutProperty('children', 'fill-sort-key', ['+', ['get', 'index']])
                } else {
                    console.log(feature)
                    // TODO Allow deselect
                    this.map.setFeatureState({ source: 'children', id: feature.id }, { selected: !feature.state.selected })
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
				(child) => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: child }).selected
			)
			const childrenDefined = childrenStatus.filter((status) => status !== undefined)
			const deselectParent = childrenDefined.includes(false) && !childrenDefined.includes(true)

			this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parent }, { selected: !deselectParent })

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
        padding: 0.5rem
    }
</style>
