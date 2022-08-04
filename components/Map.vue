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

  import {SELECTED} from '~/static/constants'

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
      selected: SELECTED as any[],
      filteredBase: [] as any[],
      filteredChildren: [] as any[],
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
          maxzoom: 8,
        })

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
            // 'fill-color': 'blue'
          },
          layout: {
            'fill-sort-key': ['+', ['get', 'h3_address']],
          },
        })


        const allLayers = ['base-hex', 'children']

        // RIGHT CLICK - collapse features
        this.map.on('contextmenu', (e: any) => {

          const feature = this.map.queryRenderedFeatures(e.point, {layers: allLayers})[0]
          const source = feature.source
          if (feature) {
            // console.log(feature.id)
            const clickedRes = h3.h3GetResolution(feature.id)
            // console.log(clickedRes)

            if (clickedRes >= 4) {
              // parent of clicked feature
              const parent = h3.h3ToParent(feature.id, clickedRes - 1)
              // console.log(parent)

              // console.log(this.children.includes(parent), parent)
              // add parent to children layer to keep totally separate from filtered based-hex values
              this.children.push(parent)
              // this.setChildFeatures()

              // IF COLLAPSING CHILD -
              // get parent
              // add parent to children
              // get ALL children of parent
              // remove children of parent from children arr
              //
              // IF COLLAPSING PARENT -
              // get parent
              // add parent to children
              // get ALL children of parent
              // remove children of parent from children arr
              // filter all children from base-hex


                // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
                // match parent selected state to clicked hex selected state, push to array if selected
                this.map.setFeatureState({
                  source: 'children',
                  id: parent}, { selected: this.arrayIncludesItem(this.selected, feature.id)})
                if (this.arrayIncludesItem(this.selected, feature.id)) {
                  this.selected.push(parent)
                }



              // empty array for all children through res 6 for the selected parent hex
              const allChildren: any[] = []
              // all possible resolutions on the map
              const resolutions = [3, 4, 5, 6]
              resolutions.forEach((resolution: number) => {
                if (resolution >= clickedRes) {
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
              // this.setChildFeatures()


              if (source === 'base-hex') {
                // console.log('BASE:', this.filteredChildren)
                // console.log('filter all children from base-hex layer AND children from children layer?')
                this.filteredBase.push(...allChildren)
                // TODO STreamline the array within the func, tied to which layer is passed in
                this.filterOutParentHexes('base-hex', this.filteredBase)

              } else {

                // console.log('CHILDREN BEFORE:', this.filteredChildren)


                // FIXME base hex res 3, drill down to res 6 in middle, then collapse back up until hex disappears
                // FIXME res 3 drill, drill - base hex 6 collapse, collapse neighbor, collapse first collapse, then click first drilled child

                // console.log('filtered children BEFORE:', this.filteredChildren)
                // console.log('filtered base:', this.filteredBase)
                // console.log('children BEFORE:', this.children)

                this.filteredChildren.forEach(child => {
                  if (this.children.includes(child)) {
                    // console.log('PROBLEM CHILD!!!!!!!!!', child)
                    // this.removeItemFromArray(this.children, child)
                    // this.children.push(child)
                  }
                })

                // FIXME collapse 5, explode same, explode neighbor 6

                this.removeItemFromArray(this.filteredChildren, parent)
                this.filterOutParentHexes('children', this.filteredChildren)

                this.filteredBase.push(...allChildren)
                // TODO STreamline the array within the func, tied to which layer is passed in
                this.filterOutParentHexes('base-hex', this.filteredBase)


                // console.log('CHILDREN AFTER:', this.filteredChildren)



              }

              // console.log('handle children')
              // console.log('parent:', parent)
              // console.log(clickedRes)
              // console.log('filtered children:', this.filteredChildren)
              // console.log('COL filtered base:', this.filteredBase)
              // console.log('children:', this.children)

              // this.filterOutParentHexes('children', this.filteredChildren)
              this.setChildFeatures()


              // console.log(parent, this.filteredChildren)


            } else {
              console.log('CANNOT COLLAPSE FOR RES', clickedRes)
            }
          }



          // // TODO HAndle edges where you can explode/collapse children and it interferes with handling range features directly
          // // selected feature - limited only to children layer (i.e. can't go past initial 3 res view)
          // const feature = this.map.queryRenderedFeatures(e.point, {layers: ['children']})[0]
          // if (feature) {
          //   // TODO Replace all w h3GetResolution
          //   // desired resolution, one level up from selected res
          //   const res = parseInt(feature.id[1]) - 1
          //   // parent of clicked feature
          //   const parent = h3.h3ToParent(feature.id, res)
          //
          //   // if the selected parent feature is currently filtered out of map, remove it from the filtered list so it will display
          //   if (this.arrayIncludesItem(this.filtered, parent)) {
          //     this.removeItemFromArray(this.filtered, parent)
          //   }
          //   // if clicking on res 4, use base-hex layer instead of children layer
          //   const layer = res === 3 ? 'base-hex' : feature.source
          //   // update proper map layer with unfiltered parents
          //   this.filterOutParentHexes(layer)
          //
          //   // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
          //   // match parent selected state to clicked hex selected state, push to array if selected
          //   this.map.setFeatureState({
          //     source: layer,
          //     ...(layer === 'base-hex' && { sourceLayer: 'hex' }),
          //     id: parent}, { selected: this.arrayIncludesItem(this.selected, feature.id)})
          //   if (this.arrayIncludesItem(this.selected, feature.id)) {
          //     this.selected.push(parent)
          //   }
          //
          //   // empty array for all children through res 6 for the selected parent hex
          //   const allChildren: any[] = []
          //   // all possible resolutions on the map
          //   const resolutions = [3, 4, 5, 6]
          //   resolutions.forEach((resolution: number) => {
          //     if (resolution >= (res + 1)) {
          //       // for each res, find children and push to array
          //       allChildren.push(...h3.h3ToChildren(parent, resolution))
          //     }
          //   })
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
          //       this.map.setFeatureState({source: 'children', id: child}, {selected: false})
          //     }
          //   })
          //
          //   // update map with removed children hexes
          //   this.setChildFeatures()
          // }

        })


        // LEFT CLICK - select, deselect, or extrapolate features
        this.map.on('click', ['base-hex', 'children'], (e: any) => {

          const feature = e.features[0]
          const res = parseInt(feature.id[1]) + 1
          // const layer = res === 4 ? 'base-hex' : feature.source  // TODO CHECK THIS


          // if select mode is off, i.e. if user is expanding or collapsing shapes
          if (!this.selectMode) {
            // TODO Combine res restriction and selectMode conditions?
            // only allow user to drill down to h3 res 6
            if (res <= 6) {

              // console.log('BEFORE CLICK filtered base:', this.filteredBase)

              // find children of clicked feature, push to array for app-wide usage
              const children = h3.h3ToChildren(feature.id, res)
              this.children.push(...children)

              // TODO Make sure that resetting all child features scales with thousands of children
              // set child geojson features in layer
              this.setChildFeatures()

              // filter out the clicked feature so that parent and children are not layered on top of each other
              // this.filtered.push(feature.id)
              // console.log(feature.source)
              if (feature.source === 'base-hex') {
                this.filteredBase.push(feature.id)
              } else {
                this.filteredChildren.push(feature.id)
              }

              // is parent hex selected on the map
              // const parentSelected = this.map.getFeatureState({source: layer, ...(layer === 'base-hex' && { sourceLayer: 'hex' }), id: feature.id}).selected
              const parentSelected = this.arrayIncludesItem(this.selected, feature.id)
              // console.log(this.selected, parentSelected)

              // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
              children.forEach((child: string) => {
                // if parent hex is selected on the map, set ALL child features as selected too, push to array
                if (parentSelected) {
                  this.map.setFeatureState({source: 'children', id: child}, {selected: true})
                  this.selected.push(child)
                  // console.log(child, this.map.getFeatureState({source: 'children', id: child}))
                }

                // TODO TEST AFTER COLLAPSE
                // if (this.filtered.includes(child)) {
                //   this.removeItemFromArray(this.filtered, child)
                // }
                if (this.filteredChildren.includes(child)) {
                  this.removeItemFromArray(this.filteredChildren, child)
                }
                if (this.filteredBase.includes(child)) {
                  // this.removeItemFromArray(this.filteredBase, child)
                }
              })

              // if parent is selected when children are exploded, remove the selected map state for the parent and remove from array
              // happens outside of children loop to not duplicate unnecessarily
              if (parentSelected) {
                this.map.setFeatureState({source: 'children', id: feature.id}, {selected: false})
                this.removeItemFromArray(this.selected, feature.id)
              }

              // // update all layers' filters
              // const layers = ['base-hex', 'children']
              // layers.forEach(layer => {
              //   this.filterOutParentHexes(layer)
              // })

              if (feature.source === 'base-hex') {
                this.filterOutParentHexes('base-hex', this.filteredBase)
              } else {
                // console.log('updated filtered children...', this.filteredChildren)
                this.filterOutParentHexes('children', this.filteredChildren)
              }


              // if the clicked hex is in the children array, remove it from array when hex is filtered out
              if (this.arrayIncludesItem(this.children, feature.id)) {
                  this.removeItemFromArray(this.children, feature.id)
              }

              // console.log('handle children')
              // console.log('parent:', parent)
              // console.log('filtered children:', this.filteredChildren)
              // console.log('filtered base:', this.filteredBase)
              // console.log('children:', this.children)

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

            // console.log(isRange, defaultRange, feature.state.selected)

            // update map feature state
            this.map.setFeatureState(
              {source: feature.source, ...(feature.source === 'base-hex' && { sourceLayer: 'hex' }), id: feature.id},
              {selected: defaultRange ? !isRange : !feature.state.selected}
            )

            this.updateSelected(feature)

            console.log(this.selected, this.selected.includes(feature.id))
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
      filterOutParentHexes(featureSource: string, array: string[]) {
        array = this.uniqueValues(array)
        // console.log(array.length)
        // console.log(array.length ? ['match', ['get', 'h3_address'], array, false, true] : null)
        // if there are filtered features, filter listed ones out, otherwise remove filter to show all features
        this.map.setFilter(featureSource, array.length ? ['match', ['get', 'h3_address'], array, false, true] : null)
      },
      removeItemFromArray(array: any[], item: any) {
        array.splice(array.indexOf(item), 1)
      },
      arrayIncludesItem(array: any[], item: any) {
        return array.includes(item)
      },
      updateSelected(feature: any) {
        if (!this.selected.includes(feature.id)) {
          this.selected.push(feature.id)
          // console.log('pushed', feature.id)
        } else {
          this.removeItemFromArray(this.selected, feature.id)
          // console.log('removed', feature.id)

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
