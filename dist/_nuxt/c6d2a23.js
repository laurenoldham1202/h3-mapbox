/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{534:function(e,n,l){var content=l(584);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,l(14).default)("a298645c",content,!0,{sourceMap:!1})},583:function(e,n,l){"use strict";l(534)},584:function(e,n,l){var t=l(13)(!1);t.push([e.i,"@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.FixedPanels{width:100%;height:100vh;height:calc(var(--vh, 1vh)*100);display:flex;flex-direction:column;overflow:hidden}.FixedPanels-header{position:relative;flex-shrink:0}.FixedPanels-header:empty{display:none}.FixedPanels-footer{position:relative;flex-shrink:0}.FixedPanels-footer:empty{display:none}.FixedPanels-main{overflow:hidden}.FixedPanels-main,.FixedPanels-main-content{flex-grow:1;position:relative;display:flex;height:100%}.FixedPanels-main-content{flex-shrink:1;flex-basis:auto;width:100%;flex-direction:column}.FixedPanels-main-content:empty{display:none}.FixedPanels-main-sub{flex-grow:1;flex-shrink:0;flex-basis:auto;display:flex;flex-direction:column;position:absolute;top:0;bottom:0;right:0;width:20rem;width:var(--subWidth,20rem);max-width:calc(100vw - 3rem);height:100%;box-shadow:0 -4px 8px rgba(0,0,0,.2);z-index:10}[dir=rtl] .FixedPanels-main-sub{right:auto;left:0}.FixedPanels-main-sub:empty{display:none}.FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:translateX(100%);box-shadow:none}[dir=rtl] .FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:translateX(-100%)}.FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(180deg)}[dir=rtl] .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(0deg)}@media(min-width:768px){.FixedPanels-main-sub{position:relative;box-shadow:none;transform:none;top:auto}.FixedPanels-main-sub[data-fixedpanels-hidden=true]{position:absolute}}.FixedPanels-main-sub-toggle{position:absolute;top:0;left:0;padding:.5rem 0 .5rem .5rem;line-height:0;z-index:10;transform:translateX(-100%)}[dir=rtl] .FixedPanels-main-sub-toggle{left:auto;right:0;padding-right:.5rem;padding-left:0;transform:translateX(100%)}.FixedPanels-main-sub-toggle .FixedPanels-main-sub-toggle-button{display:flex;align-items:center;color:#757575;background-color:#fff;border-radius:3px;padding:1rem 1px;border:1px solid #d6d6d6;border-right-style:none;border-radius:3px 0 0 3px}.FixedPanels-main-sub-toggle .FixedPanels-main-sub-toggle-button .Icon{width:1rem;height:1rem;transition:transform .4s ease .1s;transform:rotate(0deg)}[dir=rtl] .FixedPanels-main-sub-toggle .FixedPanels-main-sub-toggle-button .Icon{transform:rotate(180deg)}.FixedPanels-main-sub-toggle .FixedPanels-main-sub-toggle-button span{margin-left:1px;font-size:.75rem;line-height:1.333;line-height:1}.FixedPanels-main-sub-toggle .FixedPanels-main-sub-toggle-button:active,.FixedPanels-main-sub-toggle .FixedPanels-main-sub-toggle-button:focus,.FixedPanels-main-sub-toggle .FixedPanels-main-sub-toggle-button:hover{color:#0070b3;background-color:#fff;border-color:#0070b3}.FixedPanels-main-sub-toggle--floating{padding:.5rem!important}.FixedPanels-main-sub-toggle--floating .FixedPanels-main-sub-toggle-button{padding:.5rem!important;border-style:solid!important;border-radius:3px!important;box-shadow:0 1px 4px rgba(0,0,0,.1)}.FixedPanels-panelInner-fixed{flex-grow:0;flex-shrink:0;flex-basis:auto;position:relative}.FixedPanels-panelInner-fixed:empty{display:none}.FixedPanels-panelInner-scroll{flex-grow:1;flex-shrink:1;flex-basis:100%;position:relative;overflow-y:auto;min-height:0}.FixedPanels-panelInner-scroll:empty{display:none}.FixedPanels--reverse .FixedPanels-main-sub{background-color:#2f2f2f}.FixedPanels--reverse .FixedPanels-panelFooter,.FixedPanels--reverse .FixedPanels-panelHeader{border-color:#6a6a6a}.FixedPanels--reverse .FixedPanels-main-sub-toggle-button{color:#d6d6d6;background-color:#212121;border-color:#757575}.FixedPanels--reverse .FixedPanels-main-sub-toggle-button:active,.FixedPanels--reverse .FixedPanels-main-sub-toggle-button:focus,.FixedPanels--reverse .FixedPanels-main-sub-toggle-button:hover{color:#8ad4ff;background-color:#212121;border-color:#8ad4ff}.FixedPanels--subBorder .FixedPanels-main-sub{border:0 solid #d6d6d6}.FixedPanels--subBorder.FixedPanels--reverse .FixedPanels-main-sub{border-color:#757575}.FixedPanels--subBorder .FixedPanels-main-sub{border-left-width:1px}.FixedPanels--vertical .FixedPanels-main{flex-direction:column}.FixedPanels--vertical .FixedPanels-main-content{flex-grow:1;flex-shrink:1;flex-basis:100%;height:auto}.FixedPanels--vertical .FixedPanels-main-content .FixedPanels-panelInner-scroll{flex-basis:auto;height:0}.FixedPanels--vertical .FixedPanels-main-sub{flex-grow:0;flex-shrink:0;flex-basis:auto;height:100%;max-height:50%;width:100%;max-width:none;position:relative;box-shadow:none;transition:none;border-width:1px 0 0}.FixedPanels--vertical .FixedPanels-main-sub .FixedPanels-main-sub-toggle{top:0;left:auto;right:0;padding:.5rem .5rem 0;transform:translateY(-100%)}.FixedPanels--vertical .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button{padding:1px 1rem;border-radius:3px 3px 0 0;border-style:solid solid none}.FixedPanels--vertical .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(90deg)}.FixedPanels--vertical .FixedPanels-main-sub .FixedPanels-panelInner-scroll{flex-basis:100%;height:100%}.FixedPanels--vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:none;height:auto}.FixedPanels--vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(-90deg)}.FixedPanels--vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelInner-fixed{flex-grow:0;flex-shrink:0;flex-basis:auto}.FixedPanels--vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelInner-scroll{flex-basis:0;height:0}@media(min-width:768px){.FixedPanels--vertical .FixedPanels-main-sub{flex-grow:0;height:auto}.FixedPanels--vertical .FixedPanels-main-sub .FixedPanels-panelInner-scroll{height:auto;flex-basis:auto}}@media(max-width:768px){.FixedPanels--sm-vertical .FixedPanels-main{flex-direction:column}.FixedPanels--sm-vertical .FixedPanels-main-content{flex-grow:1;flex-shrink:1;flex-basis:100%;height:auto}.FixedPanels--sm-vertical .FixedPanels-main-content .FixedPanels-panelInner-scroll{flex-basis:auto;height:0}.FixedPanels--sm-vertical .FixedPanels-main-sub{flex-grow:0;flex-shrink:0;flex-basis:auto;height:100%;max-height:50%;width:100%;max-width:none;position:relative;box-shadow:none;transition:none;border-width:1px 0 0}.FixedPanels--sm-vertical .FixedPanels-main-sub .FixedPanels-main-sub-toggle{top:0;left:auto;right:0;padding:.5rem .5rem 0;transform:translateY(-100%)}.FixedPanels--sm-vertical .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button{padding:1px 1rem;border-radius:3px 3px 0 0;border-style:solid solid none}.FixedPanels--sm-vertical .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(90deg)}.FixedPanels--sm-vertical .FixedPanels-main-sub .FixedPanels-panelInner-scroll{flex-basis:100%;height:100%}.FixedPanels--sm-vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:none;height:auto}.FixedPanels--sm-vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(-90deg)}.FixedPanels--sm-vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelInner-fixed{flex-grow:0;flex-shrink:0;flex-basis:auto}.FixedPanels--sm-vertical .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelInner-scroll{flex-basis:0;height:0}}@media(max-width:768px)and (min-width:768px){.FixedPanels--sm-vertical .FixedPanels-main-sub{flex-grow:0;height:auto}.FixedPanels--sm-vertical .FixedPanels-main-sub .FixedPanels-panelInner-scroll{height:auto;flex-basis:auto}}.FixedPanels--subFirst .FixedPanels-main-sub{order:-1;right:auto;left:0;border-width:0 1px 0 0}.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle{left:auto;right:0;padding:.5rem .5rem .5rem 0;transform:translateX(100%)}[dir=rtl] .FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle{transform:translateX(-100%)}.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button{border-radius:0 3px 3px 0;border-style:solid solid solid none}.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(180deg)}[dir=rtl] .FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(0deg)}.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:translateX(-100%)}[dir=rtl] .FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:translateX(100%)}.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(0deg)}[dir=rtl] .FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(180deg)}@media(max-width:768px){.FixedPanels--sm-subFirst .FixedPanels-main-sub{order:-1;right:auto;left:0;border-width:0 1px 0 0}.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle{left:auto;right:0;padding:.5rem .5rem .5rem 0;transform:translateX(100%)}[dir=rtl] .FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle{transform:translateX(-100%)}.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button{border-radius:0 3px 3px 0;border-style:solid solid solid none}.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(180deg)}[dir=rtl] .FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(0deg)}.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:translateX(-100%)}[dir=rtl] .FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true]{transform:translateX(100%)}.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(0deg)}[dir=rtl] .FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(180deg)}}.FixedPanels--vertical.FixedPanels--subFirst .FixedPanels-main-sub{border-width:0 0 1px}.FixedPanels--vertical.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle{top:auto;bottom:0;padding:0 .5rem .5rem;transform:translateY(100%)}.FixedPanels--vertical.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button{border-radius:0 0 3px 3px;border-style:none solid solid}.FixedPanels--vertical.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(-90deg)}.FixedPanels--vertical.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true]{flex:0 1 auto!important;height:auto;transform:none}.FixedPanels--vertical.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(90deg)}.FixedPanels--vertical.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelBody{flex:0 1 0;height:0}@media(max-width:768px){.FixedPanels--sm-vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub,.FixedPanels--sm-vertical.FixedPanels--subFirst .FixedPanels-main-sub,.FixedPanels--vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub{border-width:0 0 1px}.FixedPanels--sm-vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle,.FixedPanels--sm-vertical.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle,.FixedPanels--vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle{top:auto;bottom:0;padding:0 .5rem .5rem;transform:translateY(100%)}.FixedPanels--sm-vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button,.FixedPanels--sm-vertical.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button,.FixedPanels--vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle-button{border-radius:0 0 3px 3px;border-style:none solid solid}.FixedPanels--sm-vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight,.FixedPanels--sm-vertical.FixedPanels--subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight,.FixedPanels--vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(-90deg)}.FixedPanels--sm-vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true],.FixedPanels--sm-vertical.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true],.FixedPanels--vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true]{flex:0 1 auto!important;height:auto;transform:none}.FixedPanels--sm-vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight,.FixedPanels--sm-vertical.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight,.FixedPanels--vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-main-sub-toggle .Icon--triangleRight{transform:rotate(90deg)}.FixedPanels--sm-vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelBody,.FixedPanels--sm-vertical.FixedPanels--subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelBody,.FixedPanels--vertical.FixedPanels--sm-subFirst .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelBody{flex:0 1 0;height:0}}.FixedPanels--subSmall .FixedPanels-main-sub{width:16rem}.FixedPanels--subSmall.FixedPanels--vertical .FixedPanels-main-sub{width:100%;max-width:none;max-height:33%}@media(max-width:768px){.FixedPanels--subSmall.FixedPanels--sm-vertical .FixedPanels-main-sub{width:100%;max-width:none;max-height:33%}}.FixedPanels--subLarge .FixedPanels-main-sub{width:24rem}.FixedPanels--subLarge.FixedPanels--vertical .FixedPanels-main-sub{width:100%;max-width:none;max-height:75%}@media(max-width:768px){.FixedPanels--subLarge.FixedPanels--sm-vertical .FixedPanels-main-sub{width:100%;max-width:none;max-height:75%}}.FixedPanels--fitContent.FixedPanels--vertical .FixedPanels-main .FixedPanels-main-content{flex-shrink:0;flex-basis:auto}@media(max-width:768px){.FixedPanels--fitContent.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-main-content{flex-shrink:0;flex-basis:auto}}.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main{overflow-y:auto;-webkit-overflow-scrolling:touch}.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main .FixedPanels-main-content,.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main .FixedPanels-main-sub{flex:0 0 auto;width:100%;max-width:none;height:auto;max-height:none}.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main .FixedPanels-main-content{flex-direction:row;flex-wrap:wrap}.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main .FixedPanels-main-content .FlexPanels-panelInner-fixed,.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main .FixedPanels-main-content .FlexPanels-panelInner-scroll{flex-basis:100%}.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main .FixedPanels-panelInner-scroll{overflow-y:visible;height:auto}.FixedPanels--scrollMain.FixedPanels--vertical .FixedPanels-main .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelInner-scroll{overflow-y:hidden}@media(max-width:768px){.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main{overflow-y:auto;-webkit-overflow-scrolling:touch}.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-main-content,.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-main-sub{flex:0 0 auto;width:100%;max-width:none;height:auto;max-height:none}.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-main-content{flex-direction:row;flex-wrap:wrap}.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-main-content .FlexPanels-panelInner-fixed,.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-main-content .FlexPanels-panelInner-scroll{flex-basis:100%}.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-panelInner-scroll{overflow-y:visible;height:auto}.FixedPanels--scrollMain.FixedPanels--sm-vertical .FixedPanels-main .FixedPanels-main-sub[data-fixedpanels-hidden=true] .FixedPanels-panelInner-scroll{overflow-y:hidden}}.FixedPanels--fullScreenOverlay{position:fixed;top:0;left:0;right:0;bottom:0}",""]),e.exports=t},729:function(e,n,l){"use strict";l.r(n);l(15);var t={name:"CloFixedPanels",components:{CloIcon:l(26).default},props:{reverse:{type:Boolean,default:!1},subBorder:{type:Boolean,default:!1},vertical:{type:Boolean,default:!1},verticalSmallOnly:{type:Boolean,default:!1},subFirst:{type:Boolean,default:!1},subFirstSmallOnly:{type:Boolean,default:!1},subAlwaysOpen:{type:Boolean,default:!1},subWidth:{type:String,default:"20rem"},fitContent:{type:Boolean,default:!1},floatingToggle:{type:Boolean,default:!1},contentClose:{type:Boolean,default:!1},showText:{type:String,default:"Show panel"},hideText:{type:String,default:"Hide panel"}},computed:{classes:function(){var e=[];return this.reverse&&e.push("FixedPanels--reverse u-colorReverse"),this.subBorder&&e.push("FixedPanels--subBorder"),this.vertical&&e.push("FixedPanels--vertical"),this.verticalSmallOnly&&e.push("FixedPanels--sm-vertical"),this.subFirst&&e.push("FixedPanels--subFirst"),this.subFirstSmallOnly&&e.push("FixedPanels--sm-subFirst"),this.subAlwaysOpen&&e.push("FixedPanels--sm-vertical"),this.fitContent&&e.push("FixedPanels--sm-vertical FixedPanels--fitContent"),e.join(" ")},styles:function(){var e=[];return this.subWidth&&e.push("--subWidth: "+this.subWidth),e.join(" ")}},data:function(){return{showSubPanel:!0}},watch:{showSubPanel:function(){this.$emit("sub-panel-visible",this.showSubPanel)}},mounted:function(){this.showSubPanel=window.matchMedia("(min-width: 768px)").matches,window.matchMedia("(min-width: 768px)").addListener(this.handleResize)},methods:{handleClickOnContent:function(e){this.contentClose&&this.showSubPanel&&(this.showSubPanel=!1)},handleResize:function(e){this.showSubPanel=e.matches}}},d=(l(583),l(2)),component=Object(d.a)(t,(function(){var e=this,n=e.$createElement,l=e._self._c||n;return l("div",{staticClass:"FixedPanels",class:e.classes,style:e.styles},[l("div",{staticClass:"FixedPanels-header"},[e._t("header")],2),e._v(" "),l("div",{staticClass:"FixedPanels-main"},[l("div",{staticClass:"FixedPanels-main-content"},[l("div",{staticClass:"FixedPanels-panelInner-scroll",attrs:{tabindex:"0"},on:{click:e.handleClickOnContent}},[e._t("mainContent")],2)]),e._v(" "),l("div",{staticClass:"FixedPanels-main-sub",attrs:{"data-fixedpanels-hidden":!e.showSubPanel}},[l("span",{staticClass:"FixedPanels-main-sub-toggle",class:e.floatingToggle?"FixedPanels-main-sub-toggle--floating":""},[l("button",{staticClass:"FixedPanels-main-sub-toggle-button",attrs:{"aria-expanded":e.showSubPanel,"data-fixedpanels-expanded":e.showSubPanel},on:{click:function(n){e.showSubPanel=!e.showSubPanel}}},[l("span",{staticClass:"is-visuallyHidden"},[e.showSubPanel?[e._v(e._s(e.hideText))]:[e._v(e._s(e.showText))]],2),e._v(" "),l("CloIcon",{attrs:{symbol:"triangleRight"}})],1)]),e._v(" "),l("div",{staticClass:"FixedPanels-panelInner-fixed"},[e._t("mainSubHeader")],2),e._v(" "),l("div",{staticClass:"FixedPanels-panelInner-scroll",attrs:{tabindex:"0"}},[e._t("mainSubBody")],2),e._v(" "),l("div",{staticClass:"FixedPanels-panelInner-fixed"},[e._t("mainSubFooter")],2)])]),e._v(" "),l("div",{staticClass:"FixedPanels-footer"},[e._t("footer")],2)])}),[],!1,null,null,null);n.default=component.exports;installComponents(component,{CloIcon:l(26).default})}}]);