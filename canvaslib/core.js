/* cLib        Make JavaScript Simplier
 * Authors: Phoenix35 & Cron (Kapoeira)
 * Version: 0.0.1
 */

//!\\ WARNING: due to security restriction, you cannot use toCanvas in local (if protocol is file://) //!\\


/* See README for more infos
* @param   Image   Node HTMLImage, or
                   Object JavascriptImage, or
                   String ImagePath, or
                   String Data Scheme URI (data:image/)
* @param   Width   Number ImageWidth
* @param   Height  Number ImageHeight
* @return  Object JavascriptImage with libraries methods (README), or
           null   when errors
*/

var cLib = function (HTMLimg, w, h) {
 
 var img = new Image();
 
 // HTMLimg can be <img />...
 if(HTMLimg instanceof HTMLImageElement) {
    img.src = HTMLimg.src;
    img.width = (w===0)? 0 : w || HTMLimg.width;
    img.height = h || HTMLimg.height;
 }
 // ... or a string
 else if(typeof HTMLimg === "string") {
    img.src = HTMLimg;
    img.width = (w===0)? 0 : w || img.width;
    img.height = h || img.height;
 }
 else {
    alert("None valid image was given. Aborting.");
    return null;
 }
 
 
 img.toCanvas = function (context) {
  var canvas = document.createElement("canvas");
  canvas.width = this.width;
  canvas.height = this.height;
  
  var ctx = canvas.getContext(context || "2d");
  ctx.drawImage(this, 0, 0);
  ctx.putImageData(ctx.getImageData(0, 0, this.width, this.height), 0, 0);
  
  
  canvas.read = function (x, y) {
  
  }
  canvas.context = ctx;
  return canvas;
 }
 
 return img;
}