/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[76],{1038:function(t,e,l){"use strict";l.r(e);l(15);var o=l(159),n=l(26),r=l(525),c=l(561),y={components:{CloButton:o.default,CloIcon:n.default,CloSpectrogramPlayer:r.default,CloLogoMacaulayMobile:c.default},data:function(){return{active:!1,currentTrack:0,showPlayer:!0}},props:{title:{type:String,required:!0},list:{type:Array,required:!0},moreUrl:{type:String,default:null}},computed:{player:function(){var track=this.list[this.currentTrack],t=[];return track.asset.hasOwnProperty("locName")&&track.asset.locName&&t.push(track.asset.locName),track.asset.hasOwnProperty("subnational2Name")&&track.asset.subnational2Name&&t.push(track.asset.subnational2Name),track.asset.hasOwnProperty("subnational1Name")&&track.asset.subnational1Name&&t.push(track.asset.subnational1Name),track.asset.hasOwnProperty("countryName")&&track.asset.countryName&&t.push(track.asset.countryName),track.asset.location=t.join(", "),track}},methods:{open:function(){var t=this;this.active=!0,this.$nextTick((function(){t.$refs.playlist.focus()}))},close:function(){this.active=!1,this.$refs.listen.focus()},playTrack:function(t){var e=this;this.showPlayer=!1,this.currentTrack=t,this.$nextTick((function(){e.showPlayer=!0}))}}},d=(l(915),l(2)),component=Object(d.a)(y,(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",[l("div",{staticClass:"Playlist-listen"},[l("button",{ref:"listen",staticClass:"Button Button--pill Button--huge Button--highlight",on:{click:t.open}},[l("CloIcon",{attrs:{symbol:"audio"}}),t._v("\n\t\t\t"+t._s(t.$t("species.listen"))+"\n\t\t")],1),t._v(" "),t.list.length>1?l("button",{staticClass:"Playlist-listenMore"},[t._v("\n\t\t\t+\n\t\t\t"),t.list.length>2?l("span",[t._v(t._s(t.$t("species.moreAudioRecordings",[t.list.length-1])))]):l("span",[t._v(t._s(t.$t("species.moreAudioRecording",[1])))])]):t._e(),t._v(" "),t.moreUrl&&1===t.list.length?l("a",[t._v(t._s(t.$t("species.moreAudio")))]):t._e()]),t._v(" "),l("transition",{attrs:{name:"fade"}},[t.active?l("div",{staticClass:"Playlist-backdrop",on:{click:t.close}}):t._e()]),t._v(" "),l("transition",{attrs:{name:"slideUp"}},[t.active?l("div",{ref:"playlist",staticClass:"Playlist Playlist--reverse",class:{active:t.open},attrs:{tabindex:"-1",role:"dialog"},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"escape",void 0,e.key,void 0)?null:(e.stopPropagation(),e.preventDefault(),t.close.apply(null,arguments))}}},[l("div",{staticClass:"Playlist-header"},[l("h1",{staticClass:"Playlist-heading"},[t._v(t._s(t.title))]),t._v(" "),l("div",{staticClass:"Playlist-branding"},[l("CloLogoMacaulayMobile",{staticClass:"LogoMacaulayMobile--reverse LogoMacaulayMobile--xs"})],1)]),t._v(" "),t.showPlayer?l("CloSpectrogramPlayer",{staticClass:"SpectrogramPlayer--sm SpectrogramPlayer--primary SpectrogramPlayer--withMeta",attrs:{size:"sm",autoplay:"",title:t.player.title,assetId:t.player.asset.assetId.toString(),citationUrl:t.player.asset.citationUrl,citationName:t.player.asset.citationName,user:t.player.asset.userDisplayName,location:t.player.asset.location,date:t.player.asset.obsDtDisplay}}):t._e(),t._v(" "),l("div",{staticClass:"Playlist-tracks"},t._l(t.list,(function(e,o){return l("button",{key:o,staticClass:"Button Button--fauxRadio Button--reverse Button--icon Button--left",class:{active:t.currentTrack===o},attrs:{type:"button"},on:{click:function(e){return t.playTrack(o)}}},[l("CloIcon",{staticClass:"u-inline-sm",attrs:{symbol:"audio"}}),t._v("\n\t\t\t\t\t"+t._s(e.title)+"\n\t\t\t\t\t"),t.currentTrack===o?l("span",{staticClass:"Playlist-playingStatus"},[t._v(t._s(t.$t("species.playing")))]):t._e()],1)})),0),t._v(" "),l("div",{staticClass:"Playlist-footer"},[l("button",{staticClass:"Button Button--reverse Button--expanded",attrs:{type:"button"},on:{click:t.close}},[t._v(t._s(t.$t("generic.Close")))])])],1):t._e()])],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{CloIcon:l(26).default,CloLogoMacaulayMobile:l(561).default,CloSpectrogramPlayer:l(525).default})},709:function(t,e,l){var content=l(916);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,l(14).default)("7b5dd2be",content,!0,{sourceMap:!1})},915:function(t,e,l){"use strict";l(709)},916:function(t,e,l){var o=l(13)(!1);o.push([t.i,"@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.Playlist{background-color:#113245;border-radius:3px;box-shadow:0 2px 4px rgba(0,0,0,.2);position:fixed;top:auto;bottom:0;left:0;right:0;width:100%;max-height:100vh;z-index:1007;transform:translate(0);display:flex;flex-direction:column}@media(min-width:768px){.Playlist{top:50%;bottom:auto;left:50%;right:auto;max-width:60rem;min-width:40vw;max-height:100vh;min-height:20rem;transform:translate(-50%,-50%)}}.Playlist.slideUp-enter-active,.Playlist.slideUp-leave-active{transition:transform .4s}.Playlist.slideUp-enter,.Playlist.slideUp-leave-to{transform:translateY(100%)}@media(min-width:768px){.Playlist.slideUp-enter,.Playlist.slideUp-leave-to{transform:translate(-50%,50%)}}.Playlist .Playlist-header{flex:1 0 auto;display:flex;flex-wrap:nowrap;align-items:center}.Playlist .Playlist-heading{flex:1 0 auto;font-size:.85rem;margin-bottom:0;padding:.5rem}.Playlist .Playlist-branding{padding:.5rem}.Playlist .Playlist-tracks{display:flex;flex-direction:column;flex:0 1 auto;overflow-y:auto}.Playlist .Playlist-tracks .Button{margin-bottom:-1px;color:#8ad4ff}.Playlist .Playlist-tracks .Button .Playlist-playingStatus{font-size:.75rem;font-weight:400;text-transform:uppercase;margin-left:1rem}.Playlist .Playlist-tracks .Button.active{color:#fff}.Playlist .Playlist-footer{border-top:1px solid #6a6a6a;text-align:center;padding:1rem}.Playlist .Playlist-footer .Button{margin-bottom:0}.Playlist-backdrop{position:fixed;top:0;bottom:0;left:0;right:0;background-color:rgba(33,33,33,.8)}.Playlist-backdrop.fade-enter-active,.Playlist-backdrop.fade-leave-active{transition:opacity .2s}.Playlist-backdrop.fade-enter,.Playlist-backdrop.fade-leave-to{opacity:0}.Playlist--reverse{background-color:#113245}.Playlist--reverse .Playlist-heading{color:#fff}.Playlist-listen{display:inline-block;text-align:center}.Playlist-listen .Playlist-listenMore{display:none;font-size:.85rem;margin-top:.5rem;color:#0070b3}@media(min-width:768px){.Playlist-listen{background-color:#f0f6fa;padding:1rem}.Playlist-listen .Playlist-listenMore{display:block}}",""]),t.exports=o}}]);