<template>
	<div id="map-2"></div>
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

import { USA } from '~/assets/us'

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
	}),
	watch: {
		selected(selected) {
			// TODO Only push to array if not already in array?
			console.log(Array.from(new Set(selected)))
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
			defaultMode: 'draw_polygon',
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
            const shp = {"id":"c55b82b34100d2c2d7eb2e060f42331b","type":"Feature","properties":{},"geometry":{"coordinates":[[[-112.8926778080454,46.496417563973324],[-119.36422658381149,46.55658712767425],[-120.2387602021586,45.03233987189347],[-120.2387602021586,42.828340710824364],[-118.31478624179552,42.44231676179456],[-111.31851729502111,42.37774669466478],[-110.79379712401311,43.719742554748535],[-110.70634376217814,46.31550893768946],[-112.8926778080454,46.496417563973324],[-112.8926778080454,46.496417563973324]]],"type":"Polygon"}}

            this.map.addSource('shp', {
                type: 'geojson',
                data: shp
            })
            this.map.addLayer({
                id: 'shp',
                source: 'shp',
                type: 'fill',
                paint: {
                    'fill-color': 'transparent',
                    'fill-outline-color': 'purple'
                }
            })
			const hex = geojson2h3.featureToH3Set(USA, 3)
			const geo = geojson2h3.h3SetToFeatureCollection(hex, (hex) => ({ index: hex }))

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
                const sel = int.map(x => x.id)
                sel.forEach(hex => {

                    this.map.setFeatureState({ source: 'usa', id: hex }, { selected: true })
                })
            }, 100)



            this.map.addSource('children', {
                type: 'geojson',
                data: {},
                promoteId: 'index'
            })

            const ch = []
            this.map.addLayer({
                id: 'children',
                source: 'children',
                type: 'fill',
                paint: {
                    'fill-opacity': 0.3,
                    'fill-outline-color': 'blue',
                    'fill-color': 'transparent'
                },
                layout: {
                    'fill-sort-key': ['+', ['get', 'index']]
                }
            })


            this.map.on('draw.create', (e) => {
				const selected = this.map.queryRenderedFeatures(this.bboxToPixel(e.features[0].geometry), { layers: ['usa', 'children'] })
				// console.log(selected)

                console.log(JSON.stringify(e.features[0]))

                // TODO Create different custom buttons for select and deselect?
				selected.forEach((hex) => {
				    // console.log(hex.id)
				    // TODO filter out base layer and create new deeper hex layer?
					// this.map.setFeatureState({ source: 'usa', id: hex.id }, { selected: true })

                    //parseInt(hex.id[1]) + 1
                    const res = parseInt(hex.id[1]) + 1
                    const children = h3.h3ToChildren(hex.id, res > 8 ? 8 : res)
                    // console.log(children)

                    const geo2 = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ index: hex }))
                    ch.push(...geo2.features)



				})


                // console.log(ch)
                this.map.getSource('children').setData({ type: 'FeatureCollection', features: Array.from(new Set(ch))})
                this.map.setLayoutProperty('children', 'fill-sort-key', ['+', ['get', 'index']])
				Draw.delete(e.features[0].id)

                setTimeout(() => {
                    Draw.changeMode(Draw.modes.DRAW_POLYGON)
                }, 10)

            })



			this.map.on('click', 'usa', (e: any) => {
				// console.log(e.features[0])
				const feature = e.features[0]
			})
			this.map.on('click', 'children', (e: any) => {
				// console.log(e.features[0])
				const feature = e.features[0]
                console.log(feature)
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
</style>
