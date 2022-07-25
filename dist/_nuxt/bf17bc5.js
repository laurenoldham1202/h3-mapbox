/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[139,39,87],{1011:function(t,e,n){"use strict";n.r(e);var o=n(159),r=n(560),l={components:{CloButton:o.default,CloStat:r.default},data:function(){return{}},props:{results:{type:Array,default:function(){return[]}}}},c=(n(853),n(2)),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",t._l(t.results,(function(e,o){return n("div",{key:o,staticClass:"ResultsStats",class:e.classes},[n("div",{staticClass:"ResultsStats-index"},[t._v(t._s(e.index)+".")]),t._v(" "),n("div",{staticClass:"ResultsStats-title"},[e.specimenHeader?n("div",[n("span",[t._v(t._s(e.specimenHeader.commonName))]),t._v(" "),n("span",[t._v(t._s(e.specimenHeader.sciName))])]):n("div",[t._v(t._s(e.title))])]),t._v(" "),n("div",{staticClass:"ResultsStats-stats"},t._l(e.statsIcons,(function(t,e){return n("div",{key:e,staticClass:"ResultsStats-stats-stat"},[n("CloStat",{attrs:{icon:t.icon,label:t.label,classes:t.classes,stat:t.count}})],1)})),0),t._v(" "),t._l(e.details,(function(e,o){return n("div",{key:o},[n("div",{staticClass:"ResultsStats-details"},[n("span",[t._v(t._s(e.detail))])])])})),t._v(" "),e.action?n("div",{staticClass:"ResultsStats-action"},[n("a",{staticClass:"Button Button--small Button--link",attrs:{href:"#"}},[t._v(t._s(e.action))])]):t._e()],2)})),0)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{CloStat:n(560).default})},473:function(t,e,n){var content=n(476);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(14).default)("b134ce3e",content,!0,{sourceMap:!1})},474:function(t,e,n){"use strict";n.r(e);var o={components:{CloIcon:n(26).default},data:function(){return{}}},r=(n(475),n(2)),component=Object(r.a)(o,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"LoadingAnimation"},[e("CloIcon",{attrs:{symbol:"spinner"}})],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{CloIcon:n(26).default})},475:function(t,e,n){"use strict";n(473)},476:function(t,e,n){var o=n(13)(!1);o.push([t.i,"@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@-webkit-keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.LoadingAnimation{position:absolute;background-color:#fff;top:0;left:0;right:0;bottom:0;padding:0}.LoadingAnimation--inLightbox{background-color:transparent}.LoadingAnimation--inLightbox .Icon{margin:-18px auto 0;fill:#757575}.LoadingAnimation--inLightbox .Icon,.LoadingAnimation--modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.LoadingAnimation--modal{right:auto;bottom:auto;padding:1rem;border-radius:.25rem;transition:opacity 1s ease-out}[dir=rtl] .LoadingAnimation--modal{left:auto;right:0}.LoadingAnimation--modal .Icon{margin:1rem auto!important}.LoadingAnimation--overlay{background-color:hsla(0,0%,100%,.8)}.LoadingAnimation--showMore{position:relative;background-color:transparent}.LoadingAnimation--stacked{text-align:center;background-color:hsla(0,0%,100%,.8);padding:1rem;z-index:100}.LoadingAnimation--stacked .Icon{margin-top:10%;margin-bottom:10%}.no-js .LoadingAnimation{display:none}.LoadingAnimation .Icon{display:block;width:2rem;height:2rem;fill:#228000;margin:2rem auto;-webkit-animation-duration:1.2s;animation-duration:1.2s;-webkit-animation-name:spin;animation-name:spin;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-timing-function:linear;animation-timing-function:linear}.LoadingAnimation--small{position:relative;display:inline;background-color:transparent}.LoadingAnimation--small .Icon{width:1rem;height:1rem;display:inline;margin:0}.LoadingAnimation--inTypeahead{background:none;right:.5rem;top:.5rem;bottom:auto;left:auto}[dir=rtl] .LoadingAnimation--inTypeahead{left:.5rem;right:auto}.LoadingAnimation--inTypeahead .Icon{margin:0;width:1.5rem;height:1.5rem}.LoadingAnimation--basic{position:relative;background-color:transparent}.LoadingAnimation[aria-hidden=true]{visibility:hidden}",""]),t.exports=o},505:function(t,e,n){var content=n(547);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(14).default)("4a3ff7c9",content,!0,{sourceMap:!1})},546:function(t,e,n){"use strict";n(505)},547:function(t,e,n){var o=n(13)(!1);o.push([t.i,"@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.StatsIcon{display:inline-flex;flex-direction:column;color:#2f2f2f}a.StatsIcon{color:#0070b3}a.StatsIcon:active,a.StatsIcon:focus,a.StatsIcon:hover{color:#006aaa}.StatsIcon-stat{display:inline-flex;align-items:center}.StatsIcon-stat-icon{display:flex;align-items:center;margin:0 .5rem 0 0}[dir=rtl] .StatsIcon-stat-icon{margin:0 0 0 .5rem}.StatsIcon-stat-icon .Icon{width:1.5rem;height:1.5rem}.StatsIcon-stat-count{font-size:1.5rem;line-height:1.25;margin-bottom:0;font-weight:700}.StatsIcon-stat-count--sm{font-size:1.13rem;line-height:1.328}.StatsIcon-stat-count--xs{font-size:1rem;line-height:1.5}.StatsIcon-stat-count .LoadingAnimation{padding:.25rem;background-color:transparent;display:flex;justify-content:center;position:relative;top:auto;left:auto;bottom:auto;right:auto}.StatsIcon-stat-count .LoadingAnimation .Icon{display:flex;fill:#d6d6d6;margin:0;width:1.5rem;height:1.5rem}.StatsIcon-label{font-size:.88rem;line-height:1.4205}.StatsIcon-label:not(:last-child){margin:0 0 1px}.StatsIcon-secondary{color:#6a6a6a;font-size:.75rem;line-height:1.333;display:none}@media(min-width:768px){.StatsIcon-secondary{display:unset}}.StatsIcon-secondary--showSmall{display:unset}.StatsIcon-status{align-items:baseline;color:#aa4f09;display:flex;flex-wrap:wrap;font-size:.75rem;line-height:1.333}.StatsIcon-status>*{margin:0 .25rem 0 0}[dir=rtl] .StatsIcon-status>*{margin:0 0 0 .25rem}.StatsIcon-status .Button{font-size:.75rem;line-height:1.333}.StatsIcon--reverse{color:#f8f8f8;border-left-color:#757575}.StatsIcon--reverse .StatsIcon-secondary{color:#d6d6d6}.StatsIcon--reverse .StatsIcon-status{color:#fbcaa6}.StatsIcon--reverse .StatsIcon-status .Button{color:#8ad4ff}.StatsIcon--reverse .StatsIcon-status .Button:active,.StatsIcon--reverse .StatsIcon-status .Button:focus,.StatsIcon--reverse .StatsIcon-status .Button:hover{color:#90d6ff}.StatsIcon--reverse.StatsIcon--highlight{color:#abff8c}.StatsIcon--reverse.StatsIcon--muted{color:#d6d6d6}a.StatsIcon--reverse{color:#8ad4ff}a.StatsIcon--reverse:active,a.StatsIcon--reverse:focus,a.StatsIcon--reverse:hover{color:#90d6ff}a.StatsIcon--reverse.StatsIcon--highlight{color:#abff8c}a.StatsIcon--reverse.StatsIcon--highlight:active,a.StatsIcon--reverse.StatsIcon--highlight:focus,a.StatsIcon--reverse.StatsIcon--highlight:hover{color:#d0ffbf}a.StatsIcon--reverse.StatsIcon--selected,a.StatsIcon--reverse.StatsIcon--selected:active,a.StatsIcon--reverse.StatsIcon--selected:focus,a.StatsIcon--reverse.StatsIcon--selected:hover{color:#abff8c}a.StatsIcon--reverse.StatsIcon--muted{color:#d6d6d6}a.StatsIcon--reverse.StatsIcon--muted:active,a.StatsIcon--reverse.StatsIcon--muted:focus,a.StatsIcon--reverse.StatsIcon--muted:hover{color:#e3e3e3}.StatsIcon--highlight,.StatsIcon--highlight:link,.StatsIcon--highlight:visited{color:#228000}.StatsIcon--highlight:link:active,.StatsIcon--highlight:link:focus,.StatsIcon--highlight:link:hover,.StatsIcon--highlight:visited:active,.StatsIcon--highlight:visited:focus,.StatsIcon--highlight:visited:hover{color:#1b6700}.StatsIcon--muted{color:#6a6a6a}.StatsIcon--muted:link,.StatsIcon--muted:visited{color:#8ad4ff}.StatsIcon--muted:link:hover,.StatsIcon--muted:visited:hover{color:#71cbff}.StatsIcon--selected{pointer-events:none;color:#1b6700}.StatsIcon--selected:link,.StatsIcon--selected:link:active,.StatsIcon--selected:link:focus,.StatsIcon--selected:link:hover,.StatsIcon--selected:visited,.StatsIcon--selected:visited:active,.StatsIcon--selected:visited:focus,.StatsIcon--selected:visited:hover{color:#1b6700}.StatsIcon--sm .StatsIcon-stat-icon{margin:0 .25rem 0 0}[dir=rtl] .StatsIcon--sm .StatsIcon-stat-icon{margin:0 0 0 .25rem}.StatsIcon--sm .StatsIcon-stat-icon .Icon{width:1rem;height:1rem}.StatsIcon--sm .StatsIcon-stat-count{font-size:1.13rem;line-height:1.328}.StatsIcon--sm .StatsIcon-stat-count--sm{font-size:1rem;line-height:1.5}.StatsIcon--sm .StatsIcon-stat-count--xs{font-size:.88rem;line-height:1.4205}.StatsIcon--sm .StatsIcon-stat-count .LoadingAnimation .Icon{width:1rem;height:1rem}.StatsIcon--sm .StatsIcon-label{font-size:.75rem;line-height:1.333}.StatsIcon--sm .StatsIcon-secondary,.StatsIcon--sm .StatsIcon-status,.StatsIcon--sm .StatsIcon-status .Button{font-size:.63rem;line-height:1.19}.StatsIcon--lg .StatsIcon-stat{margin:0 0 .25rem}.StatsIcon--lg .StatsIcon-stat-icon{margin:0 .5rem 0 0}[dir=rtl] .StatsIcon--lg .StatsIcon-stat-icon{margin:0 0 0 .5rem}.StatsIcon--lg .StatsIcon-stat-icon .Icon{width:2rem;height:2rem}.StatsIcon--lg .StatsIcon-stat-count{font-size:2.25rem;line-height:1.1111}.StatsIcon--lg .StatsIcon-stat-count--sm{font-size:1.5rem;line-height:1.25}.StatsIcon--lg .StatsIcon-stat-count--xs{font-size:1.13rem;line-height:1.328}.StatsIcon--lg .StatsIcon-stat-count .LoadingAnimation .Icon{width:2rem;height:2rem}@media(min-width:0px){.StatsIcon--responsive .StatsIcon-stat-icon{margin:0 .25rem 0 0}[dir=rtl] .StatsIcon--responsive .StatsIcon-stat-icon{margin:0 0 0 .25rem}.StatsIcon--responsive .StatsIcon-stat-icon .Icon{width:1rem;height:1rem}.StatsIcon--responsive .StatsIcon-stat-count{font-size:1.13rem;line-height:1.328}.StatsIcon--responsive .StatsIcon-stat-count--sm{font-size:1rem;line-height:1.5}.StatsIcon--responsive .StatsIcon-stat-count--xs{font-size:.88rem;line-height:1.4205}.StatsIcon--responsive .StatsIcon-stat-count .LoadingAnimation .Icon{width:1rem;height:1rem}.StatsIcon--responsive .StatsIcon-label{font-size:.75rem;line-height:1.333}.StatsIcon--responsive .StatsIcon-secondary,.StatsIcon--responsive .StatsIcon-status,.StatsIcon--responsive .StatsIcon-status .Button{font-size:.63rem;line-height:1.19}}@media(min-width:321px){.StatsIcon--responsive .StatsIcon-stat-icon{margin:0 .25rem 0 0}[dir=rtl] .StatsIcon--responsive .StatsIcon-stat-icon{margin:0 0 0 .25rem}.StatsIcon--responsive .StatsIcon-stat-icon .Icon{width:1rem;height:1rem}.StatsIcon--responsive .StatsIcon-stat-count{font-size:1.13rem;line-height:1.328}.StatsIcon--responsive .StatsIcon-stat-count--sm{font-size:1rem;line-height:1.5}.StatsIcon--responsive .StatsIcon-stat-count--xs{font-size:.88rem;line-height:1.4205}.StatsIcon--responsive .StatsIcon-stat-count .LoadingAnimation .Icon{width:1rem;height:1rem}.StatsIcon--responsive .StatsIcon-label{font-size:.75rem;line-height:1.333}.StatsIcon--responsive .StatsIcon-secondary,.StatsIcon--responsive .StatsIcon-status,.StatsIcon--responsive .StatsIcon-status .Button{font-size:.63rem;line-height:1.19}}@media(min-width:1024px){.StatsIcon--responsive .StatsIcon-stat{margin:0 0 .25rem}.StatsIcon--responsive .StatsIcon-stat-icon{margin:0 .5rem 0 0}[dir=rtl] .StatsIcon--responsive .StatsIcon-stat-icon{margin:0 0 0 .5rem}.StatsIcon--responsive .StatsIcon-stat-icon .Icon{width:2rem;height:2rem}.StatsIcon--responsive .StatsIcon-stat-count{font-size:2.25rem;line-height:1.1111}.StatsIcon--responsive .StatsIcon-stat-count--sm{font-size:1.5rem;line-height:1.25}.StatsIcon--responsive .StatsIcon-stat-count--xs{font-size:1.13rem;line-height:1.328}.StatsIcon--responsive .StatsIcon-stat-count .LoadingAnimation .Icon{width:2rem;height:2rem}}@media(min-width:0px){.StatsIcon--responsive-sm .StatsIcon-stat-icon{margin:0 .25rem 0 0}[dir=rtl] .StatsIcon--responsive-sm .StatsIcon-stat-icon{margin:0 0 0 .25rem}.StatsIcon--responsive-sm .StatsIcon-stat-icon .Icon{width:1rem;height:1rem}.StatsIcon--responsive-sm .StatsIcon-stat-count{font-size:1.13rem;line-height:1.328}.StatsIcon--responsive-sm .StatsIcon-stat-count--sm{font-size:1rem;line-height:1.5}.StatsIcon--responsive-sm .StatsIcon-stat-count--xs{font-size:.88rem;line-height:1.4205}.StatsIcon--responsive-sm .StatsIcon-stat-count .LoadingAnimation .Icon{width:1rem;height:1rem}.StatsIcon--responsive-sm .StatsIcon-label{font-size:.75rem;line-height:1.333}.StatsIcon--responsive-sm .StatsIcon-secondary,.StatsIcon--responsive-sm .StatsIcon-status,.StatsIcon--responsive-sm .StatsIcon-status .Button{font-size:.63rem;line-height:1.19}}@media(min-width:321px){.StatsIcon--responsive-sm .StatsIcon-stat-icon{margin:0 .25rem 0 0}[dir=rtl] .StatsIcon--responsive-sm .StatsIcon-stat-icon{margin:0 0 0 .25rem}.StatsIcon--responsive-sm .StatsIcon-stat-icon .Icon{width:1rem;height:1rem}.StatsIcon--responsive-sm .StatsIcon-stat-count{font-size:1.13rem;line-height:1.328}.StatsIcon--responsive-sm .StatsIcon-stat-count--sm{font-size:1rem;line-height:1.5}.StatsIcon--responsive-sm .StatsIcon-stat-count--xs{font-size:.88rem;line-height:1.4205}.StatsIcon--responsive-sm .StatsIcon-stat-count .LoadingAnimation .Icon{width:1rem;height:1rem}.StatsIcon--responsive-sm .StatsIcon-label{font-size:.75rem;line-height:1.333}.StatsIcon--responsive-sm .StatsIcon-secondary,.StatsIcon--responsive-sm .StatsIcon-status,.StatsIcon--responsive-sm .StatsIcon-status .Button{font-size:.63rem;line-height:1.19}}@media(min-width:1024px){.StatsIcon--responsive-lg .StatsIcon-stat{margin:0 0 .25rem}.StatsIcon--responsive-lg .StatsIcon-stat-icon{margin:0 .5rem 0 0}[dir=rtl] .StatsIcon--responsive-lg .StatsIcon-stat-icon{margin:0 0 0 .5rem}.StatsIcon--responsive-lg .StatsIcon-stat-icon .Icon{width:2rem;height:2rem}.StatsIcon--responsive-lg .StatsIcon-stat-count{font-size:2.25rem;line-height:1.1111}.StatsIcon--responsive-lg .StatsIcon-stat-count--sm{font-size:1.5rem;line-height:1.25}.StatsIcon--responsive-lg .StatsIcon-stat-count--xs{font-size:1.13rem;line-height:1.328}.StatsIcon--responsive-lg .StatsIcon-stat-count .LoadingAnimation .Icon{width:2rem;height:2rem}}.StatsIcon--vertical{text-align:center}.StatsIcon--vertical .StatsIcon-stat{flex-direction:column;justify-content:center}.StatsIcon--vertical .StatsIcon-stat .StatsIcon-stat-icon{margin:0}@media(max-width:321px){.StatsIcon--sm-vertical{text-align:center}.StatsIcon--sm-vertical .StatsIcon-stat{flex-direction:column;justify-content:center}.StatsIcon--sm-vertical .StatsIcon-stat .StatsIcon-stat-icon{margin:0}}.StatsIcon--inline{display:inline-flex;flex-direction:row;flex-wrap:wrap;align-items:baseline}.StatsIcon--inline .StatsIcon-stat{margin:0 .5rem 0 0;align-items:baseline}[dir=rtl] .StatsIcon--inline .StatsIcon-stat{margin:0 0 0 .5rem}.StatsIcon--inline .StatsIcon-stat .StatsIcon-stat-icon{align-self:stretch;align-items:center}.StatsIcon--inline .StatsIcon-label,.StatsIcon--inline .StatsIcon-secondary{margin-right:.5em;align-items:baseline}.StatsIcon--inline .StatsIcon-label{font-weight:700}.StatsIcon--inline.StatsIcon--sm .StatsIcon-stat{margin:0 .25rem 0 0}[dir=rtl] .StatsIcon--inline.StatsIcon--sm .StatsIcon-stat{margin:0 0 0 .25rem}.StatsIcon--inline.StatsIcon--lg .StatsIcon-stat{margin:0 .5rem 0 0}[dir=rtl] .StatsIcon--inline.StatsIcon--lg .StatsIcon-stat{margin:0 0 0 .5rem}.StatsIcon--inline.StatsIcon--lg .StatsIcon-label{font-size:1.13rem;line-height:1.328}.StatsIcon--labelAbove .StatsIcon-label{order:-1}",""]),t.exports=o},560:function(t,e,n){"use strict";n.r(e);var o=n(474),r=n(26),l={name:"CloStat",components:{CloLoadingAnimation:o.default,CloIcon:r.default},data:function(){return{}},props:{classes:{type:String,default:""},icon:{type:String,default:""},stat:{type:String,default:""},label:{type:String,default:""},secondary:{type:String,default:""},secondaryLabel:{type:String,default:""},status:{type:String,default:""},loading:{type:Boolean,default:!1}}},c=(n(546),n(2)),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"StatsToolbar-stat"},[n("span",{staticClass:"StatsIcon",class:t.classes},[n("span",{staticClass:"StatsIcon-stat"},[n("span",{staticClass:"StatsIcon-stat-icon"},[n("CloIcon",{attrs:{symbol:t.icon}})],1),t._v(" "),n("span",{staticClass:"StatsIcon-stat-count"},[t._v("\n\t\t\t\t"+t._s(t.stat)+"\n\t\t\t\t"),t.loading?n("span",{staticClass:"LoadingAnimation"},[n("CloIcon",{attrs:{symbol:t.icon}})],1):t._e()])]),t._v(" "),n("span",{staticClass:"StatsIcon-label"},[t._v(t._s(t.label))]),t._v(" "),t.secondary?n("span",{staticClass:"StatsIcon-secondary"},[t._v(t._s(t.secondary)+" "+t._s(t.secondaryLabel))]):t._e(),t._v(" "),t.status?n("span",{staticClass:"StatsIcon-status"},[n("span",[t._v(t._s(t.status))])]):t._e()])])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{CloIcon:n(26).default})},678:function(t,e,n){var content=n(854);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(14).default)("5a917448",content,!0,{sourceMap:!1})},853:function(t,e,n){"use strict";n(678)},854:function(t,e,n){var o=n(13)(!1);o.push([t.i,'@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.ResultsStats{display:block;position:relative;border-top:1px solid #f1f1f1;padding:.5rem 1rem;display:flex;flex-wrap:wrap;align-items:baseline}@supports(grid-area:x){.ResultsStats{display:grid;grid-template-columns:auto 1fr;grid-template-areas:"index\ttitle" "blank\tstats" "blank\tdetails";grid-column-gap:.5rem;grid-row-gap:.25rem;align-items:baseline}@media(min-width:768px){.ResultsStats{grid-template-columns:auto 1fr 1fr 1fr;grid-template-areas:"index\ttitle\tstats\tdetails"}}}.ResultsStats-index{font-size:.75rem;line-height:1.333;margin:0 .5rem .25rem 0;display:inline-block;color:#6a6a6a;text-align:right;vertical-align:middle;min-width:1.4rem}[dir=rtl] .ResultsStats-index{margin-right:0;margin-left:.5rem}@supports(grid-area:x){.ResultsStats-index{grid-area:index;padding:0;margin:0!important}}.ResultsStats-title{margin:0 0 .25rem;display:inline-block;vertical-align:middle;word-wrap:break-word;word-break:break-word;-webkit-hyphens:none;-ms-hyphens:none;hyphens:none;display:flex;align-items:baseline;flex:1 1 auto}.ResultsStats-title h1,.ResultsStats-title h2,.ResultsStats-title h3,.ResultsStats-title h4,.ResultsStats-title h5,.ResultsStats-title h6{display:inline-block;line-height:1.4;margin:0}.ResultsStats-title .SpecimenHeader,.ResultsStats-title .SpecimenHeader>a{display:flex}@supports(grid-area:x){.ResultsStats-title{grid-area:title;margin:0}}.ResultsStats-stats{display:block;margin:0 0 .25rem 2rem;flex:1 1 100%;display:flex}[dir=rtl] .ResultsStats-stats{margin-left:0;margin-right:2rem}.ResultsStats-stats .StatsIcon-stat-icon .Icon{opacity:.25}.ResultsStats-stats .ResultsStats-stats-stat{display:flex;flex-direction:column}.ResultsStats-stats .StatsIcon{flex:1 1 auto}@media(min-width:768px){.ResultsStats-stats,.ResultsStats-stats>*{flex:1 1 auto}}@supports(grid-area:x){.ResultsStats-stats{grid-area:stats;margin:0;flex:0 1 auto;display:grid;align-items:center;grid-auto-flow:column;grid-template-columns:1fr;grid-auto-columns:1fr;grid-column-gap:.5rem}}@supports(display:flex){.ResultsStats-stats--right{justify-content:flex-end}}@supports(grid-area:x){.ResultsStats-stats--right{justify-items:end}}.ResultsStats-details{font-size:.75rem;line-height:1.333;display:block;margin:0 0 .25rem 2rem;color:#6a6a6a;flex:1 1 auto;display:flex}[dir=rtl] .ResultsStats-details{margin-left:0;margin-right:2rem}@media(min-width:768px){.ResultsStats-details,.ResultsStats-details>*{flex:1 1 auto}}@supports(grid-area:x){.ResultsStats-details{grid-area:details;margin:0;display:grid;align-items:baseline}@media(min-width:768px){.ResultsStats-details{grid-auto-flow:column;grid-template-columns:1fr;grid-auto-columns:1fr;grid-column-gap:.5rem}}}.ResultsStats-action{display:block;margin-left:2rem;align-self:center}[dir=rtl] .ResultsStats-action{margin-left:0;margin-right:2rem}@supports(grid-area:x){.ResultsStats-action{grid-area:action;margin:0;display:grid;align-items:baseline}@media(min-width:768px){.ResultsStats-action{grid-auto-flow:column;grid-template-columns:1fr;grid-auto-columns:1fr;grid-column-gap:.5rem}}}.ResultsStats--highlight{background-color:#fffcd9!important}.ResultsStats--highlightMuted{background-color:#f8f8f8!important}.ResultsStats--highlightAction{background-color:#e3f6db!important}.ResultsStats--alternatingRows{border-color:transparent}.ResultsStats--alternatingRows:nth-child(odd){background-color:#f8f8f8}.ResultsStats--tight{padding:.25rem .5rem}.ResultsStats--toEdge{margin:0 -1rem}@media(min-width:768px){.ResultsStats--toEdge{margin:0}}@supports(grid-area:x){.ResultsStats--action{grid-template-columns:auto 1fr auto;grid-template-areas:"index\ttitle\ttitle" "blank\tstats\taction"}@media(min-width:768px){.ResultsStats--action{grid-template-columns:auto 1fr 1fr auto;grid-template-areas:"index\ttitle\tstats\taction"}}}@supports(grid-area:x){.ResultsStats--statsTop{grid-template-columns:auto 1fr 1fr;grid-template-areas:"index\ttitle\tstats" "blank\tdetails\tdetails"}@media(min-width:768px){.ResultsStats--statsTop{grid-template-columns:auto 1fr 1fr 1fr;grid-template-areas:"index\ttitle\tstats\tdetails"}}}@supports(grid-area:x){.ResultsStats--statsBottom{grid-template-columns:auto 1fr 1fr;grid-template-areas:"index\ttitle\ttitle" "blank\tdetails\tstats"}@media(min-width:768px){.ResultsStats--statsBottom{grid-template-columns:auto 1fr 1fr 1fr;grid-template-areas:"index\ttitle\tstats\tdetails"}}}@supports(grid-area:x){.ResultsStats--statsOnly{grid-column-gap:1rem;grid-template-columns:1fr;grid-template-areas:"title" "stats"}@media(min-width:768px){.ResultsStats--statsOnly{grid-template-columns:1fr 2fr;grid-template-areas:"title\tstats"}}}.ResultsStats--status{padding:.25rem .5rem}@supports(grid-area:x){.ResultsStats--status{grid-template-columns:1fr 1fr;grid-template-areas:"title\ttitle" "details\tstats";align-items:start}@media(min-width:768px){.ResultsStats--status{grid-template-columns:1fr 1fr 1fr;grid-template-areas:"title\tstats\tdetails";align-items:baseline}.ResultsStats--status .ResultsStats-stats{align-self:center}}.ResultsStats--status .ResultsStats-details,.ResultsStats--status .ResultsStats-stats{grid-column-gap:.25rem}}.ResultsStats--header{align-items:end!important;color:#6a6a6a;font-size:.75rem;line-height:1.333;padding-top:.25rem;padding-bottom:.25rem;border-color:transparent}.ResultsStats--header .ResultsStats-details,.ResultsStats--header .ResultsStats-title{display:none}.ResultsStats--header .ResultsStats-details,.ResultsStats--header .ResultsStats-stats{align-self:end;align-items:end}@media(min-width:768px){.ResultsStats--header .ResultsStats-details,.ResultsStats--header .ResultsStats-title{display:flex}@supports(grid-area:x){.ResultsStats--header .ResultsStats-details,.ResultsStats--header .ResultsStats-title{display:grid}}}',""]),t.exports=o}}]);