(function(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
        docEl.style.fontSize =  '100px';
      if( 50 * (clientWidth / 320) <= 100 ){
        docEl.style.fontSize = 50 * (clientWidth / 320) + 'px';
      }
    };
    recalc();
  if (!doc.addEventListener) return;

  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);