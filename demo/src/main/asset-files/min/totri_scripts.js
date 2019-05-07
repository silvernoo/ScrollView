window.requestAnimationFrame||(window.requestAnimationFrame=function(a){return window.setTimeout(a,16)},window.cancelAnimationFrame=function(a){window.clearTimeout(a)});
var Oreilly={Mode:{SCROLLING:1,PAGING:-1},configuration:{frames:{},isLoaded:!1,wait:0,CONTENT_LOADED:1,PAGE_COUNT_DETERMINED:2,CONTENT_SIZE_DETERMINED:4,blacklist:[".annotator-highlight",".table-wrapper",".search-result"]},onActualLoad:function(){Oreilly.configuration.isLoaded=!0;AndroidBridge.onLoad()},attemptTentativeLoad:function(){console.log("wait: "+Oreilly.configuration.wait);if(!Oreilly.configuration.isLoaded&&0==Oreilly.configuration.wait)AndroidBridge.onTentativeLoad()},addRule:function(a,
c){if(c){var b=document.getElementById(c);null!=b&&b.parentNode.removeChild(b)}b=document.createElement("style");b.id=c;b.type="text/css";b.innerHTML=a;document.head.appendChild(b);window.requestAnimationFrame(function(){if(Oreilly.configuration.mode==Oreilly.Mode.PAGING)Oreilly.calculatePageCount(!0);else AndroidBridge.onContentSizeDetermined(document.body.scrollHeight)})},getTop:function(a){return window.pageYOffset+a.getBoundingClientRect().top},getLeft:function(a){return window.pageXOffset+a.getBoundingClientRect().left},
scrollToPosition:function(a){console.log("747: Oreilly.scrollToPosition, position: "+a);AndroidBridge.onElementPositionFound(a/(Oreilly.configuration.mode==Oreilly.Mode.PAGING?document.body.scrollWidth:document.body.scrollHeight))},scrollToElement:function(a){console.log("747: Oreilly.scrollToElement, "+a);a&&(console.log("747: element is not null, scroll to it"),a=Oreilly.configuration.mode==Oreilly.Mode.PAGING?Oreilly.getLeft(a):Oreilly.getTop(a)-Oreilly.configuration.computedHeight/3,console.log("747: scrollToElement, position: "+
a),Oreilly.scrollToPosition(a))},scrollToId:function(a){a&&(a=document.getElementById(a),Oreilly.scrollToElement(a))},scrollToXpath:function(a,c){console.log("747: scrollToXpath, "+a);if(a){0==a.indexOf("/")&&(a=a.substring(1));var b=document.getElementById("sbo-rt-content");console.log("747: find element for "+a);b=(new XPath(b)).read(a);null!=b&&(console.log("747: element found "+b.tagName),Oreilly.scrollToElementAndOffset(b,c))}},scrollToElementAndOffset:function(a,c){console.log("747: scrollToElementAndOffset");
if(null==a)console.log("747: no element found to scroll to");else{var b=Dom.getNodeAndOffset(a,c),d=document.createRange();d.setStart(b.node,b.offset);b=d.getBoundingClientRect();b=Oreilly.configuration.mode==Oreilly.Mode.PAGING?window.pageXOffset+b.left:window.pageYOffset+b.top-Oreilly.configuration.computedHeight/3;console.log("747: scrollToElementAndOffset, position\x3d"+b);Oreilly.scrollToPosition(b);d.collapse()}},highlightAndScrollToRange:function(a){console.log("747: highlightAndScrollToRange");
try{console.log("747: highlighting "+JSON.stringify(a));var c={start:a.start,startOffset:a.start_offset,end:a.end,endOffset:a.end_offset},b=new Highlighter({rootNode:document.getElementById("sbo-rt-content"),tagName:"span",className:"search-result",blacklist:Oreilly.configuration.blacklist});b.clearAll();var d=b.highlightRange(c);console.log("747: highlighted.length\x3d"+d.length);var e=d[0];console.log("747: first element in range: "+e);e&&(console.log("747: scrolling to element: "+e),Oreilly.scrollToElement(e))}catch(f){AndroidBridge.onCaughtException(f.message)}},
getContainer:function(a,c){return null==a||a==document.body?null:-1<c.indexOf(a.tagName)?a:Oreilly.getContainer(a.parentElement,c)},clickDelegate:function(a){var c=a.target.tagName,b=Oreilly.getContainer(a.target,["A"]);if(null!=b&&(c=b.tagName,b=b.href,"#"==b.charAt(0)||0==b.indexOf(Oreilly.configuration.baseUrl)))return AndroidBridge.onInternalXref(b),a.preventDefault(),a.stopPropagation(),!1;"A"==c||a.target.classList.contains("annotator-highlight")||(console.log("sending unconsumed click from JS"),
AndroidBridge.onUnconsumedTap(),a.preventDefault(),a.stopPropagation())},getAnnotationsAsJson:function(a){for(var c=[];a&&a!=document.body;)a.classList.contains("annotator-highlight")&&a.annotation&&c.push(a.annotation),a=a.parentElement;return JSON.stringify(c)},clearSelection:function(){window.getSelection().isCollapsed||window.getSelection().removeAllRanges()},clearSelectionWithoutSendingTap:function(){window.addEventListener("resize",Oreilly.clearSelection,{passive:!1});window.addEventListener("touchstart",
function(a){if(!window.getSelection().isCollapsed)return Oreilly.clearSelection(),a.preventDefault(),a.stopPropagation(),!1},{passive:!1})},preventPageScroll:function(){window.addEventListener("touchmove",function(a){a.preventDefault()},{passive:!1})},setComputedDimensions:function(a,c){Oreilly.configuration.computedWidth=a;Oreilly.configuration.computedHeight=c},determineContentSize:function(){console.log("determineContentSize");Oreilly.configuration.wait|=Oreilly.configuration.CONTENT_SIZE_DETERMINED;
document.body.style.width="auto";Oreilly.configuration.frames.contentSize&&(window.cancelAnimationFrame(Oreilly.configuration.frames.contentSize),Oreilly.configuration.frames.contentSize=null);Oreilly.configuration.frames.contentSize=window.requestAnimationFrame(function(){console.log("in RAF for determine content size");Oreilly.configuration.frames.contentSize=null;AndroidBridge.onContentSizeDetermined(document.body.scrollHeight);Oreilly.relayoutExploder();Oreilly.configuration.wait&=~Oreilly.configuration.CONTENT_SIZE_DETERMINED;
Oreilly.attemptTentativeLoad()})},enableElementExploder:function(){Oreilly.configuration.exploder||(Oreilly.configuration.exploder=new Oreilly.Exploder(AndroidBridge,Oreilly.getContainer,Oreilly.configuration,document.getElementById("sbo-rt-content"),Oreilly.configuration.mode==Oreilly.Mode.PAGING),Oreilly.configuration.exploder.attach())},relayoutExploder:function(){Oreilly.configuration.exploder&&Oreilly.configuration.exploder.layout()},disableElementExploder:function(){Oreilly.configuration.exploder&&
(Oreilly.configuration.exploder.reset(),Oreilly.configuration.exploder=null)},setNavigationMode:function(a){if(a!=Oreilly.configuration.mode)switch(Oreilly.configuration.mode=a,Oreilly.configuration.exploder&&(Oreilly.configuration.exploder.isPaging=a==Oreilly.Mode.PAGING),a){case Oreilly.Mode.PAGING:Oreilly.configuration.wait&=~Oreilly.configuration.CONTENT_SIZE_DETERMINED;Oreilly.configuration.wait|=Oreilly.configuration.PAGE_COUNT_DETERMINED;Oreilly.enablePaging();break;case Oreilly.Mode.SCROLLING:Oreilly.configuration.wait&=
~Oreilly.configuration.PAGE_COUNT_DETERMINED,Oreilly.configuration.wait|=Oreilly.configuration.CONTENT_SIZE_DETERMINED,Oreilly.disablePaging(),Oreilly.determineContentSize()}},enablePaging:function(){var a=document.getElementById("sbo-rt-content"),c=window.getComputedStyle(a,null).getPropertyValue("padding-left"),c=parseInt(c,10),c=2*c;document.body.classList.add("oreilly-paging");a.style.setProperty("height",Oreilly.configuration.computedHeight+"px","important");a.style.webkitColumnWidth=Oreilly.configuration.computedWidth-
c+"px";a.style.webkitColumnGap=c+"px";Oreilly.configuration.frames.enablePagingFrame&&(window.cancelAnimationFrame(Oreilly.configuration.frames.enablePagingFrame),Oreilly.configuration.frames.enablePagingFrame=null);Oreilly.configuration.frames.calculatePageFrame&&(window.cancelAnimationFrame(Oreilly.configuration.frames.calculatePageFrame),Oreilly.configuration.frames.calculatePageFrame=null);Oreilly.configuration.frames.enablePagingFrame=window.requestAnimationFrame(function(){Oreilly.calculatePageCount(!0)})},
calculatePageCount:function(a){document.body.style.width="";var c=document.getElementById("sbo-rt-content"),b=0==c.scrollWidth?1:Math.ceil(c.scrollWidth/Oreilly.configuration.computedWidth);document.body.style.width=b*Oreilly.configuration.computedWidth+"px";c=function(){AndroidBridge.onPageCountDetermined(b);Oreilly.relayoutExploder();Oreilly.configuration.wait&=~Oreilly.configuration.PAGE_COUNT_DETERMINED;Oreilly.attemptTentativeLoad()};a?Oreilly.configuration.frames.calculatePageFrame=window.requestAnimationFrame(c):
c()},disablePaging:function(){document.body.classList.remove("oreilly-paging");document.body.style.width="";var a=document.getElementById("sbo-rt-content");a.style.padding="";a.style.height="";a.style.webkitColumnWidth="";a.style.webkitColumnGap=""},setNightMode:function(a){a?document.body.classList.add("night"):document.body.classList.remove("night")},setupSelectionChangePublisher:function(){document.addEventListener("selectionchange",function(a){console.log("selection changed");a=window.getSelection().toString();
AndroidBridge.onSelectionChange(a)})},recomputePagingLayout:function(a,c){Oreilly.setComputedDimensions(a,c);Oreilly.enablePaging()}};Oreilly.configuration.wait|=Oreilly.configuration.CONTENT_LOADED;