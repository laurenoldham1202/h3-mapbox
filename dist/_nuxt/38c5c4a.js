/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{1044:function(t,n,e){"use strict";e.r(n);var r={name:"CloTabsButton",data:function(){return{index:null}},methods:{left:function(){this.$parent.activeTab=this.index-1},right:function(){this.$parent.activeTab=this.index+1}}},l=e(2),component=Object(l.a)(r,(function(){var t=this,n=t.$createElement;return(t._self._c||n)("button",{staticClass:"Tabs-button",attrs:{role:"tab",id:"tab-"+t.$parent.guid+"-"+t.index,"aria-controls":"tabpanel-"+t.$parent.guid+"-"+t.index,"aria-selected":t.$parent.activeTab===t.index,tabindex:t.$parent.activeTab!==t.index?-1:0},on:{click:function(n){t.$parent.activeTab=t.index},keyup:[function(n){return!n.type.indexOf("key")&&t._k(n.keyCode,"left",37,n.key,["Left","ArrowLeft"])||"button"in n&&0!==n.button?null:t.left.apply(null,arguments)},function(n){return!n.type.indexOf("key")&&t._k(n.keyCode,"right",39,n.key,["Right","ArrowRight"])||"button"in n&&2!==n.button?null:t.right.apply(null,arguments)}]}},[t._t("default")],2)}),[],!1,null,null,null);n.default=component.exports}}]);