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
  import 'mapbox-gl/dist/mapbox-gl.css'

  import * as T from '@turf/turf'


  // import { GeoJSON } from 'GeoJSON'
  // import MapboxDraw from '@mapbox/mapbox-gl-draw'
  // import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
  // import FreehandMode from 'mapbox-gl-draw-freehand-mode'
  import intersect from '@turf/intersect'
  import bbox from '@turf/bbox'
  import area from '@turf/area'
  // @ts-ignore
  // import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'


  export default Vue.extend({
    data: () => ({
      map: undefined as any,
      coords: { lng: -96.35, lat: 37 } as M.LngLat,
      selectMode: true,
      rangeOnly: false,
      resolution: 3,
      draw: undefined as any,
      filtered: [] as any[],
      children: [] as any[],
      selected: [] as any[],
    }),
    watch: {
      rangeOnly() {


        // console.log('RANGE MODE')
        // console.log('filtered:', this.filtered)
        // console.log('children:', this.children)
      },
      selected(x) {
        // console.log('selected:', x)
      }
    },
    mounted(): void {
      ;(M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
      this.map = new M.Map({
        container: 'map-2',
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: this.coords,
        zoom: 2,
        doubleClickZoom: false,
      })

      // this.draw = new MapboxDraw({
      //   displayControlsDefault: false,
      //   // defaultMode: 'draw_polygon',
      //   controls: {
      //     polygon: true,
      //     trash: true,
      //   },
      //   // @ts-ignore
      //   modes: Object.assign(MapboxDraw.modes, {
      //     // draw_polygon: FreehandMode,
      //     draw_polygon: DrawRectangle,
      //   }),
      // })
      // this.map.addControl(this.draw, 'top-left')
      this.map.addControl(new M.ScaleControl({maxWidth: 900}))

      this.map.on('load', () => {
        this.map.addSource('base-hex', {
          type: 'vector',
          promoteId: 'h3_address',
          tiles: ['http://localhost:8081/data/r3/{z}/{x}/{y}.pbf'],
          maxzoom: 4,
        })

        const rangeLine = {"id":"8eb25ba70d452d97e1ddfcce5dd3c509","type":"Feature","properties":{},"geometry":{"coordinates":[[[-99.33506625318147,45.13314712628562],[-101.00487955708923,45.13314712628562],[-101.56148399172514,42.683079866666105],[-102.36546817508791,41.62863803346093],[-103.66421185590485,40.9782147291387],[-103.91159160463224,39.65795874143228],[-103.23129729563291,39.1322398894163],[-101.49963905454342,38.84381654664111],[-100.57196499681673,38.3119933246779],[-97.17049345181951,37.971513567475],[-97.04680357745609,36.84165053422949],[-96.6757339543653,36.49440699140514],[-94.6348510273673,36.792140282626605],[-93.58348709527718,38.36050350728348],[-95.68621495945743,38.55421925672027],[-95.50068014791177,39.61032990250396],[-96.98495864027439,40.791188855481806],[-96.73757889154703,41.44346493969201],[-96.18097445691163,41.90540315049239],[-96.49019914282017,43.000506465552206],[-96.79942382872926,43.3612818895958],[-98.28370232109134,43.496022931319146],[-98.84030675572728,44.29816727163572],[-98.77846181854555,45.00210923171318],[-99.08768650445464,45.08950120560945],[-99.33506625318147,45.13314712628562],[-99.33506625318147,45.13314712628562]]],"type":"Polygon"}}

        const range = ['832633fffffffff', '832652fffffffff', '8326f6fffffffff', '8326e2fffffffff',
          '832602fffffffff', '8326e4fffffffff', '832618fffffffff', '8326a8fffffffff',
          '8326e6fffffffff', '83261afffffffff', '832611fffffffff', '83261cfffffffff',
          '832613fffffffff', '8326f5fffffffff', '83261efffffffff', '8326e1fffffffff',
          '8326ecfffffffff', '832615fffffffff', '8326eefffffffff', '832603fffffffff',
          '8326e5fffffffff', '83260efffffffff', '832619fffffffff', '8326a9fffffffff',
          '83261bfffffffff', '8326abfffffffff', '8326f4fffffffff', '83261dfffffffff',
          '8326e0fffffffff', '8326adfffffffff']


        // const all = this.getChildrenHexes(range, 6)
        // console.log(all)
        // const compact = h3.compact(all)
        // console.log(compact)

        this.map.addLayer({
          id: 'base-hex',
          source: 'base-hex',
          'source-layer': 'hex',
          type: 'fill',
          paint: {
            'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'black'],
            // 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], ['match', ['get', 'h3_address'], range, true, false]], 'deeppink', 'black'],
            'fill-opacity': 0.3,
          },
        })


        // TODO TRY COMPACT IN CODE AROUND FULL SHAPE
        // TODO try different resolutions for all hexes?

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

        // this.map.addSource('species-range', {
        //   type: 'geojson',
        //   data: rangeLine
        //
        // })
        // this.map.addLayer({
        //   id: 'species-range',
        //   source: 'species-range',
        //   type: 'line',
        //   paint: {
        //     'line-color': 'deeppink',
        //     'line-dasharray': [4, 2],
        //     'line-width': 2,
        //   }
        // })


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
            'fill-outline-color': ['case', ['boolean', ['feature-state', 'selected'], true], 'deeppink', 'black'],
          },
        })


        // const y = []
        //
        // const line = T.polygonToLine(T.polygon(rangeLine.geometry.coordinates))
        //
        // const ex = T.explode(line)
        // // console.log(ex)
        // // console.log(line)
        // const points = []
        // const border = []
        // setTimeout(() => {
        //   // TODO Intersect these
        //   const f = this.map.queryRenderedFeatures(this.bboxToPixel(rangeLine.geometry), { layers: ['base-hex'] })
        //   // console.log(f)
        //   f.forEach(x => {
        //     // const e = T.explode(x.geometry.coordinates)
        //     // console.log(e)
        //
        //
        //     const p = T.lineIntersect(x, T.polygon(rangeLine.geometry.coordinates))
        //     if (p.features.length) {
        //
        //       const mid = T.midpoint(p.features[0].geometry.coordinates, p.features[1].geometry.coordinates)
        //       // console.log(mid)
        //       const coords = mid.geometry.coordinates
        //         const hex = h3.geoToH3(coords[1], coords[0], 3)
        //         // console.log(hex)
        //         // border.push(hex)
        //
        //
        //       // p.features.forEach(r => {
        //       //   const coords = r.geometry.coordinates
        //       //   const hex = h3.geoToH3(coords[1], coords[0], 3)
        //       //   // console.log(hex)
        //       //   border.push(hex)
        //       // })
        //       // console.log(p)
        //
        //
        //       // points.push(...p.features)
        //     }
        //
        //     // const poly = T.polygon(x.geometry.coordinates)
        //     // poly.properties = x.properties
        //     // console.log(poly)
        //
        //     const int = T.intersect(x, T.polygon(rangeLine.geometry.coordinates), {properties: x.properties})
        //     // console.log(int)
        //     if (int) {
        //       y.push(int)
        //     }
        //   })
        //
        //   // console.log(this.uniqueValues(border))
        //   this.uniqueValues(border).forEach((hex) => {
        //     // console.log(hex)
        //
        //     this.map.setFeatureState({source: 'base-hex', sourceLayer: 'hex', id: hex}, {selected: true})
        //   })
        //   // console.log(points)
        //
        //   this.map.addSource('pts', {
        //     type: 'geojson',
        //     // data: ex
        //     data: {
        //       type: 'FeatureCollection',
        //       features: points
        //     }
        //   })
        //
        //   this.map.addLayer({
        //     id: 'pts',
        //     source: 'pts',
        //     type: 'circle'
        //   })
        //   // const hexes = f.map(x => x.id)
        //   // console.log(hexes)
        //   // const compact = h3.compact(hexes)
        //   // console.log(compact)
        //   // const hexes = y.map(x => x.properties.h3_address)
        //   const hexes = ["8326e3fffffffff", "832650fffffffff", "832631fffffffff", "832653fffffffff",
        //     "832601fffffffff", "8326a8fffffffff", "8326ecfffffffff", "8326abfffffffff",
        //     "83260afffffffff", "832610fffffffff", "8326c5fffffffff", "832632fffffffff",
        //     "832602fffffffff", "832613fffffffff", "8326acfffffffff", "83268dfffffffff",
        //     "8326f0fffffffff", "83260bfffffffff", "8326e2fffffffff", "83260efffffffff",
        //     "8326e5fffffffff", "8326f6fffffffff", "832652fffffffff", "832600fffffffff",
        //     "832633fffffffff", "832614fffffffff", "8326aafffffffff", "832606fffffffff",
        //     "8326eefffffffff", "8326e0fffffffff", "8326f1fffffffff"]
        //
        //   hexes.forEach((hex) => {
        //     // console.log(hex)
        //
        //     this.map.setFeatureState({source: 'base-hex', sourceLayer: 'hex', id: hex}, {selected: true})
        //   })
        // }, 100)


        // RIGHT CLICK - collapse features
        this.map.on('contextmenu', (e: any) => {
          // selected feature - limited only to children layer (i.e. can't go past initial 3 res view)
          const feature = this.map.queryRenderedFeatures(e.point, {layers: ['children']})[0]
          if (feature) {
            // TODO Replace all w h3GetResolution
            // desired resolution, one level up from selected res
            const res = parseInt(feature.id[1]) - 1
            // parent of clicked feature
            const parent = h3.h3ToParent(feature.id, res)

            // if the selected parent feature is currently filtered out of map, remove it from the filtered list so it will display
            if (this.arrayIncludesItem(this.filtered, parent)) {
              this.removeItemFromArray(this.filtered, parent)
            }
            // if clicking on res 4, use base-hex layer instead of children layer
            const layer = res === 3 ? 'base-hex' : feature.source
            // update proper map layer with unfiltered parents
            this.filterOutParentHexes(layer)

            // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
            // match parent selected state to clicked hex selected state, push to array if selected
            this.map.setFeatureState({
              source: layer,
              ...(layer === 'base-hex' && { sourceLayer: 'hex' }),
              id: parent}, { selected: this.arrayIncludesItem(this.selected, feature.id)})
            if (this.arrayIncludesItem(this.selected, feature.id)) {
              this.selected.push(parent)
            }

            // empty array for all children through res 6 for the selected parent hex
            const allChildren: any[] = []
            // all possible resolutions on the map
            const resolutions = [3, 4, 5, 6]
            resolutions.forEach((resolution: number) => {
              if (resolution >= (res + 1)) {
                // for each res, find children and push to array
                allChildren.push(...h3.h3ToChildren(parent, resolution))
              }
            })

            allChildren.forEach((child: string) => {
              // if a child hex is already plotted on the map, remove it from the array
              if (this.children.includes(child)) {
                this.removeItemFromArray(this.children, child)
              }

              // if a child hex is selected (pink), turn off its selected map state and remove from selected array
              if (this.selected.includes(child)) {
                this.removeItemFromArray(this.selected, child)
                this.map.setFeatureState({source: 'children', id: child}, {selected: false})
              }
            })

            // update map with removed children hexes
            this.setChildFeatures()
          }

        })


        // LEFT CLICK - select, deselect, or extrapolate features
        this.map.on('click', ['base-hex', 'children', 'species-range'], (e: any) => {
          // all layers for a clicked point
          const clickedLayers = e.features.map((feats: any) => feats.layer.id)

          // if user clicked within the species range...
          if (clickedLayers.includes('species-range')) {
            // console.log(e)
            // console.log('original range clicked')

            // TODO keep outline? Push to deselected arr?
            const feature = e.features.filter((features: any) => features.layer.id === 'species-range')[0]

            if (!this.selectMode) {
              console.log('explode', feature.id)
            } else {
              // console.log(feat, feat.state.selected)
              if (feature.state.selected === undefined) {
                this.map.setFeatureState({source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id}, {selected: false})
              } else {
                // console.log(feat, feat.state.selected)
                this.map.setFeatureState({source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id}, {selected: !feature.state.selected})
              }
            }



          } else {  // if user clicked outside of the species range, i.e. a base-hex or child
            const feature = e.features[0]
            const res = parseInt(feature.id[1]) + 1
            const layer = res === 4 ? 'base-hex' : feature.source

            // if select mode is off, i.e. if user is expanding or collapsing shapes
            if (!this.selectMode) {
              // TODO Combine res restriction and selectMode conditions?
              // only allow user to drill down to h3 res 6
              if (res <= 6) {
                // find children of clicked feature, push to array for app-wide usage
                const children = h3.h3ToChildren(feature.id, res)
                this.children.push(...children)

                // TODO Make sure that resetting all child features scales with thousands of children
                // set child geojson features in layer
                this.setChildFeatures()

                // filter out the clicked feature so that parent and children are not layered on top of each other
                this.filtered.push(feature.id)

                // is parent hex selected on the map
                // const parentSelected = this.map.getFeatureState({source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: feature.id}).selected
                const parentSelected = this.arrayIncludesItem(this.selected, feature.id)

                // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
                children.forEach((child: string) => {
                  // if parent hex is selected on the map, set ALL child features as selected too, push to array
                  if (parentSelected) {
                    this.map.setFeatureState({source: 'children', id: child}, {selected: true})
                    this.selected.push(child)
                  }

                  if (this.filtered.includes(child)) {
                    this.removeItemFromArray(this.filtered, child)
                  }
                })

                // if parent is selected when children are exploded, remove the selected map state for the parent and remove from array
                // happens outside of children loop to not duplicate unnecessarily
                if (parentSelected) {
                  this.map.setFeatureState({source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: feature.id}, {selected: false})
                  this.removeItemFromArray(this.selected, feature.id)
                }

                // update all layers' filters
                const layers = ['base-hex', 'children']
                layers.forEach(layer => {
                  this.filterOutParentHexes(layer)
                })


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

              // console.log(feature)
              this.map.setFeatureState({source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: feature.id}, {selected: !feature.state.selected})
              this.updateSelected(feature)


              // console.log(this.selected)
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
      },
      updateSelected(feature: any) {
        if (!feature.state.selected) {
          this.selected.push(feature.id)
        } else {
          this.removeItemFromArray(this.selected, feature.id)
        }
      },
      getChildrenHexes(parentHexArray: string[], res: number): string[] {
        const children: string[] = []
        parentHexArray.forEach((parent) => {
          children.push(...h3.h3ToChildren(parent, res))
        })
        return children
      },
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

    },
  })
</script>

<style>
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

  button {
    cursor: pointer;
  }
</style>
