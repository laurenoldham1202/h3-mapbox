<template>
	<span>

<!--    <CloInputRadio value="increase" v-model:checked="mode" label="Increase resolution" pill />-->
<!--    <CloInputRadio value="decrease" v-model:checked="mode"label="Decrease resolution" pill />-->
<!--    <CloInputRadio value="select" v-model:checked="mode" label="Select" pill />-->


<!--        <input type="radio" id="increase" value="increase" v-model="mode" />-->
<!--        <label for="increase">Increase</label>-->

<!--        <input type="radio" id="decrease" value="decrease" v-model="mode" />-->
<!--        <label for="decrease">decrease</label>-->

<!--        <input type="radio" id="select" value="select" v-model="mode" />-->
<!--        <label for="select">select</label>-->


        <!-- TODO Add button to reset hexes, add button to 'smooth' range -->
		<button @click="selectMode = !selectMode">select mode: {{ selectMode }}</button>
		<button @click="rangeOnly = !rangeOnly" :class="{alert: updateRequired}">show new range only: {{ rangeOnly }}</button>

<!--		<button @click="adjustRes(true)" :disabled="resolution >= 6">+</button>-->
<!--		<button @click="adjustRes(false)" :disabled="resolution <= 4">-</button>-->
<!--        &lt;!&ndash; TODO Disable until shape is drawn &ndash;&gt;-->
<!--		<button @click="selectAll(true)">Select all</button>-->
<!--		<button @click="selectAll(false)">Deselect all</button>-->

		<div id="map-2"></div>



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
import area from '@turf/area'
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
		resolution: 3,
		draw: undefined as any,
		childFeatures: [] as any[],
        updateRequired: false,
        mode: 'select'
	}),
	watch: {
		rangeOnly() {
			// console.log(this.selected)
			const layers = ['base-hex', 'children']
			if (this.selected.length && this.rangeOnly) {
				console.log('features selected and range only mode active')
                // TODO CHECK THAT BOTH LAYERS ARE PROPERLY FILTERING AND FEATURE STATES ARE CORRECT??
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

            // console.log('RANGE TOGGLED')
            // console.log('selected:', this.selected)
            // console.log('filtered:', this.filtered)
            // console.log('children:', this.childFeatures)
            // console.log('-------------------')
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
					// 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'blue'],
					'fill-opacity': 0.3,
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


            // FIXME this method doesn't allow deselection of original range boundaries
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
                // filter: ['>', ['get', 'resident'], 0],
                paint: {
                    // 'fill-color': 'deeppink',
                    'fill-color': ['case', ['boolean', ['feature-state', 'selected'], true], 'deeppink', 'transparent'],
                    'fill-opacity': 0.3,
                    // 'fill-outline-color': 'purple',
                },
            })


			// const childFeatures: any[] = []

            // console.log(this.map.getStyle().layers)

            // TODO REPLACE WITH JIST FILTERED ARR?
            const filteredParents: string[] = []



            this.map.on('contextmenu', (e) => {
                // console.log(e)
                // console.log(e.target)
                // console.log(e.features)

                // console.log('IMPLODE:', filteredParents)

                const features = this.map.queryRenderedFeatures(e.point, {layers: ['children']})
                const feat = features[0]
                // TODO IF CHILD SELECTED<, SET PARENT TO SELECTED
                console.log('IMPLODE:', feat.id)
                const res = parseInt(feat.id[1])
                const parent = h3.h3ToParent(feat.id, res - 1)
                const children = h3.h3ToChildren(parent, res)


                // console.log(parent)
                // console.log(this.filtered)
                // console.log('child features:', this.childFeatures)
                // console.log('children of selected:', children)
                // console.log(children.includes(feat.id))
                // // console.log(this.childFeatures)
                // console.log(children.map(child => this.childFeatures.map(x => x.id).includes(child)))
                // console.log('filtered:', this.filtered)

                // console.log(this.childFeatures.map(x => x.id).includes(feat.id))
                // console.log(children.map(child => this.filtered.includes(child)))

                if (children.map(child => this.filtered.includes(child)).includes(true)) {
                // if (children.includes(feat.id)) {
                //     console.log('bloop')
                // if (children.map(child => this.childFeatures.map(x => x.id).includes(child)).includes(false) && children.map(child => this.childFeatures.map(x => x.id).includes(child)).includes(true)) {

                    // console.log('handle')
                    // console.log(this.childFeatures)
                    // console.log(filteredParents)
                    // filteredParents.splice(filteredParents.indexOf(feat.id), 1)

                } else {
                    children.forEach(child => {
                        // FIXME I don't think this is actually removing child features!
                        this.childFeatures.splice(this.childFeatures.indexOf(child), 1)
                        this.selected.splice(this.selected.indexOf(child), 1)
                    })

                    if (this.childFeatures.map(x => x.id).includes(feat.id)) {
                        console.log('didnt')

                        // remove parent from filtered, reset layer filter
                        const layer = res === 4 ? 'base-hex' : feat.source
                        // console.log(layer)
                        // console.log(parent, this.map.getFeatureState({source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: parent}))

                        // FIXME explode a hex, turn on select mode and select second hex, explode second hex - this selects all of the first hexes

                        this.filtered.splice(this.filtered.indexOf(parent), 1)
                        filteredParents.splice(filteredParents.indexOf(parent), 1)
                        this.map.setFilter(layer, this.filtered.length ?  ['match', ['get', 'h3_address'], this.filtered, false, true] : null)
                        // remove children  of parent  from childFeatures


                        console.log(children)
                        console.log(this.childFeatures.map(x => x.id))
                        this.childFeatures.forEach(child => {
                            if (children.includes(child.id)) {
                                console.log(child)
                                this.childFeatures.splice(this.childFeatures.indexOf(child), 1)
                            }
                        })
                        // console.log(this.childFeatures)
                        // this.map.getSource('children').setData({
                        //     type: 'FeatureCollection',
                        //     features: this.childFeatures,
                        // })
                        // handle selected?
                    } else {

                    this.map.getSource('children').setData({
                        type: 'FeatureCollection',
                        features: this.childFeatures,
                    })
                    // console.log(feat.id, 'IMPLODE: children:', this.childFeatures.map(x => x.id))
                    // console.log(this.childFeatures.map(x => x.id).includes(feat.id))



                        const layer = res === 4 ? 'base-hex' : feat.source
                        // console.log(layer)
                        // console.log(parent, this.map.getFeatureState({source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: parent}))

                        // FIXME explode a hex, turn on select mode and select second hex, explode second hex - this selects all of the first hexes

                        this.filtered.splice(this.filtered.indexOf(parent), 1)
                        filteredParents.splice(filteredParents.indexOf(parent), 1)
                        this.map.setFilter(layer, this.filtered.length ?  ['match', ['get', 'h3_address'], this.filtered, false, true] : null)


                        if (this.map.getFeatureState({source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: parent}).selected) {
                            this.selected.push(parent)
                        }

                        console.log('did stuff')
                    }

                    // console.log('IMPLODE: filtered: ', this.filtered)
                    // console.log('IMPLODE: selected:', this.selected)
                    // console.log('IMPLODE:', this.childFeatures.map(x => x.id))

                    //
                    // // FIXME Drill down two levels, implode an adjacent hex - then explode a larger adjacent hex

                    // console.log(this.childFeatures)
                    // console.log(this.childFeatures)
                    // get parent of selected id
                    // match selected id feature state
                    // match ^ with selected array
                    // get all children of parent, remove from children from childFeatures, set featureState to false
                }

                 // FIXME Explode selected, explode unselected, then implode selected - also happens without selected
                // console.log(feat.id, 'IMPLODE: children:', this.childFeatures.map(x => x.id))
                // console.log(this.childFeatures.map(x => x.id).includes(feat.id))


            })


                this.map.on('click', ['base-hex', 'children', 'species-range'], (e: any) => {
                    // 1m = 1e-6 .000001km
                    // 370000 = xkm

                    console.log(area(e.features[0]))
                    console.log(area(e.features[0]) * 1e-6)
                    // console.log(e.features.map(feats => feats.layer.id))
                    const clickedLayers = e.features.map(feats => feats.layer.id)

                    if (clickedLayers.includes('species-range')) {
                        const feat = e.features.filter(feats => feats.layer.id === 'species-range')[0]
                        // console.log(feat, feat.state.selected)
                        if (feat.state.selected === undefined) {

                            this.map.setFeatureState({source: feat.source, sourceLayer: feat.sourceLayer, id: feat.id}, {selected: false})
                        } else {
                            console.log(feat, feat.state.selected)

                            this.map.setFeatureState({source: feat.source, sourceLayer: feat.sourceLayer, id: feat.id}, {selected: !feat.state.selected})

                        }
                    } else {


                        // console.log('EXPLODE: (before) ', filteredParents)
                        // console.log('EXPLODE: (before) ', this.childFeatures.map(x => x.id))

                        const feature = e.features[0]
                        // console.log('EXPLODE:', feature.id)
                        if (!this.selectMode) {

                            // TODO Replace with getResolution everywhere
                            const res = parseInt(feature.id[1]) + 1
                            const children = h3.h3ToChildren(feature.id, res > 6 ? 6 : res)
                            // console.log(children)
                            if (res <= 6) {
                                // console.log(feature.id)
                                // this.childFeatures.splice(this.childFeatures.indexOf())
                                // this.childFeatures.forEach(child => {
                                //     if (child.id === feature.id) {
                                //         // console.log('DELETE!!!!', child)
                                //         this.childFeatures.splice(this.childFeatures.indexOf(child), 1)
                                //     }
                                // })
                                filteredParents.push(feature.id)
                                const geojson = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ h3_address: hex }))
                                // console.log(geojson)
                                this.childFeatures.push(...geojson.features)
                                // console.log(this.childFeatures.map(x => x.id))


                                this.map.getSource('children').setData({
                                    type: 'FeatureCollection',
                                    features: this.childFeatures,
                                })


                                // TODO Handle overlaps in range mode
                                if (feature.state.selected) {
                                    // this.childFeatures.map(feat => this.map.setFeatureState({source: 'children', id: feat.id}, {selected: true}))
                                    geojson.features.map(feat => this.map.setFeatureState({source: 'children', id: feat.id}, {selected: true}))
                                    this.selected.splice(this.selected.indexOf(feature.id), 1)

                                    this.selected.push(...this.childFeatures.map(feat => feat.id))
                                    this.selected = this.uniqueValues(this.selected)
                                    // console.log(this.selected)
                                }


                                // this.filtered = this.uniqueValues(filteredParents)
                                this.filtered.push(...filteredParents)
                                this.filtered = this.uniqueValues(this.filtered)

                                // console.log('EXPLODE:', this.filtered)
                                // console.log('EXPLODE:', this.selected)
                                // console.log(filteredParents)
                                // console.log(childFeatures)
                                // TODO Consider selecting children features on if parent feature is selected and then exploded
                                // TODO Deslect original pink shape
                                this.map.setFilter(feature.source, ['match', ['get', 'h3_address'], this.filtered, false, true])

                                // TODO Set selected filter again to avoid overlapping features in range only?

                                if (this.selected.includes(feature.id)) {
                                    // console.log('persist')
                                    this.selected.splice(this.selected.indexOf(feature.id), 1)
                                    // console.log(this.selected)
                                }

                            }

                            // console.log('EXPLODE:', this.childFeatures)
                            //
                            // console.log('EXPLODE: filtered: ', this.filtered)
                            // console.log('EXPLODE: selected:', this.selected)
                            // console.log('EXPLODE: children:', this.childFeatures.map(x => x.id))


                            // console.log('SELECT MODE OFF')
                            // console.log(feature)
                            // console.log('selected:', this.selected)
                            // console.log('filtered:', this.filtered)
                            // console.log('children:', this.childFeatures)
                            // console.log('-------------------')
                        } else {
                            if (this.selected.includes(feature.id)) {
                                // console.log('doot')
                                // if (this.rangeOnly) {
                                //     // TODO Need to turn this off and update
                                //     this.updateRequired = true
                                // }
                                this.selected.splice(this.selected.indexOf(feature.id), 1)
                            } else {
                                this.selected.push(feature.id)
                            }

                            // console.log(this.selected)

                            this.map.setFeatureState(
                                {
                                    source: feature.source,
                                    ...(feature.sourceLayer === 'hex' && { sourceLayer: 'hex' }),
                                    id: feature.id,
                                },
                                { selected: !feature.state.selected }
                            )

                            // console.log('SELECT MODE ON')
                            // console.log(feature)
                            // console.log('selected:', this.selected)
                            // console.log('filtered:', this.filtered)
                            // console.log('children:', this.childFeatures)
                            // console.log('-------------------')
                        }



                    }

                    // console.log('EXPLODE: (after) ', filteredParents)

                    // if (e.features.map(feats => feats.id))
                })


            const popup = new M.Popup({closeButton: false})
            this.map.on('mousemove', ['base-hex', 'children'], (e) => {
                popup.setHTML(e.features[0].id).setLngLat(e.lngLat).addTo(this.map)

            })

            // TODO Propagate seleections for point click and allow to drill out
            // Include res 3, don't focus on shape drawing
            // Shape drawing - default mode as select
            // FIXME select hex, show range only, explode selected hex causes errors
			this.map.on('click', ['base-hex', 'children'], (e: any) => {
			    // console.log(e)

                //
                // const feature = e.features[0]
                // // console.log('CLICKED:', feature.id)
                // if (!this.selectMode) {
                //
                //     // TODO Replace with getResolution everywhere
                //     const res = parseInt(feature.id[1]) + 1
                //     const children = h3.h3ToChildren(feature.id, res > 6 ? 6 : res)
                //     // console.log(children)
                //     if (res <= 6) {
                //         // console.log(feature.id)
                //         // this.childFeatures.splice(this.childFeatures.indexOf())
                //         // this.childFeatures.forEach(child => {
                //         //     if (child.id === feature.id) {
                //         //         // console.log('DELETE!!!!', child)
                //         //         this.childFeatures.splice(this.childFeatures.indexOf(child), 1)
                //         //     }
                //         // })
                //         filteredParents.push(feature.id)
                //         const geojson = geojson2h3.h3SetToFeatureCollection(children, (hex) => ({ h3_address: hex }))
                //         // console.log(geojson)
                //         this.childFeatures.push(...geojson.features)
                //         // console.log(this.childFeatures.map(x => x.id))
                //
                //
                //         this.map.getSource('children').setData({
                //             type: 'FeatureCollection',
                //             features: this.childFeatures,
                //         })
                //
                //
                //         // TODO Handle overlaps in range mode
                //         if (feature.state.selected) {
                //             // this.childFeatures.map(feat => this.map.setFeatureState({source: 'children', id: feat.id}, {selected: true}))
                //             geojson.features.map(feat => this.map.setFeatureState({source: 'children', id: feat.id}, {selected: true}))
                //             this.selected.splice(this.selected.indexOf(feature.id), 1)
                //
                //             this.selected.push(...this.childFeatures.map(feat => feat.id))
                //             this.selected = this.uniqueValues(this.selected)
                //             // console.log(this.selected)
                //         }
                //
                //
                //         // this.filtered = this.uniqueValues(filteredParents)
                //         this.filtered.push(...filteredParents)
                //         this.filtered = this.uniqueValues(this.filtered)
                //
                //         // console.log('EXPLODE:', this.filtered)
                //         // console.log('EXPLODE:', this.selected)
                //         // console.log(filteredParents)
                //         // console.log(childFeatures)
                //         // TODO Consider selecting children features on if parent feature is selected and then exploded
                //         // TODO Deslect original pink shape
                //         this.map.setFilter(feature.source, ['match', ['get', 'h3_address'], this.filtered, false, true])
                //
                //         // TODO Set selected filter again to avoid overlapping features in range only?
                //
                //         if (this.selected.includes(feature.id)) {
                //             // console.log('persist')
                //             this.selected.splice(this.selected.indexOf(feature.id), 1)
                //             // console.log(this.selected)
                //         }
                //
                //     }
                //
                //     // console.log('EXPLODE:', this.childFeatures)
                //     //
                //     // console.log('EXPLODE: filtered: ', this.filtered)
                //     // console.log('EXPLODE: selected:', this.selected)
                //     // console.log('EXPLODE: children:', this.childFeatures.map(x => x.id))
                //
                //
                //     // console.log('SELECT MODE OFF')
                //     // console.log(feature)
                //     // console.log('selected:', this.selected)
                //     // console.log('filtered:', this.filtered)
                //     // console.log('children:', this.childFeatures)
                //     // console.log('-------------------')
                // } else {
                //     if (this.selected.includes(feature.id)) {
                //         // console.log('doot')
                //         // if (this.rangeOnly) {
                //         //     // TODO Need to turn this off and update
                //         //     this.updateRequired = true
                //         // }
                //         this.selected.splice(this.selected.indexOf(feature.id), 1)
                //     } else {
                //         this.selected.push(feature.id)
                //     }
                //
                //     // console.log(this.selected)
                //
                //     this.map.setFeatureState(
                //         {
                //             source: feature.source,
                //             ...(feature.sourceLayer === 'hex' && { sourceLayer: 'hex' }),
                //             id: feature.id,
                //         },
                //         { selected: !feature.state.selected }
                //     )
                //
                //     // console.log('SELECT MODE ON')
                //     // console.log(feature)
                //     // console.log('selected:', this.selected)
                //     // console.log('filtered:', this.filtered)
                //     // console.log('children:', this.childFeatures)
                //     // console.log('-------------------')
                // }
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
    button:disabled {
        border-color: #7f828b;
        color: #7f828b;
    }

    .alert {
        background: red
    }
</style>
