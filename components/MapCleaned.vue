<template>
	<div id="map-2"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as M from 'mapbox-gl'
import geojson2h3 from 'geojson2h3'
import * as h3 from 'h3-js'
import { GeoJSON } from 'GeoJSON'
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

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
			zoom: 12,
			doubleClickZoom: false,
		})

        const Draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
        });
        this.map.addControl(Draw, 'top-left');

		this.map.on('load', () => {
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

			this.map.on('click', 'tiles', (e: any) => {
				// console.log(e.features[0])
				const feature = e.features[0]
				const clickedRes = feature.properties.h3_resolution
				const clickedId = feature.id

				this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: feature.id }, { selected: !feature.state.selected })

				// TODO Make fn
				if (feature.state.selected) {
					this.selected.splice(this.selected.indexOf(feature.id), 1)
				} else {
					this.selected.push(feature.id)
				}
				// console.log(this.selected)

				const resOptions = [5, 6, 7, 8]

				resOptions.forEach((res) => {
					if (res > clickedRes) {
						// console.log('Find children for', res)
						const children = this.getChildrenHexIndices([clickedId], res)
						// console.log(children)
						children.forEach((child) => {
							this.map.setFeatureState(
								{ source: 'tiles', sourceLayer: 'hex', id: child },
								{ selected: !feature.state.selected }
							)

							if (feature.state.selected) {
								this.selected.splice(this.selected.indexOf(child), 1)
							} else {
								this.selected.push(child)
							}
						})
					} else if (res < clickedRes) {
						// console.log('parents:', res)
						const parents = this.getParents([clickedId], res)
						// allParents.push(parents[0])
						const childrenOfParents = this.getChildrenHexIndices(parents, res + 1)
						const parentState = this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parents[0] }).selected

						// select parent elements if child clicked for first time
						if (!parentState) {
							this.map.setFeatureState(
								{ source: 'tiles', sourceLayer: 'hex', id: parents[0] },
								{ selected: !feature.state.selected }
							)

							if (feature.state.selected) {
								this.selected.splice(this.selected.indexOf([parents[0]]), 1)
							} else {
								this.selected.push(parents[0])
							}
						} else if (res === clickedRes - 1) {
							this.deselectParent(childrenOfParents, parents[0])
						} else if (res === clickedRes - 2) {
							setTimeout(() => {
								this.deselectParent(childrenOfParents, parents[0])
							}, 0)
						} else if (res === clickedRes - 3) {
							setTimeout(() => {
								this.deselectParent(childrenOfParents, parents[0])
							}, 10)
						}
					}
				})
			})
		})
	},
	methods: {
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
