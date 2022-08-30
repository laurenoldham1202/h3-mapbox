<template>
  <div style="display: flex">


    <div id="map-2"></div>

    <div id="sidebar" style="">


      <span>Select a species:</span> <br>
<!--      <select v-model="species" class="select">-->
<!--        <option v-for="option in options" :value="option.value">-->
<!--          {{ option.text }}-->
<!--        </option>-->
<!--      </select>-->

            <select :value="species"  @input="onSpeciesChange" class="select">
              <option v-for="option in options" :value="option.value">
                {{ option.text }}
              </option>
            </select>
      <br>
      <br>

      <!-- TODO Add warning before switching seasons? Auto save or send? -->
      <span>Select a season:</span> <br>
      <select v-model="season" class="select">
        <option v-for="option in seasonOptions" :value="option.value" :disabled="disableSeason(option.value)">
          {{ option.text }}
        </option>
      </select>
<!--      <select :value="season"  @input="onSpeciesChange" class="select" :disabled="displayMsg">-->
<!--        <option v-for="option in seasonOptions" :value="option.value" :disabled="disableSeason(option.value)">-->
<!--          {{ option.text }}-->
<!--        </option>-->
<!--      </select>-->

      <p style="color: red; font-weight: 500;" v-show="disableSeason(season)">
        {{season}} season UNAVAILABLE for {{species}}
      </p>


      <!-- TODO ONLY DISPLAY IF SELECTED VALUES HAVE CHANGED, have save point here, not necessarily able to reload, add to species change, MENTION THIS IN TRAINING -->
      <div class="alert-msg" :style="{borderColor: exported ? '#cc3340' : '#bd580a'}" style="border: 1px solid; margin: 1rem 0;" v-show="displayMsg">
        <div class="header" :style="{background: exported ? '#cc3340' : '#bd580a'}" style="color: white; padding: 0.5rem; font-weight: 500;">
          <div v-if="!exported"><strong>Export {{seasonText[speciesChangeEvent?.oldVal]}} species data?</strong></div>
          <div v-if="exported"><strong>Confirm species change</strong></div>
        </div>
        <div class="body" :style="{background: exported ? '#f6e4e5' : '#f4e8df'}" style="padding: 0.5rem; display: flex; flex-direction: column;">
          <div v-if="!exported">
            You must export current species data before changing species.
            <!-- Map changes will be lost and cannot be retrieved once changed. -->
          </div>
          <div v-if="exported">
            Check that your download was successful and confirm species change.
          </div>
          <div class="button-menu" style="margin-left: auto; margin-top: 0.75rem;">
            <!-- TODO Check all these interactions, toggling seasons when canceled, toggling seasons when display open -->
            <button @click="confirmSpeciesChange = false; displayMsg = false; species = speciesChangeEvent.oldVal">Cancel</button>
            <button v-show="!exported" @click="download">Export</button>
            <button v-show="exported" @click="speciesChange">Change species</button>
          </div>
        </div>
      </div>

<!--      &lt;!&ndash;  ONLY DISPLAY IF SELECTED VALUES HAVE CHANGED, have save point here, not necessarily able to reload, add to species change, MENTION THIS IN TRAINING &ndash;&gt;-->
<!--      <div :style="{background: exported ? 'orange' : '#f4e8df'}"-->
<!--        style="font-weight: 500; margin: 0.5rem 0; padding: 0.5rem; display: flex; flex-direction: column;" v-show="displayMsg">-->
<!--        <div style="margin-bottom: 0.75rem;">-->
<!--          <span v-show="!exported">-->
<!--            <div class="header" style="background: #bd580a">Export {{seasonText[speciesChangeEvent?.oldVal]}} season data?</div>-->
<!--            <br>Changing seasons will clear your map selections, which cannot be retrieved. You must export your current selections before changing seasons.-->
<!--          </span>-->
<!--          <span v-show="exported">CONFIRM season change from {{speciesChangeEvent?.oldVal}} to {{season}}</span>-->
<!--          <br>-->
<!--        </div>-->
<!--        <div class="button-menu" style="margin-left: auto;">-->

<!--          <button @click="confirmSpeciesChange = false; displayMsg = false; season = speciesChangeEvent.oldVal">Cancel</button>-->
<!--  &lt;!&ndash;        <button @click="speciesChange">Save and change season</button>&ndash;&gt;-->

<!--          <button v-show="!exported" @click="download">Export</button>-->
<!--          &lt;!&ndash; TODO on confirm, set exported to false  &ndash;&gt;-->
<!--          <button v-show="exported" @click="speciesChange">Change season</button>-->
<!--        </div>-->

<!--      </div>-->

      <br><br>
      <label for="basemap">Basemap: </label><br>
      <select v-model="style" id="basemap" class="select">
        <option v-for="option in styleOptions" :value="option.value">
          {{ option.text }}
        </option>
      </select>

      <hr>
      # selected hexes: <strong v-if="sessionData[species] && seasonSelected">{{seasonSelected.length}}</strong>
      <br><br>
<!--      <button @click="undo" :disabled="!lastEvent.event">UNDO LAST</button>-->
      <button @click="undoTest" :disabled="actionNumber <= 0">UNDO LAST ACTION</button>
      <button @click="download">save species data</button>
<!--      <button @click="save">save</button>-->
      <hr>

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



<!--      <input type="checkbox" id="checkbox" v-model="rangeOnly">-->
<!--      <label for="checkbox">Selected range only</label>-->

<!--      <button @click="rangeOnly = !rangeOnly">show new range only: {{ rangeOnly }}</button>-->
<!--      <button @click="print">print filters</button>-->

<!--      Selected Hex Ids ({{selected.length}}):-->

<!--      <div class="tmp" @click="copyToClipboard" style="width: 300px; height: 300px; margin-bottom: 0.75rem; border: 1px solid black; overflow: scroll; padding: 0.5rem; cursor: pointer">{{selected}}</div>-->
<!--      <span v-if="copied" style="color: green;"><strong>IDs copied to clipboard!</strong></span>-->


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
        // { text: 'Arctic Tern', value: 'arcter' },
        // { text: 'Balearic Shearwater', value: 'balshe1' },
        // { text: 'Brant', value: 'brant' },
        // { text: 'Common Tern', value: 'comter' },
        // { text: 'Parasitic Jaeger', value: 'parjae' },
        { text: 'Western Tanager', value: 'westan' },
      ],
      season: 'breeding',
      seasonOptions: [
        { text: 'Breeding', value: 'breeding' },
        { text: 'Nonbreeding', value: 'nonbreeding' },
        { text: 'Prebreeding migration', value: 'prebreeding_migration' },
        { text: 'Postbreeding migration', value: 'postbreeding_migration' },
      ],
      seasonText: {
        breeding: 'Breeding',
        nonbreeding: 'Nonbreeding',
        'prebreeding_migration': 'Prebreeding migration',
        'postbreeding_migration': 'Postbreeding migration',
      } as any,
      styleOptions: [
        { text: 'Street', value: 'streets-v11' },
        { text: 'Satellite', value: 'satellite-streets-v11' },
      ],
      confirmSpeciesChange: false,
      displayMsg: false,
      deselectLasso: false,
      speciesChangeEvent: undefined as any,
      // TODO type
      lastEvent: {
        event: undefined as any,
        ids: [] as any[],
        layers: [] as any[],
        children: {} as any,
      },
      pastActions: [] as any[],
      metadata: {} as any,
      popup: undefined as any,
      style: 'streets-v11',
      count: 0,
      savedData: {} as any,
      speciesData: {} as any,
      exported: false,
      sessionData: {} as any,
    }),
    computed: {
      selectedOutput(): string {
        return JSON.stringify(this.seasonSelected)
      },
      seasonFilter(): Array<any> {
        return ['==', ['get', 'season'], this.season]
      },
      actionNumber(): number {
        return this.pastActions.length - this.count
      },
      seasonSelected(): string[] {
        return this.sessionData[this.species][this.season].selected
      },
      seasonFilteredBase(): string[] {
        return this.sessionData[this.species][this.season].filteredBase
      },
      seasonFilteredChildren(): string[] {
        return this.sessionData[this.species][this.season].filteredChildren
      },
      seasonChildren(): string[] {
        return this.sessionData[this.species][this.season].children
      },
    },
    watch: {
      selected() {

      },
      pastActions() {
        // reset undo count any time a new action is performed
        this.count = 0
      },
      style() {
        this.map.setStyle(`mapbox://styles/mapbox/${this.style}`)

        this.map.once('style.load', () => {

          // TODO MAKE FN FOR SPECIES CHANGE, SEASON CHANGE?, STYLE CHANGE
          this.map.off('click', [this.species, 'children'], this.mapClick)
          this.map.off('contextmenu', [this.species, 'children'], this.mapRightClick)



          // this.map.removeLayer(this.species)
          // this.map.removeSource(this.species)
          // FIXME LAYER UPDATE ON STYLE CHANGE DOESNT WORK
          // TODO UPDATE STYLE AND ADD SELECTIONS
          this.updateLayer(false)
        })
      },
      season() {
        this.resetLayer(this.species, true)
        this.exported = false

        // TODO ADD BACK CHECKLISTS
        // this.map.setFilter(`${this.species}_checklists`, this.seasonFilter)
      },
      confirmSpeciesChange(confirm) {
        // console.log(confirm)

        // TODO Set exported to false
        if (confirm) {
          // console.log('confirmed!')
          this.exported = false
          this.confirmSpeciesChange = false

          // this.pastActions = []

          // this.download()
          // clear all children, filters, and selected hexes when season is changed
          // this.resetLayer(this.species, true)
          // this.exported = false
          //
          // this.map.setFilter(`${this.species}_checklists`, this.seasonFilter)


          // console.log(this.speciesChangeEvent)


          // clear display message if open when species is changed
          if (this.displayMsg) {
            this.displayMsg = false
          }

          this.map.setLayoutProperty(this.speciesChangeEvent.oldVal, 'visibility', 'none')

          // TODO Turn of ALL old species events, also check season changes
          this.map.off('click', [this.speciesChangeEvent.oldVal, 'children'], this.mapClick)
          this.map.off('contextmenu', [this.speciesChangeEvent.oldVal, 'children'], this.mapRightClick)







          // when species is changed, clear all children, filters, and selected hexes from previous species
          // this.resetLayer(oldSpecies, false)
          // turn off old species visibility on map
          // plot new species layer
          this.updateLayer()
          //
          //
          this.checkTileData(this.metadata, this.speciesChangeEvent.newVal).then(() => {

            // console.log(this.sessionData)
            this.setChildFeatures()
          })
        }
      },
      species(newSpecies, oldSpecies) {

        // FIXME SWITCHING SPECIES NOT HONORING SEASON OR SELECTIONS PROPERLY
        // Deselect in ald bre > westan > non > ald

        //
        // // clear display message if open when species is changed
        // if (this.displayMsg) {
        //   this.displayMsg = false
        // }
        //
        // this.map.setLayoutProperty(oldSpecies, 'visibility', 'none')
        //
        // // TODO Turn of ALL old species events, also check season changes
        // this.map.off('click', [oldSpecies, 'children'], this.mapClick)
        // this.map.off('contextmenu', [this.species, 'children'], this.mapRightClick)
        //
        //
        //
        //
        //
        //
        //
        // // when species is changed, clear all children, filters, and selected hexes from previous species
        // // this.resetLayer(oldSpecies, false)
        // // turn off old species visibility on map
        // // plot new species layer
        // this.updateLayer()
        // //
        // //
        // this.checkTileData(this.metadata, newSpecies).then(() => {
        //
        //   // console.log(this.sessionData)
        //   this.setChildFeatures()
        // })

      },
      // // TODO Add clear all selections, reset to initial range, etc.
      // rangeOnly() {
      //
      //   // TODO Style show range button to require update
      //   if (this.rangeOnly && this.seasonSelected.length) {
      //     this.map.setFilter(this.species, ['match', ['get', 'h3_address'], this.seasonSelected, true, false])
      //     this.map.setFilter('children', ['match', ['get', 'h3_address'], this.seasonSelected, true, false])
      //   } else {
      //
      //     // TODO Preserve filtered out values but remove selected filter
      //     // TODO CHeck if filteredBase is pop
      //
      //     this.seasonFilteredBase = this.uniqueValues(this.seasonFilteredBase)
      //     this.seasonFilteredChildren = this.uniqueValues(this.seasonFilteredChildren)
      //     this.map.setFilter(this.species, this.seasonFilteredBase.length ? ['match', ['get', 'h3_address'], this.seasonFilteredBase, false, true] : null)
      //     this.map.setFilter('children', this.seasonFilteredChildren.length ? ['match', ['get', 'h3_address'], this.seasonFilteredChildren, false, true] : null)
      //     // this.map.setFilter('children', ['match', ['get', 'h3_address'], this.seasonFilteredChildren, true, false])
      //   }
      // },
    },
    mounted(): void {

      ;(M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA'
      this.map = new M.Map({
        container: 'map-2',
        // style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
        style: `mapbox://styles/mapbox/${this.style}`, // style URL
        center: this.coords,
        zoom: 1,
        doubleClickZoom: false,
        boxZoom: false,
        dragRotate: false,
        // projection: 'globe',
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

        this.map.on('zoom', () => {
          // console.log(this.map.getZoom())
        })

        // // TODO Return single feature outline?

        // TODO HANDLE LASSO SELECT ACROSS ANTIMERIDIAN
        // TODO ADD CHECKLISTS


        // TODO Restrict lasso values!! and/or restructure so that selections and deselections are saved separately to improve performance
        // TODO Add displayMsg to prevent species change without saving selections??
        // TODO Handle antimeridian bugs
        // TODO Add redo??
        // TODO REdo selections to watch selected valuse and update map state from watcher
        // TODO Add mechanism to save selected vals
        // TODO Add back rangeOnly option
        // TODO Add line range as layer
        // TODO Update collapse event to only look for queryFeatures instead of AllChildren
        // TODO Add mass explode/collapse option?





      })
    },
    methods: {
      zoomToExtent() {
        const bbox = this.metadata[this.species].bounding_box
        if (bbox) {
          let sw = [bbox.lon_min, bbox.lat_min]
          let ne = [bbox.lon_max, bbox.lat_max]

          // if extent crosses the antimeridian, set lng bounds to farthest sw and ne bounds without crossing
          if (sw[0] - ne[0] > 0) {
            // preserve latitude coords
            sw = [-179, sw[1]]
            ne = [179, ne[1]]
          }

          const coords = [sw, ne]
          // if small screen, omit extra padding around bbox
          // this.map.fitBounds(coords, { padding: window.innerWidth <= 900 || window.innerHeight <= 500 ? 0 : 200 })
          this.map.fitBounds(coords, { padding: 100 })
        }
      },
      updateLayer(resetDefaultSelections = true) {
        // clear any existing popups when species is updated
        if (this.popup) {
          this.popup.remove()
        }

        // console.log(this.map.getSource(this.species))

        // if the species hasn't been mapped yet...
        if (!this.map.getSource(this.species)) {

          // console.log(`${this.species} source DOES NOT exist...`)


          // console.log('plot new layer for ', this.species)

          // fetch tile data if it hasn't been fetched yet
          if (!this.metadata[this.species]) {
            this.fetchTileData()
          }
          // check for tile data before manipulating map
          this.checkTileData(this.metadata, this.species).then(() => {

            if (!this.sessionData[this.species]) {

              this.sessionData[this.species] = {}
              // console.log(this.sessionData)
            }

            // season data for selected species
            const speciesSeasons = this.metadata[this.species].season_dates
            this.seasonOptions.forEach(season => {
              const seasonIncluded = Object.keys(speciesSeasons).includes(season.value)
              // if season is included, display 'mm-dd to mm-dd', otherwise display 'unavailable' for missing seasons
              const text = seasonIncluded ? `${speciesSeasons[season.value].start_date} to ${speciesSeasons[season.value].end_date}` : 'unavailable'
              season.text = `${this.seasonText[season.value]} (${text})`

              // if (!Object.keys(this.sessionData).length) {
              // console.log('INITIAL SETTING:', this.sessionData)
              if (!this.sessionData[this.species].hasOwnProperty(season.value)) {
                // console.log('set ', season)

                this.sessionData[this.species][season.value] = {
                  selected: [],
                  filteredBase: [],
                  filteredChildren: [],
                  children: [],
                }
              }
              // }

            })

            // console.log(this.sessionData)

            // console.log(this.sessionData[this.species][this.season].selected)

            // console.log(this.sessionData)

            // const selectedHexExp = resetDefaultSelections ? ['get', 'in_range'] : ['match', ['get', 'h3_address'], this.seasonSelected, true, false]
            this.map.addSource(this.species, {
              type: 'vector',
              promoteId: 'h3_address',
              // tiles: ['http://127.0.0.1:8081/{z}/{x}/{y}.pbf'],
              // tiles: ['http://localhost:8080/data/breeding/{z}/{x}/{y}.pbf'],
              tiles: [`https://test.cdn.shorebirdviz.ebird.org/range_editor/${this.species}_v3/{z}/{x}/{y}.pbf`],
              maxzoom: 8,
            })

            // console.log(this.seasonSelected)
            // console.log(resetDefaultSelections)
            // console.log(this.sessionData)
            // console.log(this.sessionData[this.species][this.season].selected)

            const streetStyle = this.style === 'streets-v11'
            const selectedHexExp = !resetDefaultSelections ? ['match', ['get', 'h3_address'], this.sessionData[this.species][this.season].selected, true, false] : ['get', 'in_range']
            // console.log(selectedHexExp)
            const unselectedOutline = streetStyle ? 'black' : 'white'
            const fillOpacity: any = streetStyle ? 0.3 : ['case', ['boolean', ['feature-state', 'selected'], selectedHexExp], 0.5, 0.2]

            // TODO Return single feature outline?
            this.map.addLayer({
              id: this.species,
              source: this.species,
              // 'source-layer': 'aldfly',
              'source-layer': this.species,
              type: 'fill',
              filter: this.seasonFilter,
              layout: {
                'visibility': 'visible'
              },
              paint: {
                // 'fill-opacity': 0.3
                'fill-color': ['case', ['boolean', ['feature-state', 'selected'], selectedHexExp], 'deeppink', 'black'],
                'fill-outline-color': ['case', ['boolean', ['feature-state', 'selected'], selectedHexExp], 'deeppink', unselectedOutline],
                'fill-opacity': fillOpacity,
              },
            })


            // this.map.addLayer({
            //   id: `${this.species}_checklists`,
            //   source: this.species,
            //   // 'source-layer': 'aldfly',
            //   'source-layer': `${this.species}_checklists`,
            //   type: 'circle',
            //   // filter: ['all', this.seasonFilter, ['>', ['get', 'detected'], 0]],
            //   filter: this.seasonFilter,
            //   layout: {
            //     'visibility': 'visible',
            //     // plot detected (1) values on top of undetected (0)
            //     'circle-sort-key': ['+', ['get', 'detected']]
            //   },
            //   // TODO NEED TO ADJUST STYLES FOR SATELLITE
            //   paint: {
            //     'circle-opacity': ['match', ['get', 'detected'], 0, 0.3, 1, 0.7, 0.3],
            //     'circle-color': ['match', ['get', 'detected'], 0, '#9c4363', 1, '#4405ff', 'black'],
            //     'circle-radius': ['match', ['get', 'detected'], 0, 2, 1, 4, 2],
            //     'circle-stroke-width': 1,
            //     'circle-stroke-color': ['match', ['get', 'detected'], 0, 'transparent', 1, 'whitesmoke', 'transparent'],
            //     // 'fill-color': ['case', ['boolean', ['feature-state', 'selected'], selectedHexExp], 'deeppink', 'black'],
            //     // 'fill-outline-color': ['case', ['boolean', ['feature-state', 'selected'], selectedHexExp], 'deeppink', unselectedOutline],
            //     // 'fill-opacity': fillOpacity,
            //   },
            // })

            // this.map.setFilter(`${this.species}_checklists`, ['>', ['get', 'detected'], 0])

            // this.map.on('mousemove', `${this.species}_checklists`, (e) => {
            //   console.log(e.features[0].properties)
            // })

            // FIXME SHIFT + RIGHT CLICK ON CHILDREN DOES WEIRD STUFF

            if (resetDefaultSelections) {
              // reset selected hexes any time a new species is selected
              this.resetSelected()
              // zoom to species extent on map
              this.zoomToExtent()
              // console.log('reset selected')
            } else {
              // console.log(this.map.getLayer('children'))
              // this.seasonSelected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: true})})
              //
              //

              // TODO HANDLE DESELECTED FEATURES ON STYLE CHANGE
              // ^^ the feature.state is cleared and only pink selected values are given selected value, so any {selected: false} need to be set
              // console.log('DONT reset selected')

              // FIXME Reselecting deselected base hex after style change
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
                  'fill-color': ['case', ['boolean', ['feature-state', 'selected'], selectedHexExp], 'deeppink', 'black'],
                  'fill-outline-color': ['case', ['boolean', ['feature-state', 'selected'], selectedHexExp], 'deeppink', unselectedOutline],
                  'fill-opacity': fillOpacity
                },
                layout: {
                  'fill-sort-key': ['+', ['get', 'h3_address']],
                },
              })

              // console.log('children replotted')

              // console.log(this.sessionData)
              this.filterOutParentHexes(this.species, this.seasonFilteredBase)
              this.filterOutParentHexes('children', this.seasonFilteredChildren)
              this.setChildFeatures()
              this.seasonSelected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: true})})
              this.seasonSelected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: true})})
            }

          })


          // MOUSE CLICK DOWN/DRAG EVENT
          this.map.on('mousedown', (e: any) => {
            const event = e.originalEvent  // mouse event
            const ctrlClicked = event.ctrlKey  // whether ctrl key is being pressed while clicking
            if (event.shiftKey || ctrlClicked) {  // if shift OR ctrl key are pressed while holding down the mouse, enable draw mode
              this.draw.changeMode('draw_polygon')
            }
            // if ctrl is pressed, enter deselectLasso mode
            this.deselectLasso = ctrlClicked
          })

          // any time mouse is released, exit draw mode
          this.map.on('mouseup', () => {
            this.draw.changeMode('simple_select')
          })

          // map draw event - either lasso select or deselect
          this.map.on('draw.create', this.drawCreate)

          // if draw mode is changed, update drawMode boolean on a brief timeout to prevent closing click from exploding a polygon
          this.map.on('draw.modechange', (e: any) => {
            setTimeout(() => {
              this.drawMode = Boolean(e.mode === 'draw_polygon')
            }, 10)
          })

          // TESTING: Add popup for each hex
          this.popup = new M.Popup({closeButton: false})
          this.map.on('mousemove', [this.species, 'children'], (e: any) => {
            // console.log(e.features[0])
            // this.popup.setHTML(e.features[0].source + '<br>' + e.features[0].properties.season + '<br>' + e.features[0].id).setLngLat(e.lngLat).addTo(this.map)
          })

        } else {


          // console.log(`plot ${this.species} for ${this.season} season`)

          this.resetLayer(this.species, true)

          // TODO Include this only once, not in both if and else statements?
          // this.resetSelected()
          // console.log(this.seasonSelected)
          // console.log(this.map.getPaintProperty(this.species, 'fill-color'))
          // FIXME Make it so that these values are properly handled in species watch clearing?
          this.seasonSelected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: true})})

          this.map.setLayoutProperty(this.species, 'visibility', 'visible')

        }

        // add layer click event any time a new species is selected, regardless of map status
        this.map.on('click', [this.species, 'children'], this.mapClick)
        this.map.on('contextmenu', [this.species, 'children'], this.mapRightClick)
      },
      checkTileData(tileData: any, species: any): any {
        return new Promise((resolve) => {
          ;(function waitForLoad() {
            // @ts-ignore
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
            // console.log(response)
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
      disableSeason(season: string) {
        // boolean value to indicate if selected season is available for a given species - used in template for messaging
        if (this.metadata[this.species]) {
          return !this.metadata[this.species].in_range_addresses[season]
        }
      },
      resetSelected() {
        // json response data for the selected season
        const seasonData = this.metadata[this.species].in_range_addresses[this.season]
        if (seasonData && !this.sessionData[this.species][this.season].selected.length) {
          // only reset JSON data if season exists to prevent errors
          // this.seasonSelected = JSON.parse(JSON.stringify(seasonData))
          this.sessionData[this.species][this.season].selected = JSON.parse(JSON.stringify(seasonData))
        } else {
          console.log(`SEASON NOT AVAILABLE FOR ${this.species}`)
        }
      },
      resetLayer(layer: string, speciesChange: boolean) {
        if (this.map.getSource('children') && this.map.getSource(layer)) {

          // TODO DO THIS FOR NON-SELECTED SEASONS

          // if (this.seasonFilteredBase.length) {
          //   // TODO HANDLE THIS IN EXPLODE EVENT? MAKE SURE MAP STATE MATCHES SELECTED AND PARENT IS REMOVED FROM SELECTED
          //   this.seasonFilteredBase.forEach(hex => {
          //     this.map.setFeatureState({source: layer, sourceLayer: layer, id: hex}, {selected: false})
          //   })
          //   this.seasonSelected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
          // }
          //
          // if (this.seasonSelected.length) {
          //   this.seasonSelected.map(id => {this.map.setFeatureState({source: layer, sourceLayer: layer, id: id}, {selected: false})})
          //   this.seasonSelected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
          // }

          // console.log(this.season)
          // this.sessionData[this.species][this.season].filteredChildren = []
          // this.sessionData[this.species][this.season].filteredBase = []
          // this.sessionData[this.species][this.season].children = []
          // console.log(this.sessionData)
          // console.log('input layer:', layer)

          Object.entries(this.sessionData[this.species]).forEach(([season, obj]: any) => {
            // console.log(obj)

            if (obj.filteredBase.length) {
              // TODO HANDLE THIS IN EXPLODE EVENT? MAKE SURE MAP STATE MATCHES SELECTED AND PARENT IS REMOVED FROM SELECTED
              obj.filteredBase.forEach((id: string) => {
                this.map.setFeatureState({source: layer, sourceLayer: layer, id: id}, {selected: false})
              })
              obj.selected.map((id: string) => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
            }

            if (obj.selected.length) {
              obj.selected.map((id: string) => {this.map.setFeatureState({source: layer, sourceLayer: layer, id: id}, {selected: false})})
              obj.selected.map((id: string) => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
            }
          })

          // FIXME Make changes, change seasons, change back, then change basemap?


          // console.log(this.sessionData)

          this.filterOutParentHexes(layer, this.seasonFilteredBase, layer)
          this.filterOutParentHexes('children', this.seasonFilteredChildren)
          this.setChildFeatures()

          if (speciesChange) {
            // console.log('season changed')
            // console.log(this.sessionData)
            // console.log(this.season)
            // console.log('before:', this.sessionData)
            this.resetSelected()
            // console.log('after:', this.sessionData)

            // Object.values(this.sessionData).forEach((obj: any) => {
            Object.entries(this.sessionData[this.species]).forEach(([season, obj]: any) => {

              // console.log(obj.selected)
              // TODO Exclude selected season
              // @ts-ignore
              if (obj.selected.length) {
                if (season === this.season) {
                  // console.log(obj.selected)
                  // @ts-ignore
                  obj.selected.map((id: string) => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: true})})
                  obj.selected.map((id: string) => {this.map.setFeatureState({source: 'children', id: id}, {selected: true})})


                } else {

                  // if (obj.filteredBase.length) {
                  //   // TODO HANDLE THIS IN EXPLODE EVENT? MAKE SURE MAP STATE MATCHES SELECTED AND PARENT IS REMOVED FROM SELECTED
                  //   obj.filteredBase.forEach(hex => {
                  //     this.map.setFeatureState({source: layer, sourceLayer: layer, id: hex}, {selected: false})
                  //   })
                  //   obj.selected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
                  // }
                  //
                  // if (obj.selected.length) {
                  //   obj.selected.map(id => {this.map.setFeatureState({source: layer, sourceLayer: layer, id: id}, {selected: false})})
                  //   obj.selected.map(id => {this.map.setFeatureState({source: 'children', id: id}, {selected: false})})
                  // }
                  // @ts-ignore

                  // obj.selected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: false})})
                  // obj.filteredBase.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: false})})
                  // obj.filteredChildren.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: false})})
                }

              }
            })

            // if (this.seasonSelected.length) {
            //   this.seasonSelected.map(id => {this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: id}, {selected: true})})
            // }


            this.displayMsg = false
          }


          // TODO FIX MESSAGING AND DISABLE IN SIDEBAR FOR MISSING SEASONS
          // this.clearLastEvent()
          // console.log('cleared')
          this.pastActions = []
        }
      },
      onSpeciesChange(input: any) {

        // FIXME Disable map events when displayMsg is up?

        // console.log(this.sessionData)
        // console.log(this.metadata)

        this.speciesChangeEvent = {oldVal: input.srcElement._value, newVal: input.target.value}

        let requireConfirmation = false

        Object.entries(this.sessionData[this.speciesChangeEvent.oldVal]).forEach(([season, seasonData]: any) => {
          if (seasonData.selected.length) {
            // console.log('updated length:', seasonData.selected.length)
            // console.log('original length:', this.metadata[this.speciesChangeEvent.oldVal].in_range_addresses[season].length)

            if (seasonData.selected.length !== this.metadata[this.speciesChangeEvent.oldVal].in_range_addresses[season].length) {
              requireConfirmation = true
            }
          }
        })

        // console.log(requireConfirmation)


        // console.log(this.pastActions)
        // if (this.pastActions.length) {
        if (requireConfirmation) {

          this.displayMsg = true
          // console.log(input)
          // this.speciesChangeEvent = {oldVal: input.srcElement._value, newVal: input.target.value}
          // this.season = this.speciesChangeEvent.newVal
          this.species = this.speciesChangeEvent.newVal
          // console.log(this.speciesChangeEvent)
        } else {
          // this.speciesChangeEvent = {oldVal: input.srcElement._value, newVal: input.target.value}
          console.log(`update from ${this.speciesChangeEvent.oldVal} to ${this.speciesChangeEvent.newVal}`)
          // console.log(this.session)

          this.speciesChange()
        }

      },
      speciesChange() {
        // console.log('speciesChange called....')
        this.confirmSpeciesChange = true
        // this.season = this.speciesChangeEvent.newVal
        this.species = this.speciesChangeEvent.newVal
        this.displayMsg = false

        // setTimeout(() => {
        //   this.confirmSpeciesChange = false
        // }, 2000)
      },
      uniqueValues(array: any[]): any[] {
        return Array.from(new Set(array))
      },
      setChildFeatures(): void {
        // console.log('SET CHILDREN')
        // console.log(this.sessionData)
        // ensure that there are no duplicate children
        this.sessionData[this.species][this.season].children = this.uniqueValues(this.seasonChildren)
        // console.log(this.sessionData[this.species][this.season].children)
        // convert hex ids into geojson, preserving the indices
        const childrenPoly = geojson2h3.h3SetToFeatureCollection(this.seasonChildren, (hex) => ({h3_address: hex}))

        childrenPoly.features.forEach((feature : any) => {
          const polygon = feature.geometry['coordinates']

          polygon[0].forEach((coord: any[], i: number) => {
            // compare one vertex longitude value against the next vertex lng value to see if it crosses antimeridian
            if (i < polygon[0].length - 1) {
              const lng = polygon[0][i + 1][0] // reference longitude coordinate
              const prevLng = coord[0]  // preceding longitude coordinate

              // if lng minus preceding lng exceeds 180 degrees, ADD 360 degrees
              if (lng - prevLng <= -180) {
                polygon[0][i + 1][0] += 360
              } else if (lng - prevLng >= 180) {
                // if reference lng minus preceding lng is greater than 180 degrees, subtract 360 degrees
                polygon[0][i + 1][0] -= 360
              }
            }
          })
        })



        // apply geojson to map layer
        this.map.getSource('children').setData(childrenPoly)
      },
      // @ts-ignore
      filterOutParentHexes(featureSource: string, array: string[], species: any = this.species): void {
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
        if (!this.seasonSelected.includes(feature.id)) {
          this.seasonSelected.push(feature.id)
          // console.log('pushed', feature.id)
        } else {
          this.removeItemFromArray(this.seasonSelected, feature.id)
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
        navigator.clipboard.writeText(this.sessionData)
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
          layers: layers,
          children: {},

        }
      },
      drawCreate(e: any) {
          // console.log(this.deselectLasso)
          // console.log(e)
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
            layers: [this.species, 'children'],
            children: {},
          }

          this.pastActions.push({
            event: !this.deselectLasso ? 'lasso_select' : 'lasso_deselect',
            ids: [],
            layers: [this.species, 'children'],
            children: {},
          })

          // console.log(intersection)
          intersection.forEach(feature => {
            // TODO Rearrange so that selected is watched, which then updates feature state
            if (!this.seasonSelected.includes(feature.properties.h3_address) && !this.deselectLasso) {
              this.seasonSelected.push(feature.properties.h3_address)
              this.lastEvent.ids.push(feature.properties.h3_address)
              this.pastActions[this.pastActions.length - 1].ids.push(feature.properties.h3_address)
            } else if (this.seasonSelected.includes(feature.properties.h3_address) && this.deselectLasso) {
              // console.log(this.seasonSelected.length)
              this.removeItemFromArray(this.seasonSelected, feature.properties.h3_address)
              // this.lastEvent.ids.push(feature.properties.h3_address)
              this.pastActions[this.pastActions.length - 1].ids.push(feature.properties.h3_address)

              // console.log(feature.properties.h3_address)
            }
            this.map.setFeatureState({source: this.species, sourceLayer: this.species, id: feature.properties.h3_address}, {selected: !this.deselectLasso})
            this.map.setFeatureState({source: 'children', id: feature.properties.h3_address}, {selected: !this.deselectLasso})

          })

          // console.log(this.lastEvent)



          // console.log(this.seasonSelected)

          this.draw.delete(e.features[0].id)
      },
      mapClick(e: any) {
        if (!this.drawMode) {

          const selectMode = !e.originalEvent.shiftKey
          const feature = e.features[0]
          // console.log('map click', feature)
          const res = parseInt(feature.id[1]) + 1

          // if select mode is off, i.e. if user is expanding or collapsing shapes
          if (!selectMode) {
            // TODO Combine res restriction and selectMode conditions?
            // only allow user to drill down to h3 res 6
            if (res <= 5) {

              // console.log('BEFORE CLICK filtered base:', this.seasonFilteredBase)

              // find children of clicked feature, push to array for app-wide usage
              const children = h3.h3ToChildren(feature.id, res)
              this.seasonChildren.push(...children)

              // TODO Make sure that resetting all child features scales with thousands of children
              // set child geojson features in layer
              this.setChildFeatures()

              // filter out the clicked feature so that parent and children are not layered on top of each other
              // this.filtered.push(feature.id)
              // console.log(feature.source)
              if (feature.source === this.species) {
                this.seasonFilteredBase.push(feature.id)
              } else {
                this.seasonFilteredChildren.push(feature.id)
              }

              // is parent hex selected on the map
              // const parentSelected = this.map.getFeatureState({source: layer, ...(layer === this.species && { sourceLayer: 'hex' }), id: feature.id}).selected
              // TODO Get updated selected hexes for this to work with aldfly
              const parentSelected = this.arrayIncludesItem(this.seasonSelected, feature.id)
              // console.log(this.seasonSelected, parentSelected)

              // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
              children.forEach((child: string) => {
                // if parent hex is selected on the map, set ALL child features as selected too, push to array
                if (parentSelected) {
                  this.map.setFeatureState({ source: 'children', id: child }, { selected: true })
                  this.seasonSelected.push(child)
                  // console.log(child, this.map.getFeatureState({source: 'children', id: child}))
                }

                // if (this.filtered.includes(child)) {
                //   this.removeItemFromArray(this.filtered, child)
                // }
                if (this.seasonFilteredChildren.includes(child)) {
                  this.removeItemFromArray(this.seasonFilteredChildren, child)
                }
                if (this.seasonFilteredBase.includes(child)) {
                  // this.removeItemFromArray(this.seasonFilteredBase, child)
                }
              })

              // if parent is selected when children are exploded, remove the selected map state for the parent and remove from array
              // happens outside of children loop to not duplicate unnecessarily
              if (parentSelected) {
                this.map.setFeatureState({ source: 'children', id: feature.id }, { selected: false })
                this.removeItemFromArray(this.seasonSelected, feature.id)
              }


              if (feature.source === this.species) {
                this.filterOutParentHexes(this.species, this.seasonFilteredBase)
              } else {
                // console.log('updated filtered children...', this.seasonFilteredChildren)
                this.filterOutParentHexes('children', this.seasonFilteredChildren)
              }

              // if the clicked hex is in the children array, remove it from array when hex is filtered out
              if (this.arrayIncludesItem(this.seasonChildren, feature.id)) {
                this.removeItemFromArray(this.seasonChildren, feature.id)
              }





              // TODO Create fn?
              this.lastEvent = {
                event: parentSelected ? 'click_expand_selected' : 'click_expand_deselected',
                ids: [feature.id],
                layers: [feature.source],
                children: {},
              }

              this.pastActions.push({
                event: parentSelected ? 'click_expand_selected' : 'click_expand_deselected',
                ids: [feature.id],
                layers: [feature.source],
                children: {},
              })




            }
          } else {  // if selection mode is on
            // boolean feature property for range - set during tile generation
            const inRange = feature.properties.in_range
            // handle hexes that were deselected in base range when basemap changed, which removed {selected: false}
            const deselectedFromBase = !this.seasonSelected.includes(feature.id) && inRange
            // if feature is part of the default range on initial map load before feature state is set
            const defaultRange = !Object.keys(feature.state).length && inRange
            // set map state on hex click, accounting for situations when feature state is not yet state on initial load or basemap change
            const selectedState = deselectedFromBase ? deselectedFromBase : defaultRange ? !inRange : !feature.state.selected

            // update map feature state
            this.map.setFeatureState(
              {
                source: feature.source, ...(feature.source === this.species && { sourceLayer: this.species }),
                id: feature.id
              }, { selected: selectedState }
            )

            this.updateSelected(feature)


            this.lastEvent = {
              event: this.map.getFeatureState({
                source: feature.source, ...(feature.source === this.species && { sourceLayer: this.species }),
                id: feature.id
              }).selected ? 'click_select' : 'click_deselect',
              ids: [feature.id],
              layers: [feature.source],
              children: {},
            }

            this.pastActions.push({
              event: this.map.getFeatureState({
                source: feature.source, ...(feature.source === this.species && { sourceLayer: this.species }),
                id: feature.id
              }).selected ? 'click_select' : 'click_deselect',
              ids: [feature.id],
              layers: [feature.source],
              children: {},
            })

            // console.log(this.seasonSelected, this.seasonSelected.includes(feature.id))
          }
        }
      },
      mapRightClick(e: any) {
        // console.log(this.sessionData[this.species][this.season])
        // console.log('RIGHT CLICK')
        const event = e.originalEvent
        // prevent collapse on select or deselect lasso, which can trigger contextMenu event - event.button === 0 for right click
        if (!this.drawMode && !event.ctrlKey && event.button !== 0) {
          // console.log(this.species)
          const feature = this.map.queryRenderedFeatures(e.point, { layers: [this.species, 'children'] })[0]
          // console.log(feature)
          const source = feature.source
          // console.log(source)
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



              // console.log(this.seasonChildren.includes(parent), parent)
              // add parent to children layer to keep totally separate from filtered based-hex values
              this.seasonChildren.push(parent)

              // console.log(feature.id, this.arrayIncludesItem(this.seasonSelected, feature.id))

              // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
              // match parent selected state to clicked hex selected state, push to array if selected
              this.map.setFeatureState({
                source: 'children',
                id: parent
              }, { selected: this.arrayIncludesItem(this.seasonSelected, feature.id) })
              if (this.arrayIncludesItem(this.seasonSelected, feature.id)) {
                this.seasonSelected.push(parent)
              }



              this.lastEvent = {
                event: this.arrayIncludesItem(this.seasonSelected, feature.id) ? 'click_collapse_selected' : 'click_collapse_deselected',
                ids: [parent],
                layers: [feature.source],
                children: {}, // TODO Clear children in other events?
              }

              this.pastActions.push({
                event: this.arrayIncludesItem(this.seasonSelected, feature.id) ? 'click_collapse_selected' : 'click_collapse_deselected',
                ids: [parent],
                layers: [feature.source],
                children: {}, // TODO Clear children in other events?
              })


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
                queryFeatures.forEach((f: any) => {
                  if (allChildren.includes(f.id)) {
                    // console.log(f.id, this.seasonSelected.includes(f.id))
                    this.lastEvent.children[f.id] = this.seasonSelected.includes(f.id)
                    this.pastActions[this.pastActions.length - 1].children[f.id] = this.seasonSelected.includes(f.id)
                  }
                })
              }

              // console.log(this.pastActions)



              allChildren.forEach((child: string) => {

                // if a child hex is already plotted on the map, remove it from the array
                if (this.seasonChildren.includes(child)) {
                  this.lastEvent.children[child] = this.seasonSelected.includes(child)
                  this.pastActions[this.pastActions.length - 1].children[child] = this.seasonSelected.includes(child)
                  // console.log(child)
                  this.removeItemFromArray(this.seasonChildren, child)
                }
                // if a child hex is selected (pink), turn off its selected map state and remove from selected array
                if (this.seasonSelected.includes(child)) {
                  this.removeItemFromArray(this.seasonSelected, child)
                  this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
                }
              })

              // this.setChildFeatures()



              if (source === this.species) {
                // console.log('BASE:', this.seasonFilteredChildren)
                // console.log('filter all children from base-hex layer AND children from children layer?')
                this.seasonFilteredBase.push(...allChildren)
                // TODO STreamline the array within the func, tied to which layer is passed in
                this.filterOutParentHexes(this.species, this.seasonFilteredBase)

              } else {

                // FIXME collapse 5, explode same, explode neighbor 6

                this.removeItemFromArray(this.seasonFilteredChildren, parent)
                this.filterOutParentHexes('children', this.seasonFilteredChildren)

                this.seasonFilteredBase.push(...allChildren)
                // TODO STreamline the array within the func, tied to which layer is passed in
                this.filterOutParentHexes(this.species, this.seasonFilteredBase)


              }

              // this.filterOutParentHexes('children', this.seasonFilteredChildren)
              this.setChildFeatures()


              // console.log(parent, this.seasonFilteredChildren)


            } else {
              console.log('CANNOT COLLAPSE FOR RES', clickedRes)
            }
          }

          // console.log(this.sessionData[this.species][this.season])

          //   // TODO Replace all w h3GetResolution


        }
      },
      // TODO type
      undo(lastEvent: any) {
        // console.log('LAST EVENT:', lastEvent)

        const event = lastEvent.event
        const ids = lastEvent.ids
        const source = lastEvent.layers
        if (event === 'lasso_select') {
          // console.log('Need to deselect', ids)
          ids.forEach((id: any) => {
            this.removeItemFromArray(this.seasonSelected, id)
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
          // console.log('Need to select', ids)
          ids.forEach((id: any) => {
            this.seasonSelected.push(id)
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
          // console.log('Need to expand selected ', ids)

          const clickSource = this.seasonFilteredBase.includes(ids[0]) ? 'children' : source[0]

          const id = ids[0]
          // find children of clicked feature, push to array for app-wide usage
          const children = Object.keys(lastEvent.children)
          // console.log(children)
          this.seasonChildren.push(...children)

          // TODO Make sure that resetting all child features scales with thousands of children
          // set child geojson features in layer
          this.setChildFeatures()

          // filter out the clicked feature so that parent and children are not layered on top of each other
          if (clickSource === this.species) {
            this.seasonFilteredBase.push(id)
          } else {
            this.seasonFilteredChildren.push(id)
          }

          // is parent hex selected on the map
          // TODO Get updated selected hexes for this to work with aldfly
          const parentSelected = this.arrayIncludesItem(this.seasonSelected, id)

          // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
          children.forEach((child: string) => {
            this.map.setFeatureState({ source: 'children', id: child }, { selected: lastEvent.children[child] })

            if (!this.seasonSelected.includes(child) && lastEvent.children[child]) {
              this.seasonSelected.push(child)
              // console.log('push to selected...', child)
            } else if (this.seasonSelected.includes(child) && !lastEvent.children[child]) {
              // TODO Only if in selected array?
              // console.log('PULL from selected...', child)

              this.removeItemFromArray(this.seasonSelected, id)
            }

            if (this.seasonFilteredChildren.includes(child)) {
              this.removeItemFromArray(this.seasonFilteredChildren, child)
            }
          })

          // if parent is selected when children are exploded, remove the selected map state for the parent and remove from array
          // happens outside of children loop to not duplicate unnecessarily
          if (parentSelected) {
            this.map.setFeatureState({ source: 'children', id: id }, { selected: false })
            this.removeItemFromArray(this.seasonSelected, id)
          }

          if (clickSource === this.species) {
            // TODO Check selected??
            // if base-hex was exploded, collapsed, then undone, REMOVE PARENT FROM CHILDREN ARRAY
            this.seasonFilteredChildren.push(id)
            this.filterOutParentHexes('children', this.seasonFilteredChildren)

            this.filterOutParentHexes(this.species, this.seasonFilteredBase)
          } else {
            this.filterOutParentHexes('children', this.seasonFilteredChildren)
          }

          // if the clicked hex is in the children array, remove it from array when hex is filtered out
          if (this.arrayIncludesItem(this.seasonChildren, id)) {
            this.removeItemFromArray(this.seasonChildren, id)
          }

        } else if (event === 'click_collapse_deselected') {
          // console.log('Need to expand deselected', ids)
          // console.log('restore ', lastEvent.children)

          // console.log(lastEvent)

          const clickSource = this.seasonFilteredBase.includes(ids[0]) ? 'children' : source[0]
          // console.log(clickSource)


          // TODO NEED TO ACCOUNT FOR BASE HEX COLLAPSE WITH NO CHILDREN
          // TODO CHECK ALL source[0] CONDITIONS W MULTI LAYERS

          const id = ids[0]
          // find children of clicked feature, push to array for app-wide usage
          const children = Object.keys(lastEvent.children)
          // console.log(children)
          this.seasonChildren.push(...children)

          // TODO Make sure that resetting all child features scales with thousands of children
          // set child geojson features in layer
          this.setChildFeatures()

          // filter out the clicked feature so that parent and children are not layered on top of each other
          if (clickSource === this.species) {
            this.seasonFilteredBase.push(id)
          } else {
            this.seasonFilteredChildren.push(id)
          }

          // is parent hex selected on the map
          // TODO Get updated selected hexes for this to work with aldfly
          const parentSelected = this.arrayIncludesItem(this.seasonSelected, id)

          // if a child hex has been filtered out (via collapse), remove it from filtered list when feature is reselected
          children.forEach((child: string) => {
            // console.log(this.lastEvent.children[child])


            this.map.setFeatureState({ source: 'children', id: child }, { selected: lastEvent.children[child] })

            if (!this.seasonSelected.includes(child) && lastEvent.children[child]) {
              this.seasonSelected.push(child)
              // console.log('push to selected...', child)
            } else if (this.seasonSelected.includes(child) && !lastEvent.children[child]) {
              // TODO Only if in selected array?
              // console.log('PULL from selected...', child)

              this.removeItemFromArray(this.seasonSelected, id)
            }

            if (this.seasonFilteredChildren.includes(child)) {
              this.removeItemFromArray(this.seasonFilteredChildren, child)
            }

          })

          // if parent is selected when children are exploded, remove the selected map state for the parent and remove from array
          // happens outside of children loop to not duplicate unnecessarily
          // TODO HArdcode these since it's separated by selected/deselected?
          if (parentSelected) {
            this.map.setFeatureState({ source: 'children', id: id }, { selected: false })
            this.removeItemFromArray(this.seasonSelected, id)
          }

          if (clickSource === this.species) {

            // TODO Check selected??
            // if base-hex was exploded, collapsed, then undone, REMOVE PARENT FROM CHILDREN ARRAY
            this.seasonFilteredChildren.push(id)
            this.filterOutParentHexes('children', this.seasonFilteredChildren)

            this.filterOutParentHexes(this.species, this.seasonFilteredBase)
          } else {

            this.filterOutParentHexes('children', this.seasonFilteredChildren)
          }

          // if the clicked hex is in the children array, remove it from array when hex is filtered out
          if (this.arrayIncludesItem(this.seasonChildren, id)) {
            this.removeItemFromArray(this.seasonChildren, id)
          }

        } else if (event === 'click_expand_selected') {
          // console.log('Need to collapse selected', ids)

          // FIXME change species, select, expand, undo - CAN'T DESELECT

          // console.log(this.seasonSelected.includes(ids[0]))

          const parent = ids[0]
          const clickedRes = h3.h3GetResolution(parent)

          // add parent to children layer to keep totally separate from filtered based-hex values
          this.seasonChildren.push(parent)

          // // TODO Instead of setting feature state throughout code, just handle array and handle feature state in selected watcher?
          // match parent selected state to clicked hex selected state, push to array if selected
          if (!this.seasonSelected.includes(parent)) {
            this.seasonSelected.push(parent)
          }
          this.map.setFeatureState({
            source: 'children',
            id: parent
          }, { selected: true })

          const allChildren = h3.h3ToChildren(parent, clickedRes + 1)

          allChildren.forEach((child: string) => {
            // if a child hex is already plotted on the map, remove it from the array
            if (this.seasonChildren.includes(child)) {
              this.removeItemFromArray(this.seasonChildren, child)
            }
            // if a child hex is selected (pink), turn off its selected map state and remove from selected array
            if (this.seasonSelected.includes(child)) {
              this.removeItemFromArray(this.seasonSelected, child)
              this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
            }
          })

          if (source[0] === this.species) {
            // console.log('BASE:', this.seasonFilteredChildren)
            // console.log('filter all children from base-hex layer AND children from children layer?')
            this.seasonFilteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.seasonFilteredBase)

          } else {
            this.removeItemFromArray(this.seasonFilteredChildren, parent)
            this.filterOutParentHexes('children', this.seasonFilteredChildren)

            this.seasonFilteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.seasonFilteredBase)
          }
          this.setChildFeatures()

        } else if (event === 'click_expand_deselected') {
          // console.log('Need to collapse deselected', ids)

          const parent = ids[0]
          const clickedRes = h3.h3GetResolution(parent)
          // add parent to children layer to keep totally separate from filtered based-hex values
          this.seasonChildren.push(parent)

          const allChildren = h3.h3ToChildren(parent, clickedRes + 1)
          allChildren.forEach((child: string) => {
            // if a child hex is already plotted on the map, remove it from the array
            if (this.seasonChildren.includes(child)) {
              this.removeItemFromArray(this.seasonChildren, child)
            }
            // if a child hex is selected (pink), turn off its selected map state and remove from selected array
            if (this.seasonSelected.includes(child)) {
              this.removeItemFromArray(this.seasonSelected, child)
              this.map.setFeatureState({ source: 'children', id: child }, { selected: false })
            }
          })

          if (source[0] === this.species) {
            this.seasonFilteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.seasonFilteredBase)
          } else {
            this.removeItemFromArray(this.seasonFilteredChildren, parent)
            this.filterOutParentHexes('children', this.seasonFilteredChildren)
            this.seasonFilteredBase.push(...allChildren)
            // TODO STreamline the array within the func, tied to which layer is passed in
            this.filterOutParentHexes(this.species, this.seasonFilteredBase)
          }
          this.setChildFeatures()







        } else if (event === 'click_select') {
          // console.log('Need to click deselect', ids)
          // console.log(source)
          // console.log(this.seasonFilteredBase, this.seasonFilteredBase.includes(ids[0]))
          // // console.log(this.seasonFilteredChildren)
          // console.log(this.seasonChildren, this.seasonFilteredBase.includes(ids[0]))

          const clickSource = this.seasonFilteredBase.includes(ids[0]) ? 'children' : source[0]
          // console.log(this.seasonSelected)
          this.removeItemFromArray(this.seasonSelected, ids[0])
          this.map.setFeatureState({
            source: clickSource,
            ...(clickSource === this.species && { sourceLayer: this.species }),
            id: ids[0]
          }, {selected: false})
        } else if (event === 'click_deselect') {
          // console.log('Need to click select', ids)
          const clickSource = this.seasonFilteredBase.includes(ids[0]) ? 'children' : source[0]

          this.seasonSelected.push(...ids)
          this.map.setFeatureState({
            source: clickSource,
            ...(clickSource === this.species && { sourceLayer: this.species }),
            id: ids[0]
          }, {selected: true})
        }

        // this.clearLastEvent()
      },
      undoTest() {
        this.count++
        // TODO Can lastEvent.ids be made for single id since children is included??
        if (this.actionNumber >= 0) {
          this.undo(this.pastActions[this.actionNumber])
        }

        // remove undone action from list so user can undo an action, perform another, then continue to undo remaining actions
        this.removeItemFromArray(this.pastActions, this.pastActions[this.actionNumber])
      },
      download() {
        // TODO Current setup doesn't save data for seasons that haven't been loaded yet - can be handled by matt?
        // console.log(this.sessionData)
        // console.log(this.sessionData[this.speciesChangeEvent.oldVal])

        const species = this.speciesChangeEvent ? this.speciesChangeEvent.oldVal : this.species
        // console.log(species)

        const formatted: any = {}

        Object.keys(this.sessionData[species]).forEach(season => {
          // console.log(season)
          formatted[season] = this.sessionData[species][season].selected
        })

        // console.log(formatted)


        // console.log('download called')
        const txtFile = new Blob([JSON.stringify(formatted)], { type: 'text/json' });
        const anchorEl = document.createElement('a');
        anchorEl.href = window.URL.createObjectURL(txtFile);
        anchorEl.download = `${species}.json`;
        anchorEl.click();
        // console.log(URL)

        URL.revokeObjectURL(anchorEl.href)
        // console.log(window)
        setTimeout(() => {
          this.exported = true
          this.confirmSpeciesChange = true
        }, 1000)

        // this.exported = true


      },
      save() {
        // console.log(this.seasonSelected)
        if (!this.savedData[this.species]) {
          this.savedData[this.species] = {}
        }

        this.savedData[this.species][this.season] = {
          selected: this.seasonSelected, // TODO SAVE SELECTED DIFFERENCE INSTEAD OF FULL ARR?
          filteredChildren: this.seasonFilteredChildren,
          filteredBase: this.seasonFilteredBase,
          children: this.seasonChildren
        }

        // TODO Add dialog to restore previous season?
        console.log(this.savedData)

      }
    },
  })
</script>

<style>

  html, body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  #map-2 {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 75%;
    padding: 0;
    border-width: 0;
    margin: 0;
    overflow: hidden;
  }

  #sidebar {
    position: absolute;
    /*display: flex;*/
    /*flex-direction: column;*/
    top: 0;
    bottom: 0;
    right: 0;
    width: 25%;
    padding: 1rem
  }

  .select {
    width: 100%;
    height: 30px;
  }

  .mapboxgl-ctrl-group button {
    color: black;
  }
  button {
    border: 1px solid black;
    padding: 0.5rem;
    cursor: pointer;
  }
  button:disabled {
    border-color: #7f828b;
    color: #7f828b;
    cursor: default;
  }

  #selected-ids {
    width: 300px;
    height: 300px;
    white-space: pre-line;
  }
</style>
