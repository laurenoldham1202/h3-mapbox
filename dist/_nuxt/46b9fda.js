(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{249:function(e,t,r){var content=r(252);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(132).default)("649da689",content,!0,{sourceMap:!1})},251:function(e,t,r){"use strict";r(249)},252:function(e,t,r){var o=r(131)(!1);o.push([e.i,"#map-2{width:1000px;height:800px;background:purple}.mapboxgl-ctrl-group button{color:#000}button{border:1px solid #000;padding:.5rem}button:disabled{border-color:#7f828b;color:#7f828b}.alert{background:red}button{cursor:pointer}",""]),e.exports=o},275:function(e,t,r){"use strict";r.r(t);r(44),r(33),r(74),r(75);var o=r(276),n=r(30),c=(r(45),r(19),r(72),r(73),r(43),r(34),r(58),r(35),r(253),r(255),r(256),r(257),r(258),r(259),r(260),r(261),r(262),r(263),r(264),r(265),r(266),r(267),r(268),r(269),r(270),r(36),r(179),r(1)),d=r(271),l=r(272),h=r.n(l),f=r(250),m=(r(273),r(277));function y(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function x(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?y(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):y(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var v=c.a.extend({data:function(){return{map:void 0,coords:{lng:-96.35,lat:37},selectMode:!0,rangeOnly:!1,resolution:3,draw:void 0,filtered:[],children:[],selected:[]}},watch:{rangeOnly:function(){},selected:function(e){}},mounted:function(){var e=this;d.accessToken="pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA",this.map=new d.Map({container:"map-2",style:"mapbox://styles/mapbox/streets-v11",center:this.coords,zoom:2,doubleClickZoom:!1}),this.map.addControl(new d.ScaleControl({maxWidth:900})),this.map.on("load",(function(){e.map.addSource("base-hex",{type:"vector",promoteId:"h3_address",tiles:["https://test.cdn.shorebirdviz.ebird.org/range-map/test-2/{z}/{x}/{y}.pbf"],maxzoom:4}),e.map.addLayer({id:"base-hex",source:"base-hex","source-layer":"hex",type:"fill",paint:{"fill-color":["case",["boolean",["feature-state","selected"],["get","isRange"]],"deeppink","black"],"fill-opacity":.3}}),e.map.addSource("children",{type:"geojson",data:{type:"FeatureCollection",features:[]},promoteId:"h3_address"}),e.map.addLayer({id:"children",source:"children",type:"fill",paint:{"fill-opacity":.3,"fill-color":["case",["boolean",["feature-state","selected"],!1],"deeppink","black"]},layout:{"fill-sort-key":["+",["get","h3_address"]]}}),e.map.addSource("species-range",{type:"vector",tiles:["http://localhost:8082/data/range-outline-max-6/{z}/{x}/{y}.pbf"],maxzoom:7,promoteId:"h3_address"}),e.map.on("contextmenu",(function(t){var r=e.map.queryRenderedFeatures(t.point,{layers:["children"]})[0],n=e.map.queryRenderedFeatures(t.point,{layers:["species-range"]})[0];if(console.log(n),r){var c=parseInt(r.id[1])-1,d=f.h3ToParent(r.id,c);e.arrayIncludesItem(e.filtered,d)&&e.removeItemFromArray(e.filtered,d);var l=3===c?"base-hex":r.source;e.filterOutParentHexes(l),e.map.setFeatureState(x(x({source:l},"base-hex"===l&&{sourceLayer:"hex"}),{},{id:d}),{selected:e.arrayIncludesItem(e.selected,r.id)}),e.arrayIncludesItem(e.selected,r.id)&&e.selected.push(d);var h=[];[3,4,5,6].forEach((function(e){e>=c+1&&h.push.apply(h,Object(o.a)(f.h3ToChildren(d,e)))})),h.forEach((function(t){e.children.includes(t)&&e.removeItemFromArray(e.children,t),e.selected.includes(t)&&(e.removeItemFromArray(e.selected,t),e.map.setFeatureState({source:"children",id:t},{selected:!1}))})),e.setChildFeatures()}})),e.map.on("click",["base-hex","children","species-range"],(function(t){if(t.features.map((function(e){return e.layer.id})).includes("species-range")){var r=t.features.filter((function(e){return"species-range"===e.layer.id}))[0];e.selectMode?void 0===r.state.selected?e.map.setFeatureState({source:r.source,sourceLayer:r.sourceLayer,id:r.id},{selected:!1}):e.map.setFeatureState({source:r.source,sourceLayer:r.sourceLayer,id:r.id},{selected:!r.state.selected}):console.log("explode",r.id)}else{var n=t.features[0],c=parseInt(n.id[1])+1,d=4===c?"base-hex":n.source;if(e.selectMode)e.map.setFeatureState(x(x({source:d},"base-hex"===d&&{sourceLayer:"hex"}),{},{id:n.id}),{selected:!n.state.selected}),e.updateSelected(n);else if(c<=6){var l,h=f.h3ToChildren(n.id,c);(l=e.children).push.apply(l,Object(o.a)(h)),e.setChildFeatures(),e.filtered.push(n.id);var m=e.arrayIncludesItem(e.selected,n.id);h.forEach((function(t){m&&(e.map.setFeatureState({source:"children",id:t},{selected:!0}),e.selected.push(t)),e.filtered.includes(t)&&e.removeItemFromArray(e.filtered,t)})),m&&(e.map.setFeatureState(x(x({source:d},"base-hex"===d&&{sourceLayer:"hex"}),{},{id:n.id}),{selected:!1}),e.removeItemFromArray(e.selected,n.id));["base-hex","children"].forEach((function(t){e.filterOutParentHexes(t)}))}}}));var t=new d.Popup({closeButton:!1});e.map.on("mousemove",["base-hex","children"],(function(r){t.setHTML(r.features[0].id).setLngLat(r.lngLat).addTo(e.map)}))}))},methods:{uniqueValues:function(e){return Array.from(new Set(e))},setChildFeatures:function(){this.children=this.uniqueValues(this.children);var e=h.a.h3SetToFeatureCollection(this.children,(function(e){return{h3_address:e}}));this.map.getSource("children").setData(e)},filterOutParentHexes:function(e){this.map.setFilter(e,this.filtered.length?["match",["get","h3_address"],this.filtered,!1,!0]:null)},removeItemFromArray:function(e,t){e.splice(e.indexOf(t),1)},arrayIncludesItem:function(e,t){return e.includes(t)},updateSelected:function(e){e.state.selected?this.removeItemFromArray(this.selected,e.id):this.selected.push(e.id)},getChildrenHexes:function(e,t){var r=[];return e.forEach((function(e){r.push.apply(r,Object(o.a)(f.h3ToChildren(e,t)))})),r},bboxToPixel:function(polygon){var e=Object(m.a)(polygon),t=this.map.project([e[2],e[3]]);return[this.map.project([e[0],e[1]]),t]}}}),O=(r(251),r(47)),component=Object(O.a)(v,(function(){var e=this,t=e._self._c;e._self._setupProxy;return t("span",[t("button",{on:{click:function(t){e.selectMode=!e.selectMode}}},[e._v("Selection mode: "+e._s(e.selectMode))]),e._v(" "),t("div",{attrs:{id:"map-2"}})])}),[],!1,null,null,null);t.default=component.exports}}]);