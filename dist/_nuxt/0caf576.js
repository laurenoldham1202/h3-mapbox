/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[64],{618:function(t,o,e){"use strict";e.r(o);e(41),e(36);var n={name:"CloMapGoogleGeoJson",props:{google:{type:Object,required:!0},map:{type:Object,required:!0},path:{type:Array,required:!0}},data:function(){return{}},computed:{geoJson:function(){for(var t=[],i=0;i<this.path.length;i+=2)t.push([this.path[i],this.path[i+1]]);return t}},mounted:function(){var t={type:"Feature",properties:{},geometry:{type:"LineString",coordinates:this.geoJson}};this.map.data.setStyle({strokeColor:"#2c75c9",strokeWeight:8}),this.map.data.addGeoJson(t);var o=new this.google.maps.LatLngBounds;this.geoJson.forEach((function(t){o.extend({lat:t[1],lng:t[0]})})),this.map.fitBounds(o),new this.google.maps.Marker({position:{lat:this.geoJson[0][1],lng:this.geoJson[0][0]},map:this.map,icon:{path:google.maps.SymbolPath.CIRCLE,strokeColor:"#2c75c9",strokeWeight:2,fillColor:"#ffffff",fillOpacity:1,scale:10}}),new this.google.maps.Marker({position:{lat:this.geoJson[this.geoJson.length-1][1],lng:this.geoJson[this.geoJson.length-1][0]},map:this.map,icon:{path:google.maps.SymbolPath.CIRCLE,strokeColor:"#ffffff",strokeWeight:3,fillColor:"#2c75c9",fillOpacity:1,scale:7}})}},r=e(2),component=Object(r.a)(n,(function(){var t=this.$createElement;return(this._self._c||t)("div")}),[],!1,null,null,null);o.default=component.exports}}]);