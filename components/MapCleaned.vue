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
				const clickedRes = feature.properties.h3_resolution
				const clickedId = feature.id

				// - When hex is !selected=true, select all PARENTS and CHILDREN
				// - If hex selected=true when clicked, deselect that hex
				// - If ^ was parent, deselect all children
				// - If ^ was the LAST selected child, deselect immediate parent
				// - Check ALL preceding parents - if children are not selected=true, deselect

				const allParents = []
				this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: feature.id }, { selected: !feature.state.selected })
				const resOptions = [5, 6, 7, 8]

				const all = resOptions.filter((res) => res < clickedRes).map((res) => this.getParents([clickedId], res)[0])
				// console.log(all)

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
						})
					} else if (res < clickedRes) {
						// console.log('parents:', res)
						const parents = this.getParents([clickedId], res)
						// allParents.push(parents[0])
						const childrenOfParents = this.getChildrenHexIndices(parents, res + 1)
						const parentState = this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parents[0] }).selected
						// TODO Need to deselect parents

						// select parent elements if child clicked for first time
						if (!parentState) {
							this.map.setFeatureState(
								{ source: 'tiles', sourceLayer: 'hex', id: parents[0] },
								{ selected: !feature.state.selected }
							)
						} else {
							// FIXME: this includes second child initial click

							// TODO Need to select highest parent level and exclude current res children
							const childrenStatus = childrenOfParents.map(
								(child) => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: child }).selected
							)
							const childrenDefined = childrenStatus.filter((status) => status !== undefined)
							const deselectParent = childrenDefined.includes(false) && !childrenDefined.includes(true)

							if (deselectParent) {
								// only deselects immediate parent
								this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parents[0] }, { selected: false })
							} else {
							}
						}
					}
				})
				// const parentRes = resOptions.filter(res => res < clickedRes)
				// const childrenRes = resOptions.filter(res => res > clickedRes)
				// // console.log('parent:', parentRes, 'children:', childrenRes)
				//
				// if (parentRes.length) {
				//     const parents = parentRes.map(res => this.getParents([feature.id], res)).map(id => this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: id }, { selected: !feature.state.selected }))
				//     // console.log(parents)
				// } else if (childrenRes.length) {
				//     const children = childrenRes.map(res => this.getChildrenHexIndices([feature.id], res))
				//     // console.log(children)
				//     children.forEach(child => {
				//         child.forEach(id => {
				//             this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: id }, { selected: !feature.state.selected })
				//         })
				//     })
				// }

				// 	const pa = this.getParents([feature.properties.h3_address], feature.properties.h3_resolution - 1)
				// 	// console.log(pa)
				//     // const pa2 = this.getParents(pa, feature.properties.h3_resolution - 2)
				//     // console.log(pa2)
				// 	const ch = this.getChildrenHexIndices(pa, feature.properties.h3_resolution)
				//     // console.log(ch)
				//     // const ch2 = this.getChildrenHexIndices(pa2, feature.properties.h3_resolution - 1)
				//     // console.log(ch2)
				//
				//
				//     const resOptions = [5, 6, 7, 8]
				//     const parentRes = resOptions.filter(res => res < feature.properties.h3_resolution)
				//     // console.log(parentRes)
				//     const parents = {}
				//     parentRes.forEach(res => {
				//         const parent = this.getParents([feature.properties.h3_address], res)
				//         const children = this.getChildrenHexIndices(parent, res + 1)
				//         const selectedChildren = children.map((c) => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }).selected).filter((x) => x !== undefined)
				//         parents[parent[0]] = {
				//             children: children,
				//             deselectParent: selectedChildren.includes(false) && !selectedChildren.includes(true)
				//             // deselectParent: selectedChildren
				//         }
				//         // parents[parent[0]] = children
				//     })
				//     // const parents = parentRes.map(res => this.getParents([feature.properties.h3_address], res))
				//     // console.log(parents)
				//     Object.entries(parents).forEach(([parent, children]) => {
				//         const y = children.children
				//             .map((c) => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }).selected)
				//             // .filter((x) => x !== undefined)
				//         const deselectParent = y.includes(false) && !y.includes(true)
				//         // console.log(parent, children.children, y, deselectParent)
				//         // console.log('CLICKED:', feature.id)
				//         // console.log('parent:', parent, 'deselect parent?', deselectParent)
				//
				//
				//         // console.log('children:', children.children, y)
				//
				//         // console.log('deselect immediate parent:', deselectParent)
				//
				//         // // TODO test selecting and reseelcting same pixels
				//         // if (this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parent }).selected === undefined) {
				//         //
				//         //     this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parent }, { selected: !deselectParent })
				//         //
				//         //
				//         // } else {
				//         //     // console.log(children)
				//         //
				//         //     children.children.forEach(c => {
				//         //
				//         //         // console.log(parent, c, this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }).selected)
				//         //
				//         //         if (this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }).selected) {
				//         //
				//         //             console.log('parent:', parent, this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parent }).selected)
				//         //             console.log('child:', c, Object.keys(parents).includes(c))
				//         //
				//         //             this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }, { selected: !Object.keys(parents).includes(c)})
				//         //
				//         //
				//         //             // IF CHILDREN OF PARENT ARE ALL SELECTED=FALSE, DESELECT PARENT
				//         //             if (this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parent }).selected && Object.keys(parents).includes(c)) {
				//         //                 // console.log('clear', parent)
				//         //             }
				//         //             // this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parent }, { selected: !Object.keys(parents).includes(c)})
				//         //
				//         //         }
				//         //
				//         //         //
				//         //         // const x = children.children.map(x => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: x }).selected)
				//         //         // console.log(parent, children.children, children.children.map(x => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: x }).selected))
				//         //         //
				//         //         // if (x.includes(false) && !x.includes(true)) {
				//         //         //     console.log('clear', parent)
				//         //         //     this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: parent }, { selected: false})
				//         //         //
				//         //         // }
				//         //
				//         //         // console.log(c,this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }).selected)
				//         //     })
				//         //
				//         //
				//         //
				//         //
				//         // }
				//
				//
				//         // children.forEach(child => {
				//         //     // console.log(parent, child, this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: child }).selected)
				//         //     // console.log(this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: child }).selected)
				//         //
				//         //     // if (this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: child }).selected === undefined) {
				//         //     // // console.log(res, i, !deselectParent)
				//         //     //     this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: child }, { selected: !deselectParent })
				//         //     // }
				//         // })
				//     })
				//
				//
				//     console.log('______________________')
				//
				//
				//
				//
				//     const y = ch
				// 		.map((c) => this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: c }).selected)
				// 		.filter((x) => x !== undefined)
				// 	// console.log(y, Array.from(new Set(y)))
				// 	const deselectParent = y.includes(false) && !y.includes(true)
				// 	// console.log(ch)
				//
				//
				//     const lowerRes = resOptions.filter(res => res < feature.properties.h3_resolution)
				//     // console.log(lowerRes)
				//     const chRes = lowerRes.map(res => res + 1)
				//     // console.log(chRes)
				//
				//     const lowerParents = lowerRes.map(res => this.getParents([feature.properties.h3_address], res))
				//     // console.log(lowerParents)
				//
				//
				//     const t = lowerParents.map(p => this.getChildrenHexIndices(p, 8))
				//     // console.log(t)
				//
				//     // lowerParents.forEach(p => {
				//     //     // console.log(p)
				//     //     const t = lowerRes.map(res => this.getChildrenHexIndices(p, res + 1))
				//     //     console.log(t)
				//     // })
				//
				// 	resOptions.forEach((res) => {
				// 		// console.log(feature.properties.h3_resolution)
				// 		const c = this.getChildrenHexIndices([feature.properties.h3_address], res)
				// 		// console.log('CHILDREN RES', res, c)
				// 		c.forEach((i) => {
				// 			this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }, { selected: !feature.state.selected })
				// 		})
				//
				//
				//
				// 		const p = this.getParents([feature.properties.h3_address], res)
				//         // console.log(res, p)
				//
				// 		p.forEach((i) => {
				// 		    // console.log(this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }).selected)
				// 			// if (res !== feature.properties.h3_resolution) {
				//
				//             // this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }, { selected: !feature.state.selected })
				//
				// 			if ((res === feature.properties.h3_resolution - 1) || this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }).selected === undefined) {
				// 			// if (this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }).selected === undefined) {
				// 			    // console.log(res, i, !deselectParent)
				// 				this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }, { selected: !deselectParent })
				// 			}
				// 		})
				//
				// 	})
				//
				//
				//
				// 	// const c = this.getChildrenHexIndices([e.features[0].properties.index], 8)
				// 	// // console.log(c)
				// 	// c.forEach((i) => {
				// 	// 	this.map.setFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }, { selected: true })
				// 	// })
				// 	//
				// 	// // TODO Handle deselections - hardcoding true for parents is interfering w first feature state setting
				// 	// // TODO Handle partially selected parents
				// 	// // TODO Test multiple selections with shape draws
				// 	// const p = this.getParents([e.features[0].properties.index], 7)
				// 	// // console.log(p)
				// 	// p.forEach((i) => {
				// 	// 	console.log(this.map.getFeatureState({ source: 'tiles', sourceLayer: 'hex', id: i }).selected)
				// 	//
				// 	// 	// TODO Need to handle parents conditionally to not overwrite initial feature state
				// 	// 	// this.map.setFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}, {selected: this.map.getFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}).selected})
				// 	// })
				// 	//
				// 	// // const t = this.map.queryRenderedFeatures(e.point, {layers: ['tiles']})
				// 	// // console.log(t)
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
