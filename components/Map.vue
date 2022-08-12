<template>
  <div style="display: flex">


    <div id="map-2"></div>

    <div class="sidebar" style="padding: 0.5rem;">
      <!-- TODO Add button to reset hexes, add button to 'smooth' range -->
      <span style="line-height: 30px;">
        SELECT: <strong>CLICK</strong> a grey hex
        <br>
        DESELECT: <strong>CLICK</strong> a pink hex
        <br>
        REFINE: <strong>CLICK + SHIFT</strong>
        <br>
        COLLAPSE: <strong>RIGHT CLICK</strong>
        <br>
        LASSO SELECT: <strong>SHIFT + DRAG</strong>
        <br>
        LASSO DESELECT: <strong>CTRL + DRAG</strong>
      </span>

      <hr>

      <select v-model="species">
        <option v-for="option in options" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <br>

      <!-- TODO Add warning before switching seasons? Auto save or send? -->
      <select :value="season"  @input="onSeasonChange">
        <option v-for="option in seasonOptions" :value="option.value">
          {{ option.text }}
        </option>
      </select>

      <div style="width: 300px; border: 1px solid red; background: yellow; font-weight: 500; margin: 0.5rem 0; padding: 0.5rem;" v-show="displayMsg">
        CHANGE SEASONS?
        <br>Changing seasons will clear your map selections and cannot be retrieved.
        <br>
        <button @click="confirmSeasonChange = false; displayMsg = false; season = seasonChangeEvent.oldVal">Cancel</button>
        <button @click="seasonChange">Change season</button>

      </div>
      <br>
<!--      <input type="checkbox" id="checkbox" v-model="rangeOnly">-->
<!--      <label for="checkbox">Selected range only</label>-->

<!--      <button @click="rangeOnly = !rangeOnly">show new range only: {{ rangeOnly }}</button>-->
<!--      <button @click="print">print filters</button>-->

      <hr>
      Selected Hex Ids ({{selected.length}}):
<!--      <div class="tmp" @click="copyToClipboard" style="width: 300px; height: 300px; margin-bottom: 0.75rem; border: 1px solid black; overflow: scroll; padding: 0.5rem; cursor: pointer">{{selected}}</div>-->
<!--      <span v-if="copied" style="color: green;"><strong>IDs copied to clipboard!</strong></span>-->

      <hr>
      <button @click="undo" :disabled="!lastEvent.event">UNDO</button>

    </div>



  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import * as M from 'mapbox-gl'
  import geojson2h3 from 'geojson2h3'
  import * as h3 from 'h3-js'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import axios from 'axios'


  import {SELECTED, ALDFLY_SELECTED} from '~/static/constants'

  import * as turf from '@turf/turf'


  // import { GeoJSON } from 'GeoJSON'
  // @ts-ignore
  import MapboxDraw from '@mapbox/mapbox-gl-draw'
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
  // @ts-ignore
  import FreehandMode from 'mapbox-gl-draw-freehand-mode'
  import intersect from '@turf/intersect'
  import bbox from '@turf/bbox'
  import area from '@turf/area'
  // @ts-ignore
  import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'


  export default Vue.extend({
    data: () => ({
      map: undefined as any,
      coords: { lng: -99.35, lat: 40 } as M.LngLat,
      // selectMode: false,
      rangeOnly: false,
      resolution: 3,
      draw: undefined as any,
      filtered: [] as any[],
      children: [] as any[],
      // selected: JSON.parse(JSON.stringify(SELECTED)) as any[],
      selected: [] as any[],
      filteredBase: [] as any[],
      filteredChildren: [] as any[],
      copied: false,
      drawMode: false,
      species: 'aldfly',
      options: [
        { text: 'Alder Flycatcher', value: 'aldfly' },
        { text: 'arcter', value: 'arcter' },
        { text: 'balshe1', value: 'balshe1' },
        { text: 'brant', value: 'brant' },
        { text: 'comter', value: 'comter' },
        { text: 'parjae', value: 'parjae' },
        { text: 'westan', value: 'westan' },
      ],
      season: 'breeding',
      seasonOptions: [
        { text: 'breeding', value: 'breeding' },
        { text: 'nonbreeding', value: 'nonbreeding' },
        { text: 'prebreeding_migration', value: 'prebreeding_migration' },
        { text: 'postbreeding_migration', value: 'postbreeding_migration' },
      ],
      confirmSeasonChange: false,
      displayMsg: false,
      deselectLasso: false,
      seasonChangeEvent: undefined as any,
      // TODO type
      lastEvent: {
        event: undefined as any,
        ids: [] as any[],
        layers: [] as any[],
        children: {},
      },
      metadata: {},
      popup: undefined,
      // selectedOutput: 'bloop'
    }),
    computed: {
      selectedOutput(): string {
        return JSON.stringify(this.selected)
      },
      seasonFilter(): Array<any> {
        return ['==', ['get', 'season'], this.season]
      }
    },
    watch: {
      confirmSeasonChange(confirm) {
        if (confirm) {

          // TODO NEED TO CLEAR FILTERS AND CHILDREN!!
          // FIXME: bug, select then explode, change seasons - selected parent still on map


          if (this.filteredBase.length) {
            console.log(this.filteredBase)
            // TODO HANDLE THIS IN EXPLODE EVENT? MAKE SURE MAP STATE MATCHES SELECTED AND PARENT IS REMOVED FROM SELECTED
            this.filteredBase.forEach(hex => {
              this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: hex}, {selected: false})

            })
            this.selected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
          }

          if (this.selected.length) {
            this.selected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: false})})
            this.selected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
          }

          console.log('children', this.children)




          this.filteredChildren = []
          this.filteredBase = []
          this.children = []

          this.filterOutParentHexes(this.species, this.filteredBase)
          this.filterOutParentHexes('children', this.filteredChildren)
          this.setChildFeatures()


          // @ts-ignore
          // this.selected = JSON.parse(JSON.stringify(ALDFLY_SELECTED[this.season]))
          this.resetSelected()
          // console.log(this.selected)

          if (this.selected.length) {
            this.selected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: true})})
          }


          this.displayMsg = false
        }
      },
      // TODO DONT UPDATE SELECT COMPONENT SEASON UNTIL CONFIRM, LEAVE ON CANCEL
      season() {
        this.displayMsg = true
        // console.log(this.season)
        //
        // // TODO This doesn't clear select state from map
        // this.selected = ALDFLY_SELECTED[this.season]
        //
        // this.filterOutParentHexes(this.species, this.filteredBase)
        // this.filterOutParentHexes('children', this.filteredChildren)

      },
      // TODO Add clear all selections, reset to initial range, etc.
      rangeOnly() {


        // console.log('RANGE MODE')
        // console.log(this.selected)
        // console.log('filtered:', this.filtered)
        // console.log('children:', this.children)

        // TODO Style show range button to require update
        if (this.rangeOnly && this.selected.length) {
          this.map.setFilter(this.species, ['match', ['get', 'h3_address'], this.selected, true, false])
          this.map.setFilter('children', ['match', ['get', 'h3_address'], this.selected, true, false])
        } else {
          // console.log('base FILT', this.filteredBase)
          // console.log('children FILT', this.filteredChildren)
          // console.log('children', this.children)
          // console.log('selected', this.selected)



          // TODO Preserve filtered out values but remove selected filter
          // TODO CHeck if filteredBase is pop

          // filter out base-hex
          // filter in children?
          // this.map.setFilter(this.species)
          this.filteredBase = this.uniqueValues(this.filteredBase)
          this.filteredChildren = this.uniqueValues(this.filteredChildren)
          this.map.setFilter(this.species, this.filteredBase.length ? ['match', ['get', 'h3_address'], this.filteredBase, false, true] : null)
          this.map.setFilter('children', this.filteredChildren.length ? ['match', ['get', 'h3_address'], this.filteredChildren, false, true] : null)
          // this.map.setFilter('children', ['match', ['get', 'h3_address'], this.filteredChildren, true, false])
        }
      },
      selected(x) {
        // console.log('selected:', x)
      },
      species(newSpecies, oldSpecies) {

        // console.log(this.map.getSource(oldSpecies))
        // console.log(this.map.getSource(newSpecies))

        // // TODO MAke fn here and season change
        if (this.map.getSource('children') && this.map.getSource(oldSpecies)) {
          // console.log('bloop')
          if (this.filteredBase.length) {
            // console.log(this.filteredBase)
            // TODO HANDLE THIS IN EXPLODE EVENT? MAKE SURE MAP STATE MATCHES SELECTED AND PARENT IS REMOVED FROM SELECTED
            this.filteredBase.forEach(hex => {
              this.map.setFeatureState({source: oldSpecies, sourceLayer: oldSpecies, id: hex}, {selected: false})

            })
            this.selected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
          }

          if (this.selected.length) {
            this.selected.map(id => {this.map.setFeatureState({source: oldSpecies, sourceLayer: oldSpecies, id: id}, {selected: false})})
            this.selected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
          }

          // console.log('children', this.children)




          this.filteredChildren = []
          this.filteredBase = []
          this.children = []

          this.filterOutParentHexes(oldSpecies, this.filteredBase, oldSpecies)
          this.filterOutParentHexes('children', this.filteredChildren)
          this.setChildFeatures()

        }


        // console.log('old:', oldSpecies)
        // console.log('new:', newSpecies)
        this.map.setLayoutProperty(oldSpecies, 'visibility', 'none')
        this.updateLayer()
      }
    },
    mounted(): void {

      // TODO Make dynamic
      // @ts-ignore
      // this.selected = JSON.parse(JSON.stringify(ALDFLY_SELECTED[this.season]))

      ;(M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
      this.map = new M.Map({
        container: 'map-2',
        // style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: this.coords,
        zoom: 4,
        doubleClickZoom: false,
        boxZoom: false,
        dragRotate: false,
        // projection: 'equalEarth'
      })

      this.map.doubleClickZoom.disable()

      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: this.drawMode ? 'draw_polygon' : 'simple_select',
        controls: {
          polygon: true,
          // trash: true,
        },
        // @ts-ignore
        modes: Object.assign(MapboxDraw.modes, {
          draw_polygon: FreehandMode,
          // draw_polygon: DrawRectangle,
        }),
      })
      this.map.addControl(this.draw, 'top-left')
      this.map.addControl(new M.ScaleControl({maxWidth: 900}))
      this.map.addControl(new M.NavigationControl())

      this.map.on('load', () => {

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


        this.updateLayer()

        // // TODO Return single feature outline?


        // TODO Handle species changes
        // TODO CLEAR CHILDREN AND FILTERS ON SEASON AND SPECIES CHANGE
        // TODO Restrict lasso values!! and/or restructure so that selections and deselections are saved separately to improve performance
        // TODO Add displayMsg to prevent species change without saving selections??
        // TODO Handle missing seasons
        // TODO Clear lastEvent on season or species change
        // TODO Handle antimeridian bugs
        // TODO Add multiple undos
        // TODO Add redo??
        // TODO Allow season toggling without clearing prev season
        // TODO Bbox zoom
        // TODO REdo selections to watch selected valuse and update map state from watcher
        // TODO satellite base
        // TODO Add mechanism to save selected vals





      })
    },
    methods: {
      updateLayer() {
        // console.log('layer updated')
        const allLayers = [this.species, 'children']
        if (this.popup) {
          this.popup.remove()
        }

        if (!this.map.getSource(this.species)) {

          if (!this.metadata[this.species]) {
            this.fetchTileData()
          }

          this.checkTileData(this.metadata, this.species).then(() => {

            this.resetSelected()






            // this.selected = this.metadata[this.species].in_range_addresses[this.season]

            this.map.addSource(this.species, {
              type: 'vector',
              promoteId: 'h3_address',
              // tiles: ['http://127.0.0.1:8081/{z}/{x}/{y}.pbf'],
              // tiles: ['http://localhost:8080/data/range_hexagons/{z}/{x}/{y}.pbf'],
              tiles: [`https://test.cdn.shorebirdviz.ebird.org/range_editor/${this.species}/{z}/{x}/{y}.pbf`],
              maxzoom: 8,
            })

            // TODO Return single feature outline?
            this.map.addLayer({
              id: this.species,
              source: this.species,
              'source-layer': this.species,
              type: 'fill',
              filter: this.seasonFilter,
              layout: {
                'visibility': 'visible'
              },
              // filter: ['match', ['get', 'h3_address'], range2, false, true],
              paint: {
                // 'fill-outline-color': 'white',
                // 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], ['get', 'isRange']], '#fc035e', 'black'],
                'fill-color': ['case', ['boolean', ['feature-state', 'selected'], ['get', 'in_range']], 'deeppink', 'black'],
                // 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], ['get', 'in_range']], '#fc035e', 'black'],
                'fill-opacity': 0.3,
                // 'fill-opacity': 1,
                // 'fill-outline-color': 'black',
                // 'fill-color': 'yellow'
              },
            })



          })



          // TODO REMOVE POPUPS ON LAYER CHANGE


          this.map.on('mousedown', (e: any) => {
            // console.log(e.originalEvent)
            // this.draw.changeMode('draw_polygon')

            if (e.originalEvent.shiftKey || e.originalEvent.ctrlKey) {
              this.draw.changeMode('draw_polygon')
            }
            this.deselectLasso = e.originalEvent.ctrlKey
          })
          this.map.on('mouseup', (e: any) => {
            // console.log(e.originalEvent)
            this.draw.changeMode('simple_select')
            // this.deselectLasso = e.originalEvent.shiftKey
          })


          this.map.on('draw.create', this.drawCreate)

          // this.map.on('draw.create', (e: any) => {
          //   // console.log(this.deselectLasso)
          //   console.log(e)
          //   // console.log()
          //   const bbox = this.bboxToPixel(e.features[0])
          //   // TODO Add option to user intersection or completely contained within?
          //   const features = this.map.queryRenderedFeatures(bbox, {layers: [this.species, 'children']})
          //   // console.log(features)
          //   const intersection: any[] = []
          //   features.forEach((feature: any) => {
          //     // console.log(feature)
          //
          //
          //     const poly = turf.polygon(feature.geometry.coordinates)
          //     const int = turf.intersect(poly, turf.polygon(e.features[0].geometry.coordinates), {properties: feature.properties})
          //     if (int) {
          //       intersection.push(int);
          //     }
          //
          //   })
          //
          //   this.lastEvent = {
          //     event: !this.deselectLasso ? 'lasso_select' : 'lasso_deselect',
          //     ids: [],
          //     layers: [this.species, 'children']
          //   }
          //
          //   // console.log(intersection)
          //   intersection.forEach(feature => {
          //     // TODO Rearrange so that selected is watched, which then updates feature state
          //     if (!this.selected.includes(feature.properties.h3_address) && !this.deselectLasso) {
          //       this.selected.push(feature.properties.h3_address)
          //       this.lastEvent.ids.push(feature.properties.h3_address)
          //     } else if (this.selected.includes(feature.properties.h3_address) && this.deselectLasso) {
          //       // console.log(this.selected.length)
          //       this.removeItemFromArray(this.selected, feature.properties.h3_address)
          //       this.lastEvent.ids.push(feature.properties.h3_address)
          //
          //       // console.log(feature.properties.h3_address)
          //     }
          //     this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: feature.properties.h3_address}, {selected: !this.deselectLasso})
          //     this.map.setFeatureState({source: 'children', id: feature.properties.h3_address}, {selected: !this.deselectLasso})
          //
          //   })
          //
          //   console.log(this.lastEvent)
          //
          //
          //
          //   // console.log(this.selected)
          //
          //   this.draw.delete(e.features[0].id)
          // })


          this.map.on('draw.modechange', (e: any) => {
            // console.log('mode change')
            // console.log(e)
            setTimeout(() => {
              this.drawMode = Boolean(e.mode === 'draw_polygon')
              // console.log(this.drawMode)
            }, 10)

          })



          // RIGHT CLICK - collapse features
          this.map.on('contextmenu', (e: any) => {
            const event = e.originalEvent
            // prevent collapse on select or deselect lasso, which can trigger contextMenu event - event.button === 0 for right click
            if (!this.drawMode && !event.ctrlKey && event.button !== 0) {
              const feature = this.map.queryRenderedFeatures(e.point, { layers: allLayers })[0]
              const source = feature.source
              if (feature) {
                // console.log(feature.id)
                const clickedRes = h3.h3GetResolution(feature.id)
                // console.log(clickedRes)

                if (clickedRes >= 3) {
                  // parent of clicked feature
                  const parent = h3.h3ToParent(feature.id, clickedRes - 1)
                  // console.log(parent)

                  let queryFeatures;
                  if (source === this.species) {

                    const poly = geojson2h3.h3ToFeature(parent)
                    queryFeatures = this.map.queryRenderedFeatures(this.bboxToPixel(poly), { layers: [this.species] })
                  }



                  // console.log(this.children.includes(parent), parent)
                  // add parent to children layer to keep totally separate from filtered based-hex values
                  this.children.push(parent)


                  // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
                  // match parent selected state to clicked hex selected state, push to array if selected
                  this.map.setFeatureState({
                    source: 'children',
                    id: parent
                  }, { selected: this.arrayIncludesItem(this.selected, feature.id) })
                  if (this.arrayIncludesItem(this.selected, feature.id)) {
                    this.selected.push(parent)
                  }



                  this.lastEvent = {
                    event: this.arrayIncludesItem(this.selected, feature.id) ? 'click_collapse_selected' : 'click_collapse_deselected',
                    ids: [parent],
                    layers: [feature.source],
                    children: {}, // TODO Clear children in other events?
                  }


                  // empty array for all children through res 6 for the selected parent hex
                  const allChildren: any[] = []
                  // all possible resolutions on the map
                  const resolutions = [2, 3, 4, 5]
                  resolutions.forEach((resolution: number) => {
                    if (resolution >= clickedRes) {
                      // for each res, find children and push to array
                      allChildren.push(...h3.h3ToChildren(parent, resolution))
                    }
                  })


                  // console.log('last event children:', this.lastEvent.children)
                  // // if (this.lastEvent.children.length === 0) {
                  // console.log('allChildren', allChildren)
                  // console.log('query:', queryFeatures)

                  // TODO USE THESE QUERYFEATURES INSTEAD OF ALLCHILDREN??
                  if (source === this.species) {
                    queryFeatures.forEach(f => {
                      if (allChildren.includes(f.id)) {
                        // console.log(f.id, this.selected.includes(f.id))
                        this.lastEvent.children[f.id] = this.selected.includes(f.id)
                      }
                    })
                  }



                  allChildren.forEach((child: string) => {

                    // if a child hex is already plotted on the map, remove it from the array
                    if (this.children.includes(child)) {
                      this.lastEvent.children[child] = this.selected.includes(child)
                      // console.log(child)
                      this.removeItemFromArray(this.children, child)
                    }
                    // if a child hex is selected (pink), turn off its selected map state and remove from selected array
                    if (this.selected.includes(child)) {
                      this.removeItemFromArray(this.selected, child)
                      this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
                    }
                  })

                  // this.setChildFeatures()



                  if (source === this.species) {
                    // console.log('BASE:', this.filteredChildren)
                    // console.log('filter all children from base-hex layer AND children from children layer?')
                    this.filteredBase.push(...allChildren)
                    // TODO STreamline the array within the func, tied to which layer is passed in
                    this.filterOutParentHexes(this.species, this.filteredBase)

                  } else {

                    // FIXME collapse 5, explode same, explode neighbor 6

                    this.removeItemFromArray(this.filteredChildren, parent)
                    this.filterOutParentHexes('children', this.filteredChildren)

                    this.filteredBase.push(...allChildren)
                    // TODO STreamline the array within the func, tied to which layer is passed in
                    this.filterOutParentHexes(this.species, this.filteredBase)


                  }

                  // this.filterOutParentHexes('children', this.filteredChildren)
                  this.setChildFeatures()


                  // console.log(parent, this.filteredChildren)


                } else {
                  console.log('CANNOT COLLAPSE FOR RES', clickedRes)
                }
              }

              //   // TODO Replace all w h3GetResolution


            }
          })


          // LEFT CLICK - select, deselect, or extrapolate features
          this.map.on('click', [this.species, 'children'], (e: any) => {

            // console.log(e)
            // console.log('CLICK', e.originalEvent.shiftKey)



            if (!this.drawMode) {

              const selectMode = !e.originalEvent.shiftKey
              const feature = e.features[0]
              // console.log(feature)
              const res = parseInt(feature.id[1]) + 1

              // if select mode is off, i.e. if user is expanding or collapsing shapes
              if (!selectMode) {
                // TODO Combine res restriction and selectMode conditions?
                // only allow user to drill down to h3 res 6
                if (res <= 5) {

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
                  if (feature.source === this.species) {
                    this.filteredBase.push(feature.id)
                  } else {
                    this.filteredChildren.push(feature.id)
                  }

                  // is parent hex selected on the map
                  // const parentSelected = this.map.getFeatureState({source: layer, ...(layer === this.species && { sourceLayer: 'hex' }), id: feature.id}).selected
                  // TODO Get updated selected hexes for this to work with aldfly
                  const parentSelected = this.arrayIncludesItem(this.selected, feature.id)
                  // console.log(this.selected, parentSelected)

                  // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
                  children.forEach((child: string) => {
                    // if parent hex is selected on the map, set ALL child features as selected too, push to array
                    if (parentSelected) {
                      this.map.setFeatureState({ source: 'children', id: child }, { selected: true })
                      this.selected.push(child)
                      // console.log(child, this.map.getFeatureState({source: 'children', id: child}))
                    }

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
                    this.map.setFeatureState({ source: 'children', id: feature.id }, { selected: false })
                    this.removeItemFromArray(this.selected, feature.id)
                  }


                  if (feature.source === this.species) {
                    this.filterOutParentHexes(this.species, this.filteredBase)
                  } else {
                    // console.log('updated filtered children...', this.filteredChildren)
                    this.filterOutParentHexes('children', this.filteredChildren)
                  }

                  // if the clicked hex is in the children array, remove it from array when hex is filtered out
                  if (this.arrayIncludesItem(this.children, feature.id)) {
                    this.removeItemFromArray(this.children, feature.id)
                  }





                  // TODO Create fn?
                  this.lastEvent = {
                    event: parentSelected ? 'click_expand_selected' : 'click_expand_deselected',
                    ids: [feature.id],
                    layers: [feature.source]
                  }




                }
              } else {  // if selection mode is on

                // FIXME Sel mode false, click range erroneously deselects features

                // TODO Make sure selected array includes all initially selected features? Or have separate deselected array?
                // boolean feature property for range - set during tile generation
                const isRange = feature.properties.in_range
                // if feature is part of the default range on initial map load before feature state is set
                const defaultRange = !Object.keys(feature.state).length && isRange

                // console.log(isRange, defaultRange, feature.state.selected)

                // update map feature state
                this.map.setFeatureState(
                  {
                    source: feature.source, ...(feature.source === this.species && { sourceLayer: this.species }),
                    id: feature.id
                  },
                  { selected: defaultRange ? !isRange : !feature.state.selected }
                )

                this.updateSelected(feature)


                this.lastEvent = {
                  event: this.map.getFeatureState({
                    source: feature.source, ...(feature.source === this.species && { sourceLayer: this.species }),
                    id: feature.id
                  }).selected ? 'click_select' : 'click_deselect',
                  ids: [feature.id],
                  layers: [feature.source]
                }

                // console.log(this.selected, this.selected.includes(feature.id))
              }
            }
          })

          this.popup = new M.Popup({closeButton: false})
          this.map.on('mousemove', [this.species, 'children'], (e: any) => {
            this.popup.setHTML(e.features[0].id).setLngLat(e.lngLat).addTo(this.map)
          })



        } else {
          this.resetSelected()
          console.log(this.selected)
          console.log(this.map.getPaintProperty(this.species, 'fill-color'))
          // FIXME Make it so that these values are properly handled in species watch clearing?
          this.selected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: true})})

          this.map.setLayoutProperty(this.species, 'visibility', 'visible')

        }
        // console.log(this.metadata)

      },
      checkTileData(tileData, species) {
        return new Promise((resolve) => {
          ;(function waitForLoad() {
            if (tileData[species]) return resolve()
            // poll every 30ms until condition is met
            setTimeout(waitForLoad, 30)
          })()
        })
      },
      fetchTileData() {
        // TODO Make fn
        const url = `https://test.cdn.shorebirdviz.ebird.org/range_editor/${this.species}/range_editor.json`
        axios
          .get(url)
          .then(async (response) => {
            this.metadata[this.species] = await response.data
            // this.tileMetadata[this.species] = await response.data
            /**
             * Returns tile metadata object for selected species, formatted with species as keys, e.g. `{ bknsti: { ... }, grpchi: { ... } }` <br> Auto-updates and emits a new event every time a new species is selected
             */
            // this.$emit('get-tile-data', this.tileMetadata)
          })
          .catch((err) => {
            console.log(err)
          })
      },
      resetSelected() {
        this.selected = JSON.parse(JSON.stringify(this.metadata[this.species].in_range_addresses[this.season]))
      },
      onSeasonChange(input: any) {
        this.displayMsg = true
        // console.log(input)
        this.seasonChangeEvent = {oldVal: input.srcElement._value, newVal: input.target.value}
        this.season = this.seasonChangeEvent.newVal
        // console.log(this.seasonChangeEvent)
      },
      seasonChange() {
        this.confirmSeasonChange = true
        this.season = this.seasonChangeEvent.newVal

        this.displayMsg = false

        setTimeout(() => {
          this.confirmSeasonChange = false
        }, 2000)
      },
      uniqueValues(array: any[]): any[] {
        return Array.from(new Set(array))
      },
      setChildFeatures(): void {
        // ensure that there are no duplicate children
        this.children = this.uniqueValues(this.children)
        // convert hex ids into geojson, preserving the indices
        const childrenPoly = geojson2h3.h3SetToFeatureCollection(this.children, (hex) => ({h3_address: hex}))
        // apply geojson to map layer
        this.map.getSource('children').setData(childrenPoly)
      },
      filterOutParentHexes(featureSource: string, array: string[], species: string = this.species): void {
        array = this.uniqueValues(array)
        // console.log(array.length)
        // console.log(array.length ? ['match', ['get', 'h3_address'], array, false, true] : null)

        // TODO How to handle children for different seasons?
        // TODO only apply breeding filter to base-hex?
        // const seasonFilter = ['==', ['get', 'season'], 'breeding']
        const hexFilter = ['match', ['get', 'h3_address'], array, false, true]
        // if there are filtered features, filter listed ones out, otherwise remove filter to show all features
        // this.map.setFilter(featureSource, array.length ? ['match', ['get', 'h3_address'], array, false, true] : null)
        // this.map.setFilter(featureSource, array.length ? ['all', seasonFilter, ['match', ['get', 'h3_address'], array, false, true]] : seasonFilter)
        if (featureSource === species) {
          this.map.setFilter(featureSource, array.length ? ['all', this.seasonFilter, hexFilter] : this.seasonFilter)
        } else {
          this.map.setFilter(featureSource, array.length ? hexFilter : null)
        }
      },
      removeItemFromArray(array: any[], item: any): void {
        array.splice(array.indexOf(item), 1)
      },
      arrayIncludesItem(array: any[], item: any): boolean {
        return array.includes(item)
      },
      updateSelected(feature: any): void {
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
      copyToClipboard(): void {
        navigator.clipboard.writeText(this.selectedOutput)
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
        // alert('Ids copied to clipboard!')
      },
      saveLastEvent(event: any, ids: any, layers: any) {
        this.lastEvent = {
          event: event,
          ids: ids,
          layers: layers
        }
      },
      drawCreate(e) {
          // console.log(this.deselectLasso)
          console.log(e)
          // console.log()
          const bbox = this.bboxToPixel(e.features[0])
          // TODO Add option to user intersection or completely contained within?
          const features = this.map.queryRenderedFeatures(bbox, {layers: [this.species, 'children']})
          // console.log(features)
          const intersection: any[] = []
          features.forEach((feature: any) => {
            // console.log(feature)


            const poly = turf.polygon(feature.geometry.coordinates)
            const int = turf.intersect(poly, turf.polygon(e.features[0].geometry.coordinates), {properties: feature.properties})
            if (int) {
              intersection.push(int);
            }

          })

          this.lastEvent = {
            event: !this.deselectLasso ? 'lasso_select' : 'lasso_deselect',
            ids: [],
            layers: [this.species, 'children']
          }

          // console.log(intersection)
          intersection.forEach(feature => {
            // TODO Rearrange so that selected is watched, which then updates feature state
            if (!this.selected.includes(feature.properties.h3_address) && !this.deselectLasso) {
              this.selected.push(feature.properties.h3_address)
              this.lastEvent.ids.push(feature.properties.h3_address)
            } else if (this.selected.includes(feature.properties.h3_address) && this.deselectLasso) {
              // console.log(this.selected.length)
              this.removeItemFromArray(this.selected, feature.properties.h3_address)
              this.lastEvent.ids.push(feature.properties.h3_address)

              // console.log(feature.properties.h3_address)
            }
            this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: feature.properties.h3_address}, {selected: !this.deselectLasso})
            this.map.setFeatureState({source: 'children', id: feature.properties.h3_address}, {selected: !this.deselectLasso})

          })

          console.log(this.lastEvent)



          // console.log(this.selected)

          this.draw.delete(e.features[0].id)
      },
      undo() {
        // console.log(this.lastEvent)

        const event = this.lastEvent.event
        const ids = this.lastEvent.ids
        const source = this.lastEvent.layers
        if (event === 'lasso_select') {
          console.log('Need to deselect', ids)
          ids.forEach(id => {
            this.removeItemFromArray(this.selected, id)
            this.map.setFeatureState({
              source: 'children',
              id: id
            }, {selected: false})
            this.map.setFeatureState({
              source: this.species,
              sourceLayer: this.species,
              id: id
            }, {selected: false})
          })

        } else if (event === 'lasso_deselect') {
          console.log('Need to select', ids)
          ids.forEach(id => {
            this.selected.push(id)
            this.map.setFeatureState({
              source: 'children',
              id: id
            }, {selected: true})
            this.map.setFeatureState({
              source: this.species,
              sourceLayer: this.species,
              id: id
            }, {selected: true})
          })
          // TODO See if we can restore partial children selections
        } else if (event === 'click_collapse_selected') {
          console.log('Need to expand selected ', ids)

          const id = ids[0]
          // find children of clicked feature, push to array for app-wide usage
          const children = Object.keys(this.lastEvent.children)
          // console.log(children)
          this.children.push(...children)

          // TODO Make sure that resetting all child features scales with thousands of children
          // set child geojson features in layer
          this.setChildFeatures()

          // filter out the clicked feature so that parent and children are not layered on top of each other
          if (source[0] === this.species) {
            this.filteredBase.push(id)
          } else {
            this.filteredChildren.push(id)
          }

          // is parent hex selected on the map
          // TODO Get updated selected hexes for this to work with aldfly
          const parentSelected = this.arrayIncludesItem(this.selected, id)

          // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
          children.forEach((child: string) => {
            this.map.setFeatureState({ source: 'children', id: child }, { selected: this.lastEvent.children[child] })

            if (!this.selected.includes(child) && this.lastEvent.children[child]) {
              this.selected.push(child)
              console.log('push to selected...', child)
            } else if (this.selected.includes(child) && !this.lastEvent.children[child]) {
              // TODO Only if in selected array?
              console.log('PULL from selected...', child)

              this.removeItemFromArray(this.selected, id)
            }

            if (this.filteredChildren.includes(child)) {
              this.removeItemFromArray(this.filteredChildren, child)
            }
          })

          // if parent is selected when children are exploded, remove the selected map state for the parent and remove from array
          // happens outside of children loop to not duplicate unnecessarily
          if (parentSelected) {
            this.map.setFeatureState({ source: 'children', id: id }, { selected: false })
            this.removeItemFromArray(this.selected, id)
          }

          if (source[0] === this.species) {
            // TODO Check selected??
            // if base-hex was exploded, collapsed, then undone, REMOVE PARENT FROM CHILDREN ARRAY
            this.filteredChildren.push(id)
            this.filterOutParentHexes('children', this.filteredChildren)

            this.filterOutParentHexes(this.species, this.filteredBase)
          } else {
            this.filterOutParentHexes('children', this.filteredChildren)
          }

          // if the clicked hex is in the children array, remove it from array when hex is filtered out
          if (this.arrayIncludesItem(this.children, id)) {
            this.removeItemFromArray(this.children, id)
          }

        } else if (event === 'click_collapse_deselected') {
          console.log('Need to expand deselected', ids)
          console.log('restore ', this.lastEvent.children)

          // TODO NEED TO ACCOUNT FOR BASE HEX COLLAPSE WITH NO CHILDREN
          // TODO CHECK ALL source[0] CONDITIONS W MULTI LAYERS

          const id = ids[0]
          // find children of clicked feature, push to array for app-wide usage
          const children = Object.keys(this.lastEvent.children)
          // console.log(children)
          this.children.push(...children)

          // TODO Make sure that resetting all child features scales with thousands of children
          // set child geojson features in layer
          this.setChildFeatures()

          // filter out the clicked feature so that parent and children are not layered on top of each other
          if (source[0] === this.species) {
            this.filteredBase.push(id)
          } else {
            this.filteredChildren.push(id)
          }

          // is parent hex selected on the map
          // TODO Get updated selected hexes for this to work with aldfly
          const parentSelected = this.arrayIncludesItem(this.selected, id)

          // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
          children.forEach((child: string) => {
            this.map.setFeatureState({ source: 'children', id: child }, { selected: this.lastEvent.children[child] })

            if (!this.selected.includes(child) && this.lastEvent.children[child]) {
              this.selected.push(child)
              // console.log('push to selected...', child)
            } else if (this.selected.includes(child) && !this.lastEvent.children[child]) {
              // TODO Only if in selected array?
              // console.log('PULL from selected...', child)

              this.removeItemFromArray(this.selected, id)
            }

            if (this.filteredChildren.includes(child)) {
              this.removeItemFromArray(this.filteredChildren, child)
            }

          })

          // if parent is selected when children are exploded, remove the selected map state for the parent and remove from array
          // happens outside of children loop to not duplicate unnecessarily
          // TODO HArdcode these since it's separated by selected/deselected?
          if (parentSelected) {
            this.map.setFeatureState({ source: 'children', id: id }, { selected: false })
            this.removeItemFromArray(this.selected, id)
          }

          if (source[0] === this.species) {

            // TODO Check selected??
            // if base-hex was exploded, collapsed, then undone, REMOVE PARENT FROM CHILDREN ARRAY
            this.filteredChildren.push(id)
            this.filterOutParentHexes('children', this.filteredChildren)

            this.filterOutParentHexes(this.species, this.filteredBase)
          } else {

            this.filterOutParentHexes('children', this.filteredChildren)
          }

          // if the clicked hex is in the children array, remove it from array when hex is filtered out
          if (this.arrayIncludesItem(this.children, id)) {
            this.removeItemFromArray(this.children, id)
          }

        } else if (event === 'click_expand_selected') {
          console.log('Need to collapse selected', ids)

          const parent = ids[0]
          const clickedRes = h3.h3GetResolution(parent)

          // add parent to children layer to keep totally separate from filtered based-hex values
          this.children.push(parent)

          // // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
          // match parent selected state to clicked hex selected state, push to array if selected
          if (!this.selected.includes(parent)) {
            this.selected.push(parent)
          }
          this.map.setFeatureState({
            source: 'children',
            id: parent
          }, { selected: true })

          const allChildren = h3.h3ToChildren(parent, clickedRes + 1)

          allChildren.forEach((child: string) => {
            // if a child hex is already plotted on the map, remove it from the array
            if (this.children.includes(child)) {
              this.removeItemFromArray(this.children, child)
            }
            // if a child hex is selected (pink), turn off its selected map state and remove from selected array
            if (this.selected.includes(child)) {
              this.removeItemFromArray(this.selected, child)
              this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
            }
          })

          if (source[0] === this.species) {
            // console.log('BASE:', this.filteredChildren)
            // console.log('filter all children from base-hex layer AND children from children layer?')
            this.filteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.filteredBase)

          } else {
            this.removeItemFromArray(this.filteredChildren, parent)
            this.filterOutParentHexes('children', this.filteredChildren)

            this.filteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.filteredBase)
          }
          this.setChildFeatures()

        } else if (event === 'click_expand_deselected') {
          console.log('Need to collapse deselected', ids)


          const parent = ids[0]
          const clickedRes = h3.h3GetResolution(parent)
          // add parent to children layer to keep totally separate from filtered based-hex values
          this.children.push(parent)

          const allChildren = h3.h3ToChildren(parent, clickedRes + 1)
          allChildren.forEach((child: string) => {
            // if a child hex is already plotted on the map, remove it from the array
            if (this.children.includes(child)) {
              this.removeItemFromArray(this.children, child)
            }
            // if a child hex is selected (pink), turn off its selected map state and remove from selected array
            if (this.selected.includes(child)) {
              this.removeItemFromArray(this.selected, child)
              this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
            }
          })

          console.log(source)

          if (source[0] === this.species) {
            this.filteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.filteredBase)
          } else {
            this.removeItemFromArray(this.filteredChildren, parent)
            this.filterOutParentHexes('children', this.filteredChildren)
            this.filteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.filteredBase)
          }
          this.setChildFeatures()







        } else if (event === 'click_select') {
          console.log('Need to click deselect', ids)
          this.removeItemFromArray(this.selected, ids[0])
          this.map.setFeatureState({
            source: source[0],
            ...(source[0] === this.species && { sourceLayer: this.species }),
            id: ids[0]
          }, {selected: false})
        } else if (event === 'click_deselect') {
          console.log('Need to click select', ids)
          this.selected.push(...ids)
          this.map.setFeatureState({
            source: source[0],
            ...(source[0] === this.species && { sourceLayer: this.species }),
            id: ids[0]
          }, {selected: true})
        }

        this.lastEvent = {
          event: undefined,
          ids: [],
          layers: [],
          children: {},
        }
      }

    },
  })
</script>

<style>
  #map-2 {
    width: 70%;
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

  #selected-ids {
    width: 300px;
    height: 300px;
    white-space: pre-line;
  }
</style>
