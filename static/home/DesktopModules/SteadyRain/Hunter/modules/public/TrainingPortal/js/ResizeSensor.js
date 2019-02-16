;(function(root,factory){if(typeof define==="function"&&define.amd){define(factory);}else if(typeof exports==="object"){module.exports=factory();}else{root.ResizeSensor=factory();}}(this,function(){var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(fn){return window.setTimeout(fn,20);};function forEachElement(elements,callback){var elementsType=Object.prototype.toString.call(elements);var isCollectionTyped=('[object Array]'===elementsType||('[object NodeList]'===elementsType)||('[object HTMLCollection]'===elementsType)||('undefined'!==typeof jQuery&&elements instanceof jQuery)||('undefined'!==typeof Elements&&elements instanceof Elements));var i=0,j=elements.length;if(isCollectionTyped){for(;i<j;i++){callback(elements[i]);}}else{callback(elements);}}
var ResizeSensor=function(element,callback){function EventQueue(){var q=[];this.add=function(ev){q.push(ev);};var i,j;this.call=function(){for(i=0,j=q.length;i<j;i++){q[i].call();}};this.remove=function(ev){var newQueue=[];for(i=0,j=q.length;i<j;i++){if(q[i]!==ev)newQueue.push(q[i]);}
q=newQueue;}
this.length=function(){return q.length;}}
function getComputedStyle(element,prop){if(element.currentStyle){return element.currentStyle[prop];}else if(window.getComputedStyle){return window.getComputedStyle(element,null).getPropertyValue(prop);}else{return element.style[prop];}}
function attachResizeEvent(element,resized){if(!element.resizedAttached){element.resizedAttached=new EventQueue();element.resizedAttached.add(resized);}else if(element.resizedAttached){element.resizedAttached.add(resized);return;}
element.resizeSensor=document.createElement('div');element.resizeSensor.className='resize-sensor';var style='position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';var styleChild='position: absolute; left: 0; top: 0; transition: 0s;';element.resizeSensor.style.cssText=style;element.resizeSensor.innerHTML='<div class="resize-sensor-expand" style="'+style+'">'+
'<div style="'+styleChild+'"></div>'+
'</div>'+
'<div class="resize-sensor-shrink" style="'+style+'">'+
'<div style="'+styleChild+' width: 200%; height: 200%"></div>'+
'</div>';element.appendChild(element.resizeSensor);if(getComputedStyle(element,'position')=='static'){element.style.position='relative';}
var expand=element.resizeSensor.childNodes[0];var expandChild=expand.childNodes[0];var shrink=element.resizeSensor.childNodes[1];var reset=function(){expandChild.style.width=100000+'px';expandChild.style.height=100000+'px';expand.scrollLeft=100000;expand.scrollTop=100000;shrink.scrollLeft=100000;shrink.scrollTop=100000;};reset();var dirty=false;var dirtyChecking=function(){if(!element.resizedAttached)return;if(dirty){element.resizedAttached.call();dirty=false;}
requestAnimationFrame(dirtyChecking);};requestAnimationFrame(dirtyChecking);var lastWidth,lastHeight;var cachedWidth,cachedHeight;var onScroll=function(){if((cachedWidth=element.offsetWidth)!=lastWidth||(cachedHeight=element.offsetHeight)!=lastHeight){dirty=true;lastWidth=cachedWidth;lastHeight=cachedHeight;}
reset();};var addEvent=function(el,name,cb){if(el.attachEvent){el.attachEvent('on'+name,cb);}else{el.addEventListener(name,cb);}};addEvent(expand,'scroll',onScroll);addEvent(shrink,'scroll',onScroll);}
forEachElement(element,function(elem){attachResizeEvent(elem,callback);});this.detach=function(ev){ResizeSensor.detach(element,ev);};};ResizeSensor.detach=function(element,ev){forEachElement(element,function(elem){if(elem.resizedAttached&&typeof ev=="function"){elem.resizedAttached.remove(ev);if(elem.resizedAttached.length())return;}
if(elem.resizeSensor){if(elem.contains(elem.resizeSensor)){elem.removeChild(elem.resizeSensor);}
delete elem.resizeSensor;delete elem.resizedAttached;}});};return ResizeSensor;}));