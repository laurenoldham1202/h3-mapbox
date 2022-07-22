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




            // RIGHT CLICK - collapse features
            this.map.on('contextmenu', (e: any) => {
                // selected feature - limited only to children layer (i.e. can't go past initial 3 res view)
                const feature = this.map.queryRenderedFeatures(e.point, {layers: ['children']})[0]
                if (feature) {
                    // console.log(feature.id)
                    const res = parseInt(feature.id[1]) - 1
                    const parent = h3.h3ToParent(feature.id, res)
                    // console.log('children:', this.children)
                    // console.log(parent, this.children.includes(parent))

                    if (this.arrayIncludesItem(this.filtered, parent)) {
                        this.removeItemFromArray(this.filtered, parent)
                    }
                    const layer = res === 3 ? 'base-hex' : feature.source
                    this.filterOutParentHexes(layer)

                    // TODO handle when collapsing while a fellow child of parent is extrapolated
                    const children = h3.h3ToChildren(parent, res + 1)
                    children.map(child => this.removeItemFromArray(this.children, child))
                    // console.log(children, this.children)
                    // console.log('children feats:', this.children)





                    const allChildren: any[] = []
                    const resolutions = [3, 4, 5, 6]
                    resolutions.forEach(reso => {
                        if (reso >= (res + 2)) {
                            // console.log(reso)
                            allChildren.push(...h3.h3ToChildren(parent, reso))
                        }
                    })
                    // const children2 = h3.h3ToChildren(parent, res + 2)
                    // children2.map(child => this.removeItemFromArray(this.children, child))
                    // console.log(children2)
                    // console.log()

                    // FIXME reselecting deselected features is weird
                    allChildren.forEach(ch => {
                        if (this.children.includes(ch)) {
                            // console.log(ch)
                            this.removeItemFromArray(this.children, ch)
                        }
                    })


                    this.setChildFeatures()


                    // const allChildren: any[] = []
                    // const resolutions = [3, 4, 5, 6]
                    // resolutions.forEach(reso => {
                    //     if (reso >= (res + 1)) {
                    //         // console.log(reso)
                    //         allChildren.push(...h3.h3ToChildren(parent, reso))
                    //     }
                    // })
                    // console.log(allChildren)
                    // allChildren.map(child => this.removeItemFromArray(this.children, child))
                    // // console.log(children)
                    // // const childrenOfChildren
                    // this.setChildFeatures()

                    // console.log(res + 1)
                    // console.log('RIGHT CLICK')
                    // console.log('filtered:', this.filtered)
                    // console.log(this.arrayIncludesItem(this.filtered, parent))
                    // console.log('children:', this.children)
                    // get parent, remove from filtered array, reset map filter
                    // get children of parent, remove all from children array, reset children elements
                    //
                }

            })


            // LEFT CLICK - select, deselect, or extrapolate features
            this.map.on('click', ['base-hex', 'children', 'species-range'], (e: any) => {
                // all layers for a clicked point
                const clickedLayers = e.features.map((feats: any) => feats.layer.id)

                // if user clicked within the species range...
                if (clickedLayers.includes('species-range')) {
                    // console.log('original range clicked')
                } else {  // if user clicked outside of the species range, i.e. a base-hex or child
                    const feature = e.features[0]
                    const res = parseInt(feature.id[1]) + 1

                    // if select mode is off, i.e. if user is expanding or collapsing shapes
                    if (!this.selectMode) {
                        // TODO Combine res restriction and selectMode conditions?
                        // only allow user to drill down to h3 res 6
                        if (res <= 6) {
                            this.filtered.push(feature.id)

                            this.filterOutParentHexes(feature.source)

                            // TODO Remove filtered/clicked values from children array?
                            const children = h3.h3ToChildren(feature.id, res)
                            this.children.push(...children)
                            // console.log(this.children)

                            // TODO Make sure that resetting all child features scales with thousands of children
                            // set child geojson features in layer
                            this.setChildFeatures()





                            this.filtered.forEach(f => {
                                if (children.includes(f)) {
                                    this.removeItemFromArray(this.filtered, f)
                                    // console.log(f)
                                }
                            })

                            this.filterOutParentHexes('children')


                            // // if the clicked hex is in the children array, remove it from array when hex is filtered out
                            // if (this.arrayIncludesItem(this.children, feature.id)) {
                            //     this.removeItemFromArray(this.children, feature.id)
                            // }


                            // console.log('SELECT MODE OFF')
                            // console.log('filtered:', this.filtered)
                            // console.log(feature)
                            // console.log('children:', this.children)

                        }
                    } else {  // if selection mode is on

                        // console.log('SELECT MODE ON')
                        // console.log('filtered:', this.filtered)
                        // console.log('children:', this.children)
                    }

                }

            })

            const popup = new M.Popup({closeButton: false})
            this.map.on('mousemove', ['base-hex', 'children'], (e: any) => {
                popup.setHTML(e.features[0].id).setLngLat(e.lngLat).addTo(this.map)
            })

		})
	},
	methods: {
		uniqueValues(array: any[]) {
			return Array.from(new Set(array))
		},
        setChildFeatures() {
		    // ensure that there are no duplicate children
		    this.children = this.uniqueValues(this.children)
            // convert hex ids into geojson, preserving the indices
            const childrenPoly = geojson2h3.h3SetToFeatureCollection(this.children, (hex) => ({h3_address: hex}))
            // apply geojson to map layer
            this.map.getSource('children').setData(childrenPoly)
        },
        filterOutParentHexes(featureSource: string) {
		    // if there are filtered features, filter listed ones out, otherwise remove filter to show all features
            this.map.setFilter(featureSource, this.filtered.length ? ['match', ['get', 'h3_address'], this.filtered, false, true] : null)
        },
        removeItemFromArray(array: any[], item: any) {
            array.splice(array.indexOf(item), 1)
        },
        arrayIncludesItem(array: any[], item: any) {
		    return array.includes(item)
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
