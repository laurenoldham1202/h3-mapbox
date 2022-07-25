/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[93,24],{504:function(e,t,n){var content=n(536);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(14).default)("27e360c2",content,!0,{sourceMap:!1})},535:function(e,t,n){"use strict";n(504)},536:function(e,t,n){var o=n(13)(!1);o.push([e.i,"@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.Divider{box-sizing:content-box;height:0;border:1px solid #d6d6d6;border-right:0;border-top:0;border-left:0;margin:1rem 0}.Divider--light{border-color:#f1f1f1}.Divider--reverse{border-color:#6a6a6a}.Divider--flush{margin:0}.Divider--sm{margin:.5rem 0}.Divider--lg{margin:2rem 0}",""]),e.exports=o},558:function(e,t,n){"use strict";n.r(t);var o={data:function(){return{}},computed:{classes:function(){return{"Divider--reverse":this.reverse,"Divider--light":this.light,"Divider--flush":this.flush,"Divider--sm":"sm"===this.size,"Divider--lg":"lg"===this.size}}},props:{reverse:{type:Boolean,default:!1},light:{type:Boolean,default:!1},flush:{type:Boolean,default:!1},size:{type:String,default:null}}},l=(n(535),n(2)),component=Object(l.a)(o,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("hr",{staticClass:"Divider",class:e.classes})}),[],!1,null,null,null);t.default=component.exports},620:function(e,t,n){"use strict";n.r(t);var o=n(26),l=n(558),r=n(158),d=n(229),c=n(117),f={name:"CloTaxonomyTreeDialog",components:{CloIcon:o.default,CloDivider:l.default,CloHeading:r.default,CloGridFlex:d.default,CloGridFlexCell:c.default},props:{speciesInfo:{type:Object,required:!0},translations:{type:Object,default:function(){return{}}}},methods:{toggleDef:function(e,t,n){null!==n?this.$set(this.speciesInfo.subTaxa[t].subTaxa[n].definitions[e],"show",!this.speciesInfo.subTaxa[t].subTaxa[n].definitions[e].show):null!==t?this.$set(this.speciesInfo.subTaxa[t].definitions[e],"show",!this.speciesInfo.subTaxa[t].definitions[e].show):this.$set(this.speciesInfo.definitions[e],"show",!this.speciesInfo.definitions[e].show),this.$forceUpdate()}}},_=n(2),component=Object(_.a)(f,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.speciesInfo.definitions?[n("h2",{staticClass:"Heading Heading--h5 Heading--minor u-stack-md"},[e._v(e._s(e.translations.definitions))]),e._v(" "),n("dl",{staticClass:"TaxonomyTree-definitions"},[e._l(e.speciesInfo.definitions,(function(t,o){return[n("dt",{key:"defterm-"+o},[t.seeAlso?n("button",{staticClass:"TaxonomyTree-definitions-seeAlso",class:{show:t.show},on:{click:function(t){return e.toggleDef(o,null,null)}}},[n("CloIcon",{staticClass:"u-inline-xs",attrs:{symbol:"triangleDown",size:"sm"}}),e._v(" "),n("span",[e._v(e._s(t.searchTerm)+" (See: "+e._s(t.defTerms)+")")])],1):e._e(),e._v(" "),t.seeAlso&&t.show?n("span",[e._v(e._s(t.defTerms))]):e._e(),e._v(" "),t.seeAlso?e._e():n("span",[e._v(e._s(t.defTerms))])]),e._v(" "),!t.seeAlso||t.show?n("dd",{key:"def-"+o,domProps:{innerHTML:e._s(t.definition)}}):e._e()]}))],2),e._v(" "),n("hr",{staticClass:"Divider Divider--sm Divider--light"})]:e._e(),e._v(" "),e.speciesInfo.subTaxa?[n("h2",{staticClass:"Heading Heading--h5 Heading--minor u-stack-md"},[e._v(e._s(e.translations.subspecies))]),e._v(" "),n("ol",e._l(e.speciesInfo.subTaxa,(function(t,o){return n("li",{key:t.taxonCode},[t.missingFromEbird?n("div",{staticClass:"Heading Heading--h5 u-stack-sm"},[n("span",{staticClass:"Heading-sub--inline Heading-sub--sci"},[e._v(e._s(t.sciName))])]):n("div",{staticClass:"Heading Heading--h5 u-stack-sm"},[n("span",{staticClass:"Heading-main",staticStyle:{"line-height":"1.1"}},[e._v(e._s(t.comName))]),e._v(" "),n("span",{staticClass:"Heading-sub Heading-sub--inline Heading-sub--sci"},[e._v(e._s(t.sciName))]),e._v(" "),"subspecies_group"===t.category?n("span",{staticClass:"TaxonomyTree-subspeciesLabel"},[e._v("\n\t\t\t\t\t\t"+e._s(e.translations.polytypic)+"\n\t\t\t\t\t")]):n("span",{staticClass:"TaxonomyTree-subspeciesLabel"},[e._v("\n\t\t\t\t\t\t"+e._s(e.translations.monotypic)+"\n\t\t\t\t\t")])]),e._v(" "),"subspecies_group"!==t.category?n("div",{staticClass:"u-stack-sm"},[t.definitions?[n("dl",{staticClass:"TaxonomyTree-definitions TaxonomyTree-definitions--indented"},[e._l(t.definitions,(function(t,l){return[n("dt",{key:"defterm-"+l},[t.seeAlso?n("button",{staticClass:"TaxonomyTree-definitions-seeAlso",class:{show:t.show},on:{click:function(t){return e.toggleDef(l,o,null)}}},[n("CloIcon",{staticClass:"u-inline-xs",attrs:{symbol:"triangleDown",size:"sm"}}),e._v(" "),n("span",[e._v(e._s(t.searchTerm)+" (See: "+e._s(t.defTerms)+")")])],1):e._e(),e._v(" "),t.show?n("span",[e._v(e._s(t.defTerms))]):e._e(),e._v(" "),t.seeAlso?e._e():n("span",[e._v(e._s(t.defTerms))])]),e._v(" "),!t.seeAlso||t.show?n("dd",{key:"def-"+l,domProps:{innerHTML:e._s(t.definition)}}):e._e()]}))],2)]:e._e()],2):e._e(),e._v(" "),t.subTaxa?n("ol",e._l(t.subTaxa,(function(t,l){return n("li",{key:t.taxonCode},[n("div",{staticClass:"Heading Heading--h5 u-stack-sm"},[n("span",{staticClass:"Heading-sub--inline Heading-sub--sci"},[e._v(e._s(t.sciName))])]),e._v(" "),t.definitions?[n("dl",{staticClass:"TaxonomyTree-definitions"},[e._l(t.definitions,(function(t,r){return[n("dt",{key:"defterm-"+r},[t.seeAlso?n("button",{staticClass:"TaxonomyTree-definitions-seeAlso",class:{show:t.show},on:{click:function(t){return e.toggleDef(r,o,l)}}},[n("CloIcon",{staticClass:"u-inline-xs",attrs:{symbol:"triangleDown",size:"sm"}}),e._v(" "),n("span",[e._v(e._s(t.searchTerm)+" (See: "+e._s(t.defTerms)+")")])],1):e._e(),e._v(" "),t.show?n("span",[e._v(e._s(t.defTerms))]):e._e(),e._v(" "),t.seeAlso?e._e():n("span",[e._v(e._s(t.defTerms))])]),e._v(" "),!t.seeAlso||t.show?n("dd",{key:"def-"+r,domProps:{innerHTML:e._s(t.definition)}}):e._e()]}))],2)]:e._e()],2)})),0):e._e()])})),0)]:n("div",{staticClass:"Heading Heading--h5 Heading--minor"},[e._v("Monotypic")])],2)}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{CloIcon:n(26).default})}}]);