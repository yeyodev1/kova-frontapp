/**
 * Bookmarklet "Enviar a Kova".
 *
 * El dueño lo arrastra a su barra de favoritos y lo toca estando en app.dropi.ec, con SU sesión.
 * Solo lee el DOM que ya tiene en pantalla (nada de credenciales, APIs internas de Dropi ni
 * navegación automática) y se lo pasa al panel por postMessage, que valida el origen.
 *
 * Catálogo (`/dashboard/search`): se usan los selectores reales de Dropi. El id sale de
 * `data-cy="catalog-product-card-<id>"`, la foto de `img.card-image__img`, el título de
 * `h3.tittle-product` (así, con doble t), la categoría de `.category-stock` y el proveedor de
 * `.provider-name`. Dropi dibuja precios y stock en `<canvas>` a propósito para que no se copien:
 * NO se leen (ni pixeles, ni OCR, ni toDataURL). El dueño escribe el costo en el panel.
 *
 * Detalle y cualquier otra página: heurística genérica (imágenes del CDN, textos "$ 12,50" con su
 * etiqueta cercana, id en la URL o en el href de cada tarjeta). Lo que no detecte se corrige a mano.
 * Nunca se manda nada de la sesión de Dropi (cookies, localStorage): solo campos del producto.
 *
 * El código va escrito a mano en ES5 compacto: cada línea termina en `;`, `{` o `}` porque el
 * armado del href solo borra saltos de línea e indentación. Sin comentarios ni template strings
 * adentro. `__ORIGIN__` y `__LOCAL__` se reemplazan al armar el href.
 */
const SOURCE = String.raw`(function(){
var O=__ORIGIN__,LOCAL=__LOCAL__,MAX=60;
var host=location.hostname;
if(!/(^|\.)dropi\.(ec|co)$/i.test(host)&&!(LOCAL&&/^(localhost|127\.0\.0\.1)$/.test(host))){alert('Enviar a Kova funciona en app.dropi.ec. Abre un producto o el catálogo de Dropi y vuelve a tocar el favorito.');return;}
var PR=/(\$\s*\d[\d.,]*)|(\d[\d.,]*\s*USD)/i;
var PRG=/(\$\s*\d[\d.,]*)|(\d[\d.,]*\s*USD)/ig;
function tc(e){return ((e&&e.textContent)||'').replace(/\s+/g,' ').trim();}
function tx(e){return ((e&&(e.innerText||e.textContent))||'').replace(/\s+/g,' ').trim();}
function money(t){t=String(t).replace(/[^\d.,]/g,'');var i=Math.max(t.lastIndexOf(','),t.lastIndexOf('.'));if(i>=0&&t.length-i-1<=2){t=t.slice(0,i).replace(/[.,]/g,'')+'.'+t.slice(i+1);}else{t=t.replace(/[.,]/g,'');}var n=parseFloat(t);return isFinite(n)&&n>0?Math.round(n*100):null;}
function lastId(s){var m=String(s||'').match(/\d{3,}/g);return m?Number(m[m.length-1]):null;}
function abs(s){try{return new URL(s,location.href).href;}catch(x){return '';}}
function prodImg(im){if(/error-img/.test(im.className))return '';var s=im.currentSrc||im.getAttribute('src')||im.getAttribute('data-src')||'';if(!/cloudfront\.net|dropi|\/storage|amazonaws/i.test(s))return '';if(/logo|icon|avatar|flag|sprite|placeholder/i.test(s))return '';if(im.complete&&im.naturalWidth>0&&im.naturalWidth<80)return '';var r=im.getBoundingClientRect();if(r.width>0&&r.width<40&&r.height<40)return '';return abs(s);}
function inside(e,skip){for(var i=0;i<skip.length;i++){if(skip[i].contains(e))return true;}return false;}
function imgsOf(root,skip){var l=root.querySelectorAll('img'),out=[];for(var i=0;i<l.length&&out.length<12;i++){if(skip&&inside(l[i],skip))continue;var u=prodImg(l[i]);if(u&&out.indexOf(u)<0)out.push(u);}return out;}
function priceEls(root,skip){var w=document.createTreeWalker(root,4),n,out=[];while((n=w.nextNode())){if(!/\d/.test(n.nodeValue))continue;var e=n.parentElement;if(!e||/^(SCRIPT|STYLE|NOSCRIPT)$/.test(e.tagName))continue;if(skip&&inside(e,skip))continue;for(var k=0;k<3&&e;k++){var t=tc(e);if(t.length>40)break;if(PR.test(t)){if(out.indexOf(e)<0)out.push(e);break;}e=e.parentElement;}}return out;}
function kind(s){s=s.toLowerCase();if(/sugerid/.test(s))return 's';if(/saldo|cartera|billetera|ganancia|wallet|env[ií]o|flete/.test(s))return 'x';if(/proveedor|costo|precio|mayorista|dropshipp/.test(s))return 'c';return '';}
function label(e){var p=tc(e),k=kind(p.replace(PRG,''));if(k)return k;var a=e;for(var j=0;j<4;j++){a=a.parentElement;if(!a)break;var full=tc(a);if(full.length>600)break;var i=full.indexOf(p);var before=i>=0?full.slice(0,i):'';var mm=before.match(PRG);if(mm){var last=mm[mm.length-1];before=before.slice(before.lastIndexOf(last)+last.length);}k=kind(before.slice(-40));if(k)return k;}return '';}
function pricesOf(root,skip){var r={c:null,s:null,u:null},els=priceEls(root,skip);for(var i=0;i<els.length;i++){var m=tc(els[i]).match(PR),v=m?money(m[0]):null;if(!v)continue;var l=label(els[i]);if(l==='s'){if(r.s===null)r.s=v;}else if(l==='c'){if(r.c===null)r.c=v;}else if(l!=='x'){if(r.u===null)r.u=v;}}if(r.c===null)r.c=r.u;return r;}
function stockOf(t){var m=t.match(/stock[^0-9]{0,15}(\d+)/i)||t.match(/(\d+)\s*unidades?\s*disponibles?/i)||t.match(/disponibles?[^0-9]{0,12}(\d+)/i);return m?Number(m[1]):null;}
function okTitle(t){return t.length>=3&&t.length<=200&&!PR.test(t)&&!/^(stock|id\b|#\d|precio|sugerido|disponible)/i.test(t);}
function titleOf(root){var l=root.querySelectorAll('h1,h2,h3,h4,h5,[class*=name i],[class*=title i],[class*=nombre i]');for(var i=0;i<l.length;i++){var t=tx(l[i]);if(okTitle(t))return t;}var best='',bs=0,all=root.querySelectorAll('*');for(var j=0;j<all.length;j++){var e=all[j];if(e.children.length)continue;var t2=tx(e);if(!okTitle(t2))continue;var cs=getComputedStyle(e),sc=(parseFloat(cs.fontSize)||0)*(parseInt(cs.fontWeight,10)>=600?1.25:1)+Math.min(t2.length,60)/30;if(sc>bs){bs=sc;best=t2;}}if(!best){var im=root.querySelector('img[alt]');if(im&&okTitle(im.alt.trim()))best=im.alt.trim();}return best;}
function cardId(c){var as=[].slice.call(c.querySelectorAll('a[href]')),own=c.closest('a[href]'),best=null;if(own)as.unshift(own);for(var i=0;i<as.length;i++){var u;try{u=new URL(as[i].getAttribute('href'),location.href);}catch(x){continue;}if(u.host!==location.host)continue;var id=lastId(u.pathname+u.search+u.hash);if(!id)continue;if(/product|detail|producto/i.test(u.href))return id;if(best===null)best=id;}var t=tc(c),m=t.match(/\bID\s*[:#]?\s*(\d{3,})/i)||t.match(/#\s?(\d{3,})/);return m?Number(m[1]):best;}
function cardsOf(){var l=document.querySelectorAll('img'),cards=[];for(var i=0;i<l.length;i++){if(!prodImg(l[i]))continue;var a=l[i].parentElement;for(var k=0;k<8&&a&&a!==document.body;k++){var t=tc(a);if(t.length>1500)break;if(PR.test(t)){if(cards.indexOf(a)<0)cards.push(a);break;}a=a.parentElement;}}return cards.filter(function(c){return !cards.some(function(o){return o!==c&&c.contains(o);});});}
function dropiCards(){var l=document.querySelectorAll('[data-cy^="catalog-product-card-"]'),out=[];for(var i=0;i<l.length;i++){var m=(l[i].getAttribute('data-cy')||'').match(/^catalog-product-card-(\d+)$/);if(m)out.push({el:l[i],id:Number(m[1])});}return out;}
function dropiCard(c){var e=c.el,im=e.querySelector('img.card-image__img:not(.error-img)'),images=[],u=im?prodImg(im)||abs(im.currentSrc||im.src):'';if(u&&/^https?:/.test(u))images.push(u);imgsOf(e).forEach(function(x){if(images.indexOf(x)<0)images.push(x);});var h=e.querySelector('h3.tittle-product,.tittle-product,.title-product');var cat='',cs=e.querySelectorAll('.category-stock > div');for(var i=0;i<cs.length;i++){var t=tx(cs[i]);if(t&&!/stock/i.test(t)&&!cs[i].querySelector('canvas')){cat=t;break;}}var pv=e.querySelector('.provider-name');var p=pricesOf(e);return {dropiId:c.id,title:h?tx(h):titleOf(e),images:images.slice(0,12),costPrice:p.c,suggestedPrice:p.s,stock:null,category:cat.slice(0,60),supplier:pv?tx(pv).slice(0,80):'',sourceUrl:location.href};}
function descOf(){var c=[].slice.call(document.querySelectorAll('[class*=descrip i],[id*=descrip i]'));var hs=document.querySelectorAll('h2,h3,h4,h5,h6,strong,b,label,dt,legend,span,p');for(var i=0;i<hs.length;i++){var t=tc(hs[i]);if(t.length<=40&&/descrip/i.test(t)){if(hs[i].nextElementSibling)c.push(hs[i].nextElementSibling);if(hs[i].parentElement)c.push(hs[i].parentElement);}}var best=null,bl=0;for(var j=0;j<c.length;j++){var n=tx(c[j]).length;if(n>=20&&n<=8000&&n>bl&&!c[j].querySelector('h1')){best=c[j];bl=n;}}return best?best.innerHTML.slice(0,20000):'';}
function categoryOf(){var e=document.querySelector('[class*=categor i]');var t=e?tx(e):'';return t.length>=2&&t.length<=60?t:'';}
function card(c){var p=pricesOf(c);return {dropiId:cardId(c),title:titleOf(c),images:imgsOf(c),costPrice:p.c,suggestedPrice:p.s,stock:stockOf(tc(c)),sourceUrl:location.href};}
function detail(id,cards){var others=cards.filter(function(c){return cardId(c)!==id;});var main=document.querySelector('main')||document.body;var p=pricesOf(main,others);var h=document.querySelector('h1');var t=h&&okTitle(tx(h))?tx(h):titleOf(main);return {dropiId:id,title:t,images:imgsOf(document.body,others),costPrice:p.c,suggestedPrice:p.s,stock:stockOf(tc(main)),description:descOf(),category:categoryOf(),sourceUrl:location.href};}
function toast(m,err){var d=document.getElementById('kova-clip-toast');if(!d){d=document.createElement('div');d.id='kova-clip-toast';d.setAttribute('role','status');document.body.appendChild(d);}d.textContent=m;d.style.cssText='position:fixed;z-index:2147483647;right:16px;bottom:16px;max-width:320px;padding:12px 16px;border-radius:14px;font:600 14px/1.4 system-ui,-apple-system,sans-serif;color:#fff;box-shadow:0 12px 32px rgba(0,0,0,.25);background:'+(err?'#c2554f':'#1f3329');clearTimeout(d.kovaTimer);d.kovaTimer=setTimeout(function(){d.remove();},err?8000:5000);}
var pathId=lastId(location.pathname+location.search+location.hash);
var dc=dropiCards(),cards=dc.length?[]:cardsOf(),products=[],type='list';
if(dc.length&&!/product-details|producto/i.test(location.pathname)){var seenD={};dc.forEach(function(c){if(!seenD[c.id]){seenD[c.id]=1;products.push(dropiCard(c));}});}else if(pathId&&(/product|detail|producto/i.test(location.href)||cards.length<=1)){type='detail';products=[detail(pathId,cards)];}else if(cards.length){var seen={};cards.forEach(function(c){var p=card(c),k=p.dropiId?'id'+p.dropiId:'img'+(p.images[0]||Math.random());if(!seen[k]&&(p.images.length||p.title)){seen[k]=1;products.push(p);}});}else if(imgsOf(document.body).length){type='detail';products=[detail(pathId,[])];}
if(type==='detail'&&!products[0].images.length&&!products[0].title)products=[];
if(!products.length){toast('No encontré productos en esta página. Abre la ficha de un producto o el catálogo de Dropi.',1);return;}
var extra=products.length>MAX?products.length-MAX:0;
products=products.slice(0,MAX);
toast('Enviando '+products.length+(products.length===1?' producto':' productos')+' a Kova…'+(extra?' ('+extra+' quedaron fuera: máximo '+MAX+')':''));
var win=window.open(O+'/admin/dropi/traer','kova-clip');
if(!win){toast('Tu navegador bloqueó la ventana de Kova. Permite ventanas emergentes en esta página y vuelve a tocar el favorito.',1);return;}
var msg={type:'kova-clip',version:1,pageType:type,sourceUrl:location.href,products:products},sent=false,tries=0,timer;
function onMsg(e){if(sent||e.origin!==O||!e.data||e.data.type!=='kova-clip-ready')return;sent=true;clearInterval(timer);window.removeEventListener('message',onMsg);(e.source||win).postMessage(msg,O);toast('Listo. Elige en Kova cuáles importar.');}
window.addEventListener('message',onMsg);
timer=setInterval(function(){tries++;try{win.postMessage({type:'kova-clip-ping'},O);}catch(x){}if(tries>=20){clearInterval(timer);window.removeEventListener('message',onMsg);if(!sent)toast('Kova no respondió. Inicia sesión en el panel de Kova y vuelve a tocar el favorito.',1);}},500);
})();`

/** Código listo para ejecutar (sin el prefijo `javascript:`). Útil para probar en consola. */
export function dropiClipperCode(origin: string, allowLocal = false): string {
  return SOURCE.replace(/\n\s*/g, '')
    .replace('__ORIGIN__', JSON.stringify(origin.replace(/\/+$/, '')))
    .replace('__LOCAL__', allowLocal ? 'true' : 'false')
}

/**
 * Href del favorito. El origen sale del panel que lo genera, así funciona igual en local y en
 * kovashopper.com. En desarrollo también corre en localhost para probarlo con páginas falsas.
 */
export function dropiClipperHref(
  origin: string = window.location.origin,
  allowLocal: boolean = import.meta.env.DEV,
): string {
  return `javascript:${encodeURIComponent(dropiClipperCode(origin, allowLocal))}`
}

const DROPI_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*dropi\.(ec|co)$/i
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

/** Solo se aceptan datos que vengan de Dropi (y de localhost en desarrollo, para las pruebas). */
export function isDropiOrigin(origin: string): boolean {
  if (DROPI_ORIGIN.test(origin)) return true
  return import.meta.env.DEV && LOCAL_ORIGIN.test(origin)
}
