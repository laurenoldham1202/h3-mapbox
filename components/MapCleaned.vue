<template>
	<span>

        <!-- TODO Add button to reset hexes, add button to 'smooth' range -->
		<button @click="selectMode = !selectMode">Selection mode: {{ selectMode }}</button>
		<button @click="rangeOnly = !rangeOnly">show new range only: {{ rangeOnly }}</button>

		<div id="map-2"></div>

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
import area from '@turf/area'
// @ts-ignore
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'


export default Vue.extend({
	data: () => ({
		map: undefined as any,
		coords: { lng: -96.35, lat: 37 } as M.LngLat,
		selectMode: false,
		rangeOnly: false,
		resolution: 3,
		draw: undefined as any,
        filtered: [] as any[],
        children: [] as any[],
	}),
	watch: {
		rangeOnly() {


            // console.log('RANGE MODE')
            // console.log('filtered:', this.filtered)
            // console.log('children:', this.children)
		},
	},
	mounted(): void {
		;(M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
		this.map = new M.Map({
			container: 'map-2',
			style: 'mapbox://styles/mapbox/streets-v11', // style URL
			center: this.coords,
			zoom: 6,
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
        this.map.addControl(new M.ScaleControl({maxWidth: 900}))

		this.map.on('load', () => {
			this.map.addSource('base-hex', {
				type: 'vector',
				promoteId: 'h3_address',
				tiles: ['http://localhost:8081/data/r3/{z}/{x}/{y}.pbf'],
				maxzoom: 4,
			})

			this.map.addLayer({
				id: 'base-hex',
				source: 'base-hex',
				'source-layer': 'hex',
				type: 'fill',
				paint: {
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'black'],
					'fill-opacity': 0.3,
				},
			})


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
					'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'black'],
				},
				layout: {
					'fill-sort-key': ['+', ['get', 'h3_address']],
				},
			})

            // TODO Return json with bounding box to use 'within' exp to filter out base-hex layer?
            // TODO Return single feature outline?
            this.map.addSource('species-range', {
                type: 'vector',
                tiles: ['http://localhost:8082/data/range-outline-max-6/{z}/{x}/{y}.pbf'],
                maxzoom: 7,
                promoteId: 'h3_address'
            })
            this.map.addLayer({
                id: 'species-range',
                source: 'species-range',
                'source-layer': 'hex',
                type: 'fill',
                paint: {
                    'fill-color': ['case', ['boolean', ['feature-state', 'selected'], true], 'deeppink', 'transparent'],
                    'fill-opacity': 0.3,
                },
            })




            // RIGHT CLICK
            this.map.on('contextmenu', (e) => {
                // console.log(e)

                // console.log('RIGHT CLICK')
                // console.log('filtered:', this.filtered)
                // console.log('children:', this.children)
            })


            // LEFT CLICK
            this.map.on('click', ['base-hex', 'children', 'species-range'], (e: any) => {
                // all layers for a clicked point
                const clickedLayers = e.features.map((feats: any) => feats.layer.id)

                // if user clicked within the species range...
                if (clickedLayers.includes('species-range')) {
                    // console.log('original range clicked')
                } else {
                    const feature = e.features[0]
                    const res = parseInt(feature.id[1])

                    // if select mode is off, i.e. if user is expanding or collapsing shapes
                    if (!this.selectMode) {

                        // console.log('filter out', feature.id)
                        this.filtered.push(feature.id)

                        const children = h3.h3ToChildren(feature.id, res + 1)
                        this.children.push(...children)
                        this.setChildFeatures()
                        // const childrenPoly = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({h3_address: hex}))
                        // console.log(childrenPoly)

                        // console.log('SELECT MODE OFF')
                        // console.log('filtered:', this.filtered)
                        // console.log('children:', this.children)


                        // console.log('find poly for ', childrenPoly)
                        // if user clicked outside of the species range, i.e. a base-hex or child
                        // console.log('outside range clicked')

                        // if select mode off...
                        // 1. filter out the selected feature (preserve in array and update map)
                        // 2. get hex children of feature
                        // 3. convert hex to geojson, set 'children' layer data
                    } else {  // if selection mode is on

                        // console.log('SELECT MODE ON')
                        // console.log('filtered:', this.filtered)
                        console.log('children:', this.children)
                    }

                }

            })

            const popup = new M.Popup({closeButton: false})
            this.map.on('mousemove', ['base-hex', 'children'], (e) => {
                popup.setHTML(e.features[0].id).setLngLat(e.lngLat).addTo(this.map)
            })

		})
	},
	methods: {
		uniqueValues(array: any[]) {
			return Array.from(new Set(array))
		},
        setChildFeatures() {
            const childrenPoly = geojson2h3.h3SetToFeatureCollection(this.children, (hex) => ({h3_address: hex}))
            this.map.getSource('children').setData(childrenPoly)
            // console.log(childrenPoly)
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
