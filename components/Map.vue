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
                center: this.centerCoords,
                zoom: 4 // starting zoom
            })

            this.map.on('load', () => {

                const hexFromBbox = h3.polyfill(this.bboxRev, 5)
                const bbox4 = geojson2h3.h3SetToFeatureCollection(hexFromBbox)

                this.addHexLayer({geojson: bbox4, id: 'res4', maxzoom: 6, color: 'purple'})

                const childrenRes5 = this.getChildrenHexIndices(hexFromBbox, 6)
                const childrenRes5GeoJson = geojson2h3.h3SetToFeatureCollection(childrenRes5)
                this.addHexLayer({geojson: childrenRes5GeoJson, id: 'res5', minzoom: 6, maxzoom: 7, color: 'mediumvioletred'})

                const childrenRes6 = this.getChildrenHexIndices(childrenRes5, 7)
                const childrenRes6GeoJson = geojson2h3.h3SetToFeatureCollection(childrenRes6)
                this.addHexLayer({geojson: childrenRes6GeoJson, id: 'res6', minzoom: 7, maxzoom: 8, color: 'deeppink'})

                // const childrenRes7 = this.getChildrenHexIndices(childrenRes5, 8)
                // const childrenRes7GeoJson = geojson2h3.h3SetToFeatureCollection(childrenRes7)
                // this.addHexLayer({geojson: childrenRes7GeoJson, id: 'res7', minzoom: 8, maxzoom: 11, color: 'mediumorchid'})






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
            hexGeoJson(options: HexConfigOptions): GeoJSON.FeatureCollection {
                const centerHex = h3.geoToH3(options.lat, options.lng, options.res);
                const ring = h3.kRing(centerHex, options.rings);
                // kRing.reduce((res, hexagon) => ({...res, [hexagon]: Math.random()}), {});
                // return geojson2h3.h3SetToFeatureCollection(Object.keys(ring), hex => ({value: hexCodes[hex]}))
                return geojson2h3.h3SetToFeatureCollection(ring)
            },
            // id: string, geojson: GeoJSON.FeatureCollection, color: string, maxzoom: number, minzoom?: number
            addHexLayer(options: HexLayerOptions): void {
                this.map.addSource(options.id, {
                    type: 'geojson',
                    data: options.geojson
                })

                this.map.addLayer({
                    id: options.id,
                    source: options.id,
                    type: 'fill',
                    ...(options.minzoom && { minzoom: options.minzoom }) as any,
                    ...(options.maxzoom && { maxzoom: options.maxzoom }) as any,
                    paint: {
                        'fill-color': options.color || 'black',
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
