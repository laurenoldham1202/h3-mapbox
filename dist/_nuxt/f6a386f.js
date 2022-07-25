/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[22,16],{1049:function(t,e,r){"use strict";r.r(e);r(15);var o={components:{CloBadge:r(523).default},data:function(){return{}},props:{status:Array,reverse:{type:Boolean,default:!1},size:{type:String,default:""}},computed:{classes:function(){var t=[],e="ConservationStatus--";return this.size&&t.push(e+this.size),this.reverse&&t.push(e+"reverse"),t.join(" ")},badgeClasses:function(){var t=[];return"sm"===this.size&&t.push("Badge--tiny"),t.join(" ")}}},n=(r(931),r(2)),component=Object(n.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("table",{staticClass:"ConservationStatus",class:t.classes},[t._m(0),t._v(" "),r("tr",{staticClass:"ConservationStatus-heading",attrs:{"aria-hidden":!0}},[r("td",{attrs:{colspan:"2"}}),t._v(" "),t._m(1)]),t._v(" "),t._l(t.status,(function(e){return r("tbody",{key:e.code},[r("tr",[r("th",{staticClass:"ConservationStatus-status",attrs:{scope:"row"}},[t._v(t._s(e.label))]),t._v(" "),r("td",{staticClass:"ConservationStatus-badge",attrs:{"aria-hidden":!0}},["unk"!==e.code?r("span",{class:"Badge Badge--small u-color-constatus-"+e.code+" "+t.badgeClasses},[r("span",{staticClass:"Badge-label"},[t._v(t._s(e.code))])]):t._e()]),t._v(" "),r("td",{staticClass:"ConservationStatus-percent"},[r("div",{staticClass:"ConservationStatus-percent-wrapper"},[r("div",{class:"ConservationStatus-percent-bar u-color-constatus-"+e.code,style:"width:"+e.percentage+"%"},[r("span",{staticClass:"ConservationStatus-percent-label",class:e.percentage>70?"ConservationStatus-percent-label--inside":"ConservationStatus-percent-label--outside"},[t._v(t._s(e.percentage)+"%")])])])])])])}))],2)}),[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("caption",[r("span",{staticClass:"is-visuallyHidden"},[t._v("Conservation status")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("td",{staticClass:"ConservationStatus-percent"},[r("div",{staticClass:"ConservationStatus-percent-heading"},[r("span",[t._v("0%")]),t._v(" "),r("span",[t._v("100%")])])])}],!1,null,null,null);e.default=component.exports},499:function(t,e,r){var content=r(519);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("777a2db8",content,!0,{sourceMap:!1})},518:function(t,e,r){"use strict";r(499)},519:function(t,e,r){var o=r(13)(!1);o.push([t.i,"@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.Badge{display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;color:#fff;background-color:#212121;font-size:.88rem;line-height:1.4205;font-weight:700;border-radius:10rem;padding:.1rem .6rem .2rem}.Badge .Icon{width:.88rem;height:.88rem;align-self:center}.Badge .Icon:not(:last-child){margin:0 .25rem 0 0}[dir=rtl] .Badge .Icon:not(:last-child){margin:0 0 0 .25rem}.Badge-label:not(:last-child){margin:0 .25rem 0 0}[dir=rtl] .Badge-label:not(:last-child){margin:0 0 0 .25rem}.Badge--small{font-size:.75rem;line-height:1.333;padding-left:.5rem;padding-right:.5rem}.Badge--small .Icon{width:.75rem;height:.75rem}.Badge--tiny{font-size:.63rem;line-height:1.19;padding-left:.4rem;padding-right:.4rem}.Badge--tiny .Icon{width:.63rem;height:.63rem}.Badge--large{font-size:1rem;line-height:1.5;padding:.5rem 1rem}.Badge--large .Icon{width:.75rem;height:.75rem}.Badge--new{background-color:#228000}.Badge--alert{background-color:#bd580a}.Badge--error{background-color:#cc3340}.Badge--neutral{background-color:#f1f1f1;color:#6a6a6a}.Badge--plain{background-color:transparent;font-weight:400;color:#000;color:initial;padding:0}.Badge--plain.Badge--neutral{color:#6a6a6a}.Badge--plain.Badge--new{color:#1c6900}.Badge--plain.Badge--alert{color:#aa4f09}.Badge--plain.Badge--error{color:#b82e39}.Badge--circle{background-color:transparent;font-size:.75rem;line-height:1.333;text-align:center;font-weight:700;min-width:1.5rem;min-height:1.5rem;border-radius:50%;border:1px solid #6a6a6a;padding:0}.Badge--circle.Badge--circleTiny{font-size:.63rem;line-height:1.19;min-width:.85rem;min-height:.85rem}.Badge--circle.Badge--circledNumber{color:#6a6a6a}.Badge--circle.Badge--circleFilled{color:#fff}.Badge--circle.Badge--circleFilled.Badge--circleFilled-new,.Badge--circle.Badge--circleFilled.Badge--new{background-color:#228000;border-color:#228000}.Badge--circle.Badge--circleFilled.Badge--alert,.Badge--circle.Badge--circleFilled.Badge--circleFilled-alert,.Badge--circle.Badge--circleFilled.Badge--circleFilled-error,.Badge--circle.Badge--circleFilled.Badge--error{background-color:#bd580a;border-color:#bd580a}.Badge--circle.Badge--circleFilled.Badge--circleFilled-lightBlue,.Badge--circle.Badge--circleFilled.Badge--lightBlue{background-color:#8ad4ff;border-color:#8ad4ff}.Badge--circle.Badge--circleFilled.Badge--circleFilled-mediumBlue,.Badge--circle.Badge--circleFilled.Badge--mediumBlue{background-color:#007bc2;border-color:#007bc2}.Badge--fixed{position:absolute;border-radius:3px;top:0;right:50%;transform:translate(50%,-50%)}[dir=rtl] .Badge--fixed{right:auto!important;left:0}.Badge--fixed--right{right:0;transform:translate(.5rem,-50%)}@media(min-width:768px){.Badge--fixed--md-right{right:0;transform:translate(.5rem,-50%)}}@media(min-width:1024px){.Badge--fixed--lg-right{right:0;transform:translate(.5rem,-50%)}}.Badge--exoticNaturalized{color:#6a6a6a;border-radius:50%;border:1px solid #f1f1f1}.Badge--exoticNaturalized,.Badge--exoticProvisional{background-color:#f1f1f1;font-size:.75rem;line-height:1.333;line-height:1;text-align:center;width:1.25rem;height:1.25rem;padding:0}.Badge--exoticProvisional{color:#6a6a6a;border-radius:50%;background-color:#f9eee6;color:#aa4f09;border:1px solid #aa4f09}.Badge--exoticNotEstablished{background-color:#f1f1f1;color:#6a6a6a;font-size:.75rem;line-height:1.333;line-height:1;text-align:center;width:1.25rem;height:1.25rem;border-radius:50%;padding:0;background-color:#cc3340;color:#fff;border:1px solid #cc3340}.Badge.u-color-constatus-lc{color:#232323;background-color:#68bb53}.Badge.u-color-constatus-nt{color:#232323;background-color:#d1e744}.Badge.u-color-constatus-vu{color:#232323;background-color:#e5d42d}.Badge.u-color-constatus-en{color:#232323;background-color:#e77b4d}.Badge.u-color-constatus-cr{background-color:#b61917}.Badge.u-color-constatus-ex{background-color:#000}.Badge.u-color-constatus-ew{background-color:#542344}.Badge.u-color-constatus-dd{background-color:#595959}.Badge.u-color-constatus-ne{color:#232323;background-color:#ccc}",""]),t.exports=o},523:function(t,e,r){"use strict";r.r(e);var o={components:{CloIcon:r(26).default},data:function(){return{}},props:{icon:{type:String,default:null},circle:{type:String,default:null},size:{type:String,default:null},state:{type:String,default:null}},computed:{classes:function(){var t={"Badge--tiny":"xs"===this.size,"Badge--small":"sm"===this.size,"Badge--large":"lg"===this.size,"Badge--circle":this.circle,"Badge--new":"new"===this.state,"Badge--alert":"alert"===this.state,"Badge--error":"error"===this.state,"Badge--plain":"plain"===this.state,"Badge--lightBlue":"lightBlue"===this.state,"Badge--mediumBlue":"mediumBlue"===this.state,"Badge--circleFilled":"filled"===this.circle,"Badge--circledNumber":"number"===this.circle};return t}}},n=(r(518),r(2)),component=Object(n.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"Badge",class:t.classes},[t.icon?r("CloIcon",{attrs:{symbol:t.icon}}):t._e(),t._v(" "),r("span",{staticClass:"Badge-label"},[t._t("default")],2)],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{CloIcon:r(26).default})},720:function(t,e,r){var content=r(932);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("c9becaf4",content,!0,{sourceMap:!1})},931:function(t,e,r){"use strict";r(720)},932:function(t,e,r){var o=r(13)(!1);o.push([t.i,"@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.ConservationStatus{font-size:.88rem;line-height:1.4205;margin:0 0 .5rem;background-color:transparent;max-width:100%}.ConservationStatus caption{font-weight:400;padding:0}.ConservationStatus tbody,.ConservationStatus tfoot,.ConservationStatus thead{background-color:transparent;border:none}.ConservationStatus tbody tr:nth-of-type(2n){background-color:transparent}.ConservationStatus td,.ConservationStatus th{font-weight:400;padding:1px .5rem}.ConservationStatus th{text-align:left}[dir=rtl] .ConservationStatus th{text-align:right}.ConservationStatus td:first-child,.ConservationStatus th:first-child{padding-left:0}[dir=rtl] .ConservationStatus td:first-child,[dir=rtl] .ConservationStatus th:first-child{padding-left:.5rem;padding-right:0}.ConservationStatus td:last-child,.ConservationStatus th:last-child{padding-right:0}[dir=rtl] .ConservationStatus td:last-child,[dir=rtl] .ConservationStatus th:last-child{padding-left:0;padding-right:.5rem}.ConservationStatus tr:last-child .ConservationStatus-status{border-bottom:none}th.ConservationStatus-status{width:1%;white-space:nowrap;border-bottom:1px solid #f8f8f8;padding-right:0}[dir=rtl] th.ConservationStatus-status{padding-left:0;padding-right:.5rem}td.ConservationStatus-badge{width:1%;white-space:nowrap;text-transform:uppercase}td.ConservationStatus-percent .ConservationStatus-percent-heading{color:#6a6a6a;font-size:.63rem;line-height:1.19;display:flex;justify-content:space-between}td.ConservationStatus-percent{padding-left:0;padding-right:0}td.ConservationStatus-percent .ConservationStatus-percent-wrapper{background-color:#f8f8f8;height:1rem;width:100%;position:relative}td.ConservationStatus-percent .ConservationStatus-percent-bar{height:1rem;width:100%;position:absolute;background-color:#ccc}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-lc{background-color:#68bb53}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-nt{background-color:#d1e744}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-vu{background-color:#e5d42d}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-en{background-color:#e77b4d}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-cr{background-color:#b61917}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-ex{background-color:#000}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-ew{background-color:#542344}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-dd{background-color:#595959}td.ConservationStatus-percent .ConservationStatus-percent-bar.u-color-constatus-ne{background-color:#ccc}td.ConservationStatus-percent .ConservationStatus-percent-label{position:absolute;font-weight:700;font-size:.63rem;line-height:1.19;color:#232323;padding:2px 4px}td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-cr,td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-dd,td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-ew,td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-ex{color:#f8f8f8}td.ConservationStatus-percent .ConservationStatus-percent-label--inside{left:auto;right:0}[dir=rtl] td.ConservationStatus-percent .ConservationStatus-percent-label--inside{left:0;right:auto}td.ConservationStatus-percent .ConservationStatus-percent-label--outside{left:100%;right:auto}[dir=rtl] td.ConservationStatus-percent .ConservationStatus-percent-label--outside{left:auto;right:100%}.ConservationStatus--reverse{color:#f8f8f8}.ConservationStatus--reverse .ConservationStatus-status{border-color:#6a6a6a}.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-heading{color:#d6d6d6}.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-wrapper{background-color:#232323}.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-label{color:#d6d6d6}.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-en,.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-lc,.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-ne,.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-nt,.ConservationStatus--reverse td.ConservationStatus-percent .ConservationStatus-percent-label.u-color-constatus-vu{color:#232323}.ConservationStatus--sm{font-size:.75rem;line-height:1.333}.ConservationStatus--sm td.ConservationStatus-percent .ConservationStatus-percent-bar,.ConservationStatus--sm td.ConservationStatus-percent .ConservationStatus-percent-wrapper{height:.75rem}.ConservationStatus--sm td.ConservationStatus-percent .ConservationStatus-percent-label{padding:1px 4px}",""]),t.exports=o}}]);