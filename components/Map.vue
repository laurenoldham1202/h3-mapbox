<template>
    <div id="map"></div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import * as M from 'mapbox-gl'
    import geojson2h3 from 'geojson2h3';
    import * as h3 from "h3-js";
    import GeoJSON from 'GeoJSON'

    export interface HexObject {
        [key: string]: number
    }

    interface HexConfigOptions {
        lat: number,
        lng: number,
        res: number,
        rings: number,
    }

    export default Vue.extend({
        data: () => ({
            map: undefined as any
        }),
        mounted(): void {
            (M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
            this.map = new M.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [-102.4, 37.7923], // starting position [lng, lat]
                zoom: 3 // starting zoom
            })

            this.map.on('load', () => {



                const amerob = ['87d318d15ffffff',
                    '87d318d1dffffff',
                    '87d318d33ffffff',
                    '87d318c21ffffff',
                    '87d318d1dffffff',
                    '87d31eb49ffffff',
                    '87d31eb6affffff',
                    '87b0818d4ffffff',
                    '87d318c2bffffff',
                    '87d318c25ffffff',
                    '87d31c69effffff',
                    '87d31c6b2ffffff',
                    '87d31eb68ffffff',
                    '87d31c4caffffff',
                    '87b0d2088ffffff',
                    '87b0d2c01ffffff',
                    '8792da590ffffff',
                    '8792da4b4ffffff',
                    '87d318c29ffffff',
                    '87d318d56ffffff',
                    '87d31eb6cffffff',
                    '87d31c4c8ffffff',
                    '87b0d20d4ffffff',
                    '87b0d2c5effffff',
                    '87b0d2d34ffffff',
                    '87b0d64d9ffffff',
                    '87d318d5affffff',
                    '87d318d56ffffff',
                    '87d318d24ffffff',
                    '87d31c682ffffff',
                    '87d31c6b0ffffff',
                    '87d31c793ffffff',
                    '87d31c4c8ffffff',
                    '87d31c4e3ffffff',
                    '87d318c71ffffff',
                    '87d318d5effffff',
                    '87d318d54ffffff',
                    '87d31c680ffffff',
                    '87d31c6b5ffffff',
                    '87d31c791ffffff',
                    '87d31c4cdffffff',
                    '87d31c4e1ffffff',
                    '87d31c41dffffff',
                    '8792d3614ffffff',
                    '87b0d21abffffff',
                    '87b0d2d2effffff',
                    '87b0d669dffffff',
                    '87b081243ffffff',
                    '87d318d5cffffff',
                    '87d318d72ffffff']


                const config = ({
                    lng: -102.4,
                    lat: 37.7923539,
                    zoom: 11.5,
                    fillOpacity: 0.6,
                    colorScale: ['#ffffcc', '#78c679', '#006837']
                })

                // object formatted as {'h3codehere': dataval, 'h3codehere2': dataval, ...}
                const hexCodes: HexObject = this.hexagons(config)
                console.log(hexCodes)

                const geojson = geojson2h3.h3SetToFeatureCollection(Object.keys(hexCodes), hex => ({value: hexCodes[hex]}))
                console.log(geojson)

                // this.map.addSource('h3', {
                //     type: 'geojson',
                //     data: geojson
                // })
                //
                // this.map.addLayer({
                //     id: 'h3',
                //     source: 'h3',
                //     type: 'fill',
                //     maxzoom: 4,
                //     paint: {
                //         'fill-color': 'deeppink',
                //         'fill-opacity': 0.4
                //     }
                // })

                const options: HexConfigOptions = {lat: 37.79, lng: -102.4, res: 3, rings: 10}
                const geo = this.hexGeoJson(options)
                this.addHexLayer('h3_1', geo, 'green', 4)

                const options2: HexConfigOptions = {lat: 37.79, lng: -102.4, res: 4, rings: 30}
                const geo2 = this.hexGeoJson(options2)
                this.addHexLayer('h3_2', geo2, 'green', 6, 4)

                const options3: HexConfigOptions = {lat: 37.79, lng: -102.4, res: 5, rings: 50}
                const geo3 = this.hexGeoJson(options3)
                this.addHexLayer('h3_3', geo3, 'green', 8, 6)


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
            addHexLayer(id: string, geojson: GeoJSON.FeatureCollection, color: string, maxzoom: number, minzoom?: number) {
                this.map.addSource(id, {
                    type: 'geojson',
                    data: geojson
                })

                this.map.addLayer({
                    id,
                    source: id,
                    type: 'fill',
                    ...(minzoom && { minzoom }) as any,
                    maxzoom,
                    paint: {
                        'fill-color': color,
                        'fill-opacity': 0.4
                    }
                })
            }
        }

    })
</script>

<style lang="scss" scoped>
    #map {
        width: 1000px;
        height: 1000px;
        background: mediumvioletred;
    }
</style>
