<template>
  <span>

    <!-- TODO Add button to reset hexes, add button to 'smooth' range -->
<button @click="selectMode = !selectMode">Selection mode: {{ selectMode }}</button>
<!--<button @click="rangeOnly = !rangeOnly">show new range only: {{ rangeOnly }}</button>-->

<div id="map-2"></div>

  </span>
</template>

<script lang="ts">
  import Vue from 'vue'
  import * as M from 'mapbox-gl'
  import geojson2h3 from 'geojson2h3'
  import * as h3 from 'h3-js'
  import 'mapbox-gl/dist/mapbox-gl.css'

  import {selected} from '~/static/constants'

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
      selectMode: false,
      rangeOnly: false,
      resolution: 3,
      draw: undefined as any,
      filtered: [] as any[],
      children: [] as any[],
      selected: selected as any[],
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
        zoom: 6,
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
          // tiles: ['http://localhost:8083/data/all_clipped/{z}/{x}/{y}.pbf'],
          tiles: ['https://test.cdn.shorebirdviz.ebird.org/range-map/test-2/{z}/{x}/{y}.pbf'],
          maxzoom: 8, // TODO Fix hex distortion? higher tile max?
        })

        // TODO Get children of any hexes < 3 in tiles
        // TODO Return single feature outline?
        this.map.addLayer({
          id: 'base-hex',
          source: 'base-hex',
          'source-layer': 'hex',
          type: 'fill',
          // filter: ['match', ['get', 'h3_address'], range2, false, true],
          paint: {
            // 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], 'deeppink', 'black'],
            'fill-color': ['case', ['boolean', ['feature-state', 'selected'], ['get', 'isRange']], 'deeppink', 'black'],
            'fill-opacity': 0.3,
            // 'fill-opacity': 1,
            // 'fill-outline-color': 'black',
            // 'fill-color': 'yellow'
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
            // 'fill-color': 'yellow',
            // 'fill-outline-color': 'green',
          },
          layout: {
            'fill-sort-key': ['+', ['get', 'h3_address']],
          },
        })

        this.map.on('zoom', () => {
          // console.log(this.map.getZoom())
        })
        // TODO NEED TO REWRITE RIGHT CLICK TO ACCOUNT FOR BASE-HEX NO LONGER BEING JUST 3 RES

        const layers = ['children', 'base-hex']
        // RIGHT CLICK - collapse features
        this.map.on('contextmenu', (e: any) => {
          // TODO HAndle edges where you can explode/collapse children and it interferes with handling range features directly
          // selected feature - limited only to children layer (i.e. can't go past initial 3 res view)
          const feature = this.map.queryRenderedFeatures(e.point, {layers: layers})[0]
          if (feature) {
            // console.log(feature)
            // // TODO Replace all w h3GetResolution
            // // desired resolution, one level up from selected res
            const res = parseInt(feature.id[1]) - 1

            if (res >= 3) {
              console.log(res)
              //
              // // if (res > 2) {
              //
              //
              // parent of clicked feature
              const parent = h3.h3ToParent(feature.id, res)
              //
                // if the selected parent feature is currently filtered out of map, remove it from the filtered list so it will display
                if (this.arrayIncludesItem(this.filtered, parent)) {
                  this.removeItemFromArray(this.filtered, parent)
                } else {
                  this.children.push(parent)
                }
              //   // if clicking on res 4, use base-hex layer instead of children layer
              //   const layer = res <= 3 ? 'base-hex' : feature.source
              // console.log(layer)
              //   // update proper map layer with unfiltered parents
              //   // this.filterOutParentHexes(layer)
              //   this.filterOutParentHexes('base-hex')
              //   this.filterOutParentHexes('children')
              //

              layers.forEach(layer => {
                // match parent selected state to clicked hex selected state, push to array if selected
                this.map.setFeatureState({
                  source: layer,
                  ...(layer === 'base-hex' && { sourceLayer: 'hex' }),
                  // source: 'children',
                  id: parent
                }, { selected: this.arrayIncludesItem(this.selected, feature.id) })

              })

                // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
                // match parent selected state to clicked hex selected state, push to array if selected
                // this.map.setFeatureState({
                //   source: layer,
                //   ...(layer === 'base-hex' && { sourceLayer: 'hex' }),
                //   // source: 'children',
                //   id: parent
                // }, { selected: this.arrayIncludesItem(this.selected, feature.id) })


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

              // console.log(parent, allChildren)

              // TODO TEST WHEN COLLAPSING OVERLAPS CHILDREN HEXES
              // TODO Test re-exploding a  collapsed hex
              // if (feature.source === 'base-hex') {
              //   // console.log('filter from base-hex ', allChildren)
              //   // console.log('add to children', parent)
              //
              //   this.filtered.push(...allChildren)
              //   this.filterOutParentHexes('base-hex')
              //
              //   this.children.push(parent)
              //   this.setChildFeatures()
              // } else {
              //   console.log('handle collapsing children!')
              //   console.log('', allChildren)
                console.log('', parent)

                this.filtered.push(...allChildren)
                this.filtered = this.uniqueValues(this.filtered)
                this.filterOutParentHexes('base-hex')
                this.filterOutParentHexes('children')

              // console.log(this.filtered)

                // this.children.push(parent)
                // this.children = this.uniqueValues(this.children)
                this.setChildFeatures()
              // }

              console.log(this.children)

              allChildren.forEach((child: string) => {
                    // if a child hex is selected (pink), turn off its selected map state and remove from selected array
                    if (this.selected.includes(child)) {
                      this.removeItemFromArray(this.selected, child)
                      this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
                    }
              })
              //
              //   allChildren.forEach((child: string) => {
              //     // if a child hex is already plotted on the map, remove it from the array
              //     if (this.children.includes(child)) {
              //       this.removeItemFromArray(this.children, child)
              //     }
              //
              //     // if a child hex is selected (pink), turn off its selected map state and remove from selected array
              //     if (this.selected.includes(child)) {
              //       this.removeItemFromArray(this.selected, child)
              //       this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
              //     }
              //   })
              //
              //   // update map with removed children hexes
              //   this.setChildFeatures()
              // }
            } else {
              // console.log(res, feature)
            }
          }

        })


        // LEFT CLICK - select, deselect, or extrapolate features
        this.map.on('click', ['base-hex', 'children'], (e: any) => {

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

            // FIXME Sel mode false, click range erroneously deselects features

            // TODO Make sure selected array includes all initially selected features? Or have separate deselected array?
            // boolean feature property for range - set during tile generation
            const isRange =  feature.properties.isRange
            // if feature is part of the default range on initial map load before feature state is set
            const defaultRange = !Object.keys(feature.state).length && isRange

            // update map feature state
            this.map.setFeatureState(
              {source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: feature.id},
              {selected: defaultRange ? !isRange : !feature.state.selected}
            )

            this.updateSelected(feature)
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
        console.log(childrenPoly)
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
