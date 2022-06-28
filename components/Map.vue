<template>
    <div id="map"></div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import * as M from 'mapbox-gl'
    import geojson2h3 from 'geojson2h3';
    import * as h3 from "h3-js";
    import { GeoJSON } from 'GeoJSON'

    export interface HexObject {
        [key: string]: number
    }

    interface HexConfigOptions {
        lat: number,
        lng: number,
        res: number,
        rings: number,
    }

    interface HexLayerOptions {
        geojson: GeoJSON.FeatureCollection,
        id: string,
        color?: string,
        minzoom?: number,
        maxzoom?: number,
    }

    export default Vue.extend({
        data: () => ({
            map: undefined as any,
            coords: { lng: -76.486729, lat: 42.479490} as M.LngLat,
            centerCoords: { lng: -100.486729, lat: 37.479490} as M.LngLat,
            bbox: [[-104.6527823561,36.3116770845],[-94.7570348445,36.3116770845],[-94.7570348445,42.9637944979],[-104.6527823561,42.9637944979],[-104.6527823561,36.3116770845]] as any,
            bboxRev: [[36.3116770845,-104.6527823561],[36.3116770845,-94.7570348445],[42.9637944979,-94.7570348445],[42.9637944979,-104.6527823561],[36.3116770845,-104.6527823561]] as any
        }),
        mounted(): void {
            (M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
            this.map = new M.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: this.coords,
                zoom: 9,
                doubleClickZoom: false,
            })

            this.map.on('load', () => {

                // this.map.on('zoom', () => {
                //     console.log(this.map.getZoom())
                // })
                //


                this.map.addSource('tiles', {
                    type: 'vector',
                    promoteId: 'index',
                    tiles: ['http://localhost:8081/data/join-7-8/{z}/{x}/{y}.pbf'],
                    // tiles: ['http://localhost:8081/data/join-new-ids/{z}/{x}/{y}.pbf']
                })

                this.map.addLayer({
                    id: 'tiles',
                    source: 'tiles',
                    'source-layer': 'hex',
                    type: 'fill',
                    paint: {
                        'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'yellow', 'blue' || 'black'],
                        'fill-opacity': 0.3
                    }
                })

                this.map.on('click', 'tiles', (e) => {
                    // console.log(e.features[0])

                    // TODO Make each res have a different source-layer?
                    this.map.setFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: e.features[0].id}, {selected: !e.features[0].state.selected})

                    const c = this.getChildrenHexIndices([e.features[0].properties.index], 8)
                    // console.log(c)
                    c.forEach(i => {

                        this.map.setFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}, {selected: true})
                    })

                    // TODO Handle deselections - hardcoding true for parents is interfering w first feature state setting
                    // TODO Handle partially selected parents
                    // TODO Test multiple selections with shape draws
                    const p = this.getParents([e.features[0].properties.index], 7)
                    // console.log(p)
                    p.forEach(i => {
                        // console.log(this.map.getFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}))

                        // TODO Need to handle parents conditionally to not overwrite initial feature state
                        // this.map.setFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}, {selected: this.map.getFeatureState({source: 'tiles', 'sourceLayer': 'hex', id: i}).selected})
                    })

                    // const t = this.map.queryRenderedFeatures(e.point, {layers: ['tiles']})
                    // console.log(t)

                })


                //
                // const hexFromBbox = h3.polyfill(this.bboxRev, 5)
                // const bbox4 = geojson2h3.h3SetToFeatureCollection(hexFromBbox)
                //
                // this.addHexLayer({geojson: bbox4, id: 'res4', maxzoom: 6, color: 'purple'})
                //
                // const childrenRes5 = this.getChildrenHexIndices(hexFromBbox, 6)
                // const childrenRes5GeoJson = geojson2h3.h3SetToFeatureCollection(childrenRes5)
                // this.addHexLayer({geojson: childrenRes5GeoJson, id: 'res5', minzoom: 6, maxzoom: 7, color: 'mediumvioletred'})
                //
                // const childrenRes6 = this.getChildrenHexIndices(childrenRes5, 7)
                // const childrenRes6GeoJson = geojson2h3.h3SetToFeatureCollection(childrenRes6)
                // this.addHexLayer({geojson: childrenRes6GeoJson, id: 'res6', minzoom: 7, maxzoom: 8, color: 'deeppink'})
                //
                // const childrenRes7 = this.getChildrenHexIndices(childrenRes5, 8)
                // const childrenRes7GeoJson = geojson2h3.h3SetToFeatureCollection(childrenRes7)
                // this.addHexLayer({geojson: childrenRes7GeoJson, id: 'res7', minzoom: 8, maxzoom: 11, color: 'mediumorchid'})


                const children = this.hexagonRing({...this.coords, res: 9, rings: 50})
                const geojson = geojson2h3.h3SetToFeatureCollection(children, hex => ({index: hex}))
                // console.log(JSON.stringify(geojson))
                // this.addHexLayer({geojson, id: 'ring', color: 'blue'})


                const parents = this.getParents(children, 8)
                // console.log(parents)
                // const x = this.hexagonRing({...this.coords, res: 8, rings: 20})
                // console.log(x)
                const y = geojson2h3.h3SetToFeatureCollection(parents, hex => ({index: hex}))
                // console.log(y)
                // console.log(JSON.stringify(y))
                // this.addHexLayer({geojson: y, id: 'y', color: 'darkblue'})



                const parents2 = this.getParents(parents, 7)
                // console.log(parents)
                // const x = this.hexagonRing({...this.coords, res: 8, rings: 20})
                // console.log(x)
                const y2 = geojson2h3.h3SetToFeatureCollection(parents2, hex => ({index: hex}))
                // console.log(y2)

                const parents3 = this.getParents(parents2, 6)
                // console.log(parents)
                // const x = this.hexagonRing({...this.coords, res: 8, rings: 20})
                // console.log(x)
                const y3 = geojson2h3.h3SetToFeatureCollection(parents3, hex => ({index: hex}))
                // console.log(y3)
                // console.log(JSON.stringify(y2))
                // this.addHexLayer({geojson: y3, id: 'y3', color: 'darkgreen'})


                const parents4 = this.getParents(parents2, 5)
                // console.log(parents)
                // const x = this.hexagonRing({...this.coords, res: 8, rings: 20})
                // console.log(x)
                const y4 = geojson2h3.h3SetToFeatureCollection(parents4, hex => ({index: hex}))
                // console.log(y4)
                // console.log(JSON.stringify(y2))
                this.addHexLayer({geojson: y4, id: 'y4', color: 'darkgreen'})




                // const p = this.getChildrenHexIndices(x, 9)
                // console.log(p)
                // console.log(JSON.stringify(geojson2h3.h3SetToFeatureCollection(p, hex => ({index: hex}))))


                this.map.on('mouseover', 'ring', () => {
                    this.map.getCanvas().style.cursor = 'pointer'
                })
                this.map.on('mouseout', 'ring', () => {
                    this.map.getCanvas().style.cursor = 'grab'
                })

                const selected: string[] = []
                this.map.on('click', 'ring', (e) => {
                    const feature = e.features[0]
                    // console.log(e)

                    const index = feature.properties.index

                    // console.log(feature)
                    if (selected.includes(index)) {
                        selected.splice(selected.indexOf(index), 1)
                    } else {
                        selected.push(index)
                    }
                    // console.log(selected)
                    // console.log('child id:', feature.id)
                    this.map.setFeatureState({source: 'ring', id: feature.id}, {selected: !feature.state.selected})

                    // console.log(selected)
                    const par = this.getParents(selected, 8)
                    // console.log(par)

                    // console.log(this.map.getSource('y'))

                    // console.log(this.map.getSource('ring'))
                    // console.log(this.map.getSource('y'))
                    // console.log(this.map.getLayer('y'))

                    // console.log(e)
                    const t = this.map.queryRenderedFeatures(e.point, {layers: ['y']})
                    this.map.setFeatureState({source: 'y', id: t[0].id}, {selected: true})
                    console.log(t)

                    par.forEach(p => {
                        // TODO Need to find id associated with indexed value
                        // console.log(p)
                        // this.map.setFeatureState({source: 'y', id: p}, {selected: true})
                    })






                })

                // console.log(children)
                // const x = h3.h3ToParent(children, 8)
                // console.log(x)
                // const parents = this.getParents(children, 8)
                // const g8 = geojson2h3.h3SetToFeatureCollection(parents)
                // this.addHexLayer({geojson: g8, id: 'g8', color: 'green'})
                //
                // const p2 = this.getParents(parents, 7)
                // const g7 = geojson2h3.h3SetToFeatureCollection(p2)
                // this.addHexLayer({geojson: g7, id: 'g7', color: 'yellow'})





                //
                // const parentIndex = h3.geoToH3(this.coords.lat, this.coords.lng, 4)
                // // console.log(parentIndex)
                //
                // const parentGeoJson = geojson2h3.h3ToFeature(parentIndex)
                // // console.log(parentGeoJson)
                //
                // this.map.addSource('test', {
                //     type: 'geojson',
                //     data: parentGeoJson
                // })
                //
                // this.map.addLayer({
                //     id: 'test',
                //     source: 'test',
                //     type: 'fill',
                //     paint: {
                //         'fill-opacity': 0.2,
                //         'fill-color': 'blue'
                //     }
                // })
                //
                //
                //
                //
                //
                // const test = h3.geoToH3(this.coords.lat, this.coords.lng, 6)
                // // console.log(parentIndex)
                // const testg = geojson2h3.h3ToFeature(test)
                // this.map.addSource('t', {
                //     type: 'geojson',
                //     data: testg
                // })
                //
                // this.map.addLayer({
                //     id: 't',
                //     source: 't',
                //     type: 'fill',
                //     paint: {
                //         'fill-opacity': 0.4,
                //         'fill-color': 'red'
                //     }
                // })
                //
                //
                //
                //
                // const children = h3.h3ToChildren(parentIndex, 5)
                // // console.log(children)
                // const childrenGeoJson = geojson2h3.h3SetToFeatureCollection(children)
                //
                // this.map.addSource('children', {
                //     type: 'geojson',
                //     data: childrenGeoJson
                // })
                //
                // this.map.addLayer({
                //     id: 'children',
                //     source: 'children',
                //     type: 'fill',
                //     paint: {
                //         'fill-opacity': 0.4,
                //         'fill-color': 'yellow'
                //     },
                //     layout: {
                //         visibility: 'none'
                //     }
                // })
                //
                // // const c = children.map(x => h3.h3ToChildren(x, 6))
                //
                // const c: string[] = []
                // children.forEach(child => {
                //     c.push(...h3.h3ToChildren(child, 6))
                // })
                //
                // const cGeoJson = geojson2h3.h3SetToFeatureCollection(c)
                //
                // this.map.addSource('children2', {
                //     type: 'geojson',
                //     data: cGeoJson
                // })
                //
                // this.map.addLayer({
                //     id: 'children2',
                //     source: 'children2',
                //     type: 'fill',
                //     paint: {
                //         'fill-opacity': 0.4,
                //         'fill-color': 'green'
                //     }
                // })
                //
                //
                // //
                // const config = ({
                //     lng: -102.4,
                //     lat: 37.7923539,
                //     zoom: 11.5,
                //     fillOpacity: 0.6,
                //     colorScale: ['#ffffcc', '#78c679', '#006837']
                // })
                //
                // // object formatted as {'h3codehere': dataval, 'h3codehere2': dataval, ...}
                // const hexCodes: HexObject = this.hexagons(config)
                // console.log(hexCodes)
                //
                // const geojson = geojson2h3.h3SetToFeatureCollection(Object.keys(hexCodes), hex => ({value: hexCodes[hex]}))
                // console.log(geojson)
                //
                // // this.map.addSource('h3', {
                // //     type: 'geojson',
                // //     data: geojson
                // // })
                // //
                // // this.map.addLayer({
                // //     id: 'h3',
                // //     source: 'h3',
                // //     type: 'fill',
                // //     maxzoom: 4,
                // //     paint: {
                // //         'fill-color': 'deeppink',
                // //         'fill-opacity': 0.4
                // //     }
                // // })
                //
                // const options: HexConfigOptions = {lat: 37.79, lng: -102.4, res: 3, rings: 10}
                // const geo = this.hexGeoJson(options)
                // this.addHexLayer('h3_1', geo, 'green', 4)
                //
                // const options2: HexConfigOptions = {lat: 37.79, lng: -102.4, res: 4, rings: 30}
                // const geo2 = this.hexGeoJson(options2)
                // this.addHexLayer('h3_2', geo2, 'green', 6, 4)
                //
                // const options3: HexConfigOptions = {lat: 37.79, lng: -102.4, res: 5, rings: 50}
                // const geo3 = this.hexGeoJson(options3)
                // this.addHexLayer('h3_3', geo3, 'green', 8, 6)


            })
        },
        methods: {
            hexagons(config: any) {
                // the h3 code of a specific coordinate in SF
                const centerHex = h3.geoToH3(config.lat, config.lng, 3);
                // array of codes of ring of hexes 2 layers deep
                const kRing = h3.kRing(centerHex, 15);
                // Reduce hexagon list to a map with random values
                return kRing.reduce((res, hexagon) => ({...res, [hexagon]: Math.random()}), {});
            },
            hexagonRing(options: HexConfigOptions): string[] {
                const centerHex = h3.geoToH3(options.lat, options.lng, options.res);
                return h3.kRing(centerHex, options.rings);
            },
            hexGeoJson(options: HexConfigOptions): GeoJSON.FeatureCollection {
                const ring = this.hexagonRing(options)
                // kRing.reduce((res, hexagon) => ({...res, [hexagon]: Math.random()}), {});
                // return geojson2h3.h3SetToFeatureCollection(Object.keys(ring), hex => ({value: hexCodes[hex]}))
                return geojson2h3.h3SetToFeatureCollection(ring)
            },
            // id: string, geojson: GeoJSON.FeatureCollection, color: string, maxzoom: number, minzoom?: number
            addHexLayer(options: HexLayerOptions): void {
                this.map.addSource(options.id, {
                    type: 'geojson',
                    data: options.geojson,
                    generateId: true,
                })

                this.map.addLayer({
                    id: options.id,
                    source: options.id,
                    type: 'fill',
                    ...(options.minzoom && { minzoom: options.minzoom }) as any,
                    ...(options.maxzoom && { maxzoom: options.maxzoom }) as any,
                    paint: {
                        // 'fill-color': options.color || 'black',
                        'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'yellow', options.color || 'black'],
                        'fill-opacity': 0.4
                    }
                })
            },
            getChildrenHexIndices(parentHexArray: string[], res: number): string[] {
                const children: string[] = []
                parentHexArray.forEach(parent => {
                    children.push(...h3.h3ToChildren(parent, res))
                })
                return children
            },
            getParents(children, res) {
                const parents: string[] = []
                children.forEach(child => {
                    parents.push(h3.h3ToParent(child, res))
                })
                return Array.from(new Set(parents))
            }
        }

    })
</script>

<style lang="scss" scoped>
    #map {
        width: 800px;
        height: 800px;
        background: mediumvioletred;
    }
</style>
